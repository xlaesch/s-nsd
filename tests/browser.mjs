import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
// Never submit or test the live email form. Block its service during all browser checks.
let emailRequests = 0;
await context.route("https://formsubmit.co/**", async (route) => {
  emailRequests++;
  await route.abort();
});
const page = await context.newPage();
const base = process.env.TEST_URL || "http://localhost:5173";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
mkdirSync(".qa", { recursive: true });
const loadImages = async () => {
  await page.evaluate(() => document.fonts.ready);
  await page.locator("img").evaluateAll((images) => {
    for (const image of images) image.loading = "eager";
    return Promise.all(images.map((image) => image.decode()));
  });
};
try {
  await page.goto(base);
  await loadImages();
  await page.screenshot({ path: ".qa/home-desktop.png", fullPage: true });
  assert.equal(await page.locator("h1").count(), 1);
  assert.match(await page.locator("h1").innerText(), /SEULES/);
  await page
    .getByRole("button", { name: "Bande-annonce", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.locator("header .brand").focus();
  assert.equal(
    await page
      .locator("header .brand")
      .evaluate((element) => element === document.activeElement),
    false,
  );
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(
    await page
      .locator(".trailer-sticker")
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "EN", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.match(await page.locator("h1").innerText(), /ARE WE/);
  await page.goto(base + "/programme");
  assert.equal(await page.locator(".film-card").count(), 6);
  assert.deepEqual(await page.locator(".film-card h3").allTextContents(), [
    "Maestro",
    "Signal",
    "La Fée des Roberts",
    "Tuna Tartare",
    "Jeanne & Jean Jean",
    "2:LOVE",
  ]);
  assert.doesNotMatch(
    await page.locator("main").innerText(),
    /provisional|fictional selection|TO BE CONFIRMED/i,
  );
  await page.locator(".film-card").first().click();
  await page.locator(".film-detail h1").waitFor();
  assert.match(page.url(), /programme\/maestro/);
  assert.equal(await page.locator("h1").innerText(), "Maestro");
  assert.match(
    await page.locator("dl").innerText(),
    /Illogic[\s\S]*Bloom Pictures[\s\S]*1 min 49 sec/,
  );
  for (const slug of [
    "signal",
    "la-fee-des-roberts",
    "tuna-tartare",
    "jeanne-jean-jean",
    "2-love",
  ]) {
    await page.goto(base + "/programme/" + slug);
    assert.equal(await page.locator(".film-detail h1").count(), 1);
    await loadImages();
  }
  await page.goto(base + "/seances");
  assert.equal(await page.locator(".screening-row").count(), 6);
  const projectedCities = await page.locator(".france-map").evaluate((map) => {
    const outline = map.querySelector(".france-shape");
    return [...map.querySelectorAll(".map-point")].map((point) => {
      const position =
        point.parentElement.transform.baseVal.consolidate().matrix;
      return {
        city: point.parentElement.querySelector("text").textContent,
        inside: outline.isPointInFill(new DOMPoint(position.e, position.f)),
      };
    });
  });
  assert.ok(
    projectedCities.every((city) => city.inside),
    JSON.stringify(projectedCities),
  );
  for (let step = 0; step < 2; step++) {
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    const offsets = await page.locator(".france-map").evaluate((map) => {
      const points = map.querySelectorAll(".map-point");
      return [...map.querySelectorAll(".map-hit")].map((button, index) => {
        const hit = button.getBoundingClientRect(),
          dot = points[index].getBoundingClientRect();
        return Math.hypot(
          hit.x + hit.width / 2 - dot.x - dot.width / 2,
          hit.y + hit.height / 2 - dot.y - dot.height / 2,
        );
      });
    });
    assert.ok(
      offsets.every((offset) => offset < 0.1),
      `Misaligned zoom targets: ${offsets}`,
    );
  }
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.getByLabel("Your city", { exact: true }).selectOption("Paris");
  assert.equal(await page.locator(".screening-row").count(), 1);
  await page
    .getByRole("button", { name: "View screenings in Paris", exact: true })
    .click();
  await page.locator(".screening-detail").waitFor();
  assert.match(
    await page.locator(".screening-detail").innerText(),
    /Cinéma des étoiles/,
  );
  await page.getByLabel("From date").fill("2099-01-01");
  await page.locator(".empty-state").waitFor();
  assert.equal(await page.locator(".map-hit").count(), 0);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/programme",
      "/programme/maestro",
      "/programme/signal",
      "/programme/la-fee-des-roberts",
      "/programme/tuna-tartare",
      "/programme/jeanne-jean-jean",
      "/programme/2-love",
      "/seances",
      "/presse",
      "/a-propos",
      "/contact",
      "/organiser",
      "/404",
    ]) {
      await page.goto(base + path);
      await loadImages();
      assert.equal(
        await page.locator("h1").count(),
        1,
        `Heading count on ${path}`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `Horizontal overflow on ${path} at ${width}px`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await loadImages();
  await page.screenshot({ path: ".qa/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "The programme", exact: true })
    .click();
  assert.match(page.url(), /programme$/);
  await page.goto(base + "/seances");
  await page.screenshot({ path: ".qa/screenings-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/organiser");
  await page.screenshot({ path: ".qa/organiser-desktop.png", fullPage: true });
  assert.equal(
    emailRequests,
    0,
    "No email-service requests may be made during QA",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Browser checks passed: bilingual navigation, real film metadata, all film routes, trailer dialog, map geography, zoom alignment, filters, mobile menu, image loading and layouts at 1440/768/390/320px. Email form was not submitted or tested; zero email-service requests.",
  );
} finally {
  await browser.close();
}
