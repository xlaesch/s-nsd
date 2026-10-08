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
const page = await context.newPage();
const base = process.env.TEST_URL || "http://localhost:5173";
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
mkdirSync(".qa", { recursive: true });
try {
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".hero-art img").evaluate((img) => img.decode());
  await page.screenshot({ path: ".qa/home-desktop.png", fullPage: true });
  assert.equal(await page.locator("h1").count(), 1);
  await page.getByRole("button", { name: /BANDE-/ }).click();
  await page.getByRole("dialog").waitFor();
  await page.locator("header .brand").focus();
  assert.equal(await page.locator("header .brand").evaluate(e => e === document.activeElement), false);
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(await page.locator(".trailer-sticker").evaluate(e => e === document.activeElement), true);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.match(await page.locator("h1").innerText(), /ARE WE/);
  await page.goto(base + "/programme");
  assert.equal(await page.locator(".film-card").count(), 6);
  await page.locator(".film-card").first().click();
  assert.match(page.url(), /programme\/signal/);
  await page
    .getByRole("heading", { name: "The last signal", exact: true })
    .waitFor();
  assert.match(await page.locator("h1").innerText(), /The last signal/);
  await page.goto(base + "/seances");
  assert.equal(await page.locator(".screening-row").count(), 6);
  await page.getByLabel("Your city", { exact: true }).selectOption("Paris");
  assert.equal(await page.locator(".screening-row").count(), 1);
  assert.equal(await page.locator(".map-hit").count(), 1);
  await page.locator(".map-hit").click();
  await page.locator(".screening-detail").waitFor();
  assert.match(
    await page.locator(".screening-detail").innerText(),
    /Cinéma des étoiles/,
  );
  await page.getByLabel("From date").fill("2099-01-01");
  await page.locator(".empty-state").waitFor();
  assert.equal(await page.locator(".map-hit").count(), 0);
  await page.goto(base + "/organiser");
  await page
    .getByLabel("Organisation *", { exact: true })
    .fill("Test Collective");
  await page.getByLabel("Your name *", { exact: true }).fill("Demo Person");
  await page
    .getByLabel("Contact email *", { exact: true })
    .fill("demo@example.com");
  await page.getByLabel("Venue name *", { exact: true }).fill("Test Hall");
  await page.getByLabel("City *", { exact: true }).selectOption("Rennes");
  await page.getByLabel("Proposed date *", { exact: true }).fill("2090-12-21");
  await page
    .getByRole("button", { name: "Create my demo application" })
    .click();
  await page.getByRole("tab", { name: /Demo review/ }).click();
  await page.getByRole("button", { name: "Approve (demo)" }).click();
  assert.equal(
    await page.getByRole("button", { name: "Approve (demo)" }).count(),
    0,
  );
  await page.reload();
  await page.getByRole("tab", { name: /My resources/ }).click();
  assert.equal(await page.locator(".resource-download:disabled").count(), 0);
  await page.locator(".resource-download").first().click();
  await page.getByText("Demo access granted.", { exact: false }).waitFor();
  await page.goto(base + "/seances");
  assert.equal(await page.locator(".screening-row").count(), 7);
  await page.getByLabel("Your city", { exact: true }).selectOption("Rennes");
  assert.equal(await page.locator(".screening-row").count(), 1);
  await page.goto(base);
  assert.equal(
    await page.locator(".stat").first().locator("span").innerText(),
    "07",
  );
  await page.goto(base + "/organiser");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.getByRole("tab", { name: /My resources/ }).click();
  assert.equal(await page.locator(".resource-download:disabled").count(), 5);
  for (const path of ["/presse", "/a-propos", "/contact", "/not-here"]) {
    await page.goto(base + path);
    assert.equal(await page.locator("h1").count(), 1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.screenshot({ path: ".qa/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "The programme", exact: true })
    .click();
  assert.match(page.url(), /programme$/);
  for (const path of [
    "/",
    "/programme",
    "/programme/signal",
    "/seances",
    "/presse",
    "/a-propos",
    "/contact",
    "/organiser",
    "/404",
  ]) {
    await page.goto(base + path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert.equal(overflow, false, `Horizontal overflow on ${path}`);
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      );
    assert.deepEqual(broken, [], `Broken images on ${path}`);
  }
  await page.goto(base + "/seances");
  await page.screenshot({ path: ".qa/screenings-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/organiser");
  await page.screenshot({ path: ".qa/organiser-desktop.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "Browser checks passed: routes, bilingual navigation, trailer dialog, filters, map selection, application approval, persistence, resources, reset, mobile menu, overflow and image loading.",
  );
} finally {
  await browser.close();
}
