import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
  ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } } : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
// Returning visitors must not see events saved by the previous demonstration.
await context.addInitScript(() => localStorage.setItem("s-nsd-demo-v1", JSON.stringify({
  applications: [],
  screenings: [{ id: "paris-1", partnerId: "demo-paris", city: "Paris", venue: "Cinéma des étoiles", date: "2099-01-01", time: "20:00", x: 51, y: 30, sample: true }],
})));
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
  const loadedFonts = await page.evaluate(async () => {
    await document.fonts.load('400 48px "cooper-black-std"');
    await document.fonts.load('300 24px "scatterplot-vf"');
    return [...document.fonts].filter((font) => font.status === "loaded").map((font) => font.family);
  });
  for (const family of ["cooper-black-std", "scatterplot-vf", "Inter"]) assert.ok(loadedFonts.includes(family), `Missing actual font: ${family}`);
  await page
    .getByRole("button", { name: "Bande-annonce", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  const programmeVideo = page.locator("dialog video");
  await page.waitForFunction(() => {
    const video = document.querySelector("dialog video");
    if (video?.error) throw new Error("Programme trailer failed to load");
    return video?.readyState >= 1;
  });
  assert.match(await programmeVideo.locator("source").getAttribute("src"), /programme-trailer\.mp4(?:\?|$)/);
  assert.ok(await programmeVideo.evaluate((video) => video.duration > 60 && video.videoWidth > 0));
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
  assert.match(await page.locator("h1").innerText(), /Musicals!/i);
  await page.goto(base + "/programme");
  assert.match(await page.locator(".page-title > p").innerText(), /Six short films, six songs, zero good reasons not to go\.[\s\S]*song stuck in your head\./);
  assert.equal(await page.locator("header .home-brand").innerText(), "Are we alone in the universe?");
  await page.locator("header .home-brand").click();
  await page.locator(".campaign-title").waitFor();
  assert.match(await page.locator("h1").innerText(), /Musicals!/i);
  await page.goto(base + "/programme");
  assert.equal(await page.locator(".film-card").count(), 6);
  assert.deepEqual(await page.locator(".film-card h3").allTextContents(), [
    "Maestro",
    "Signal",
    "The Boob Fairy",
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
  assert.match(await page.locator("video source").getAttribute("src"), /maestro-teaser\.mp4(?:\?|$)/);
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
    const video = page.locator(".film-video video");
    assert.equal(await video.count(), 1, `Missing supplied trailer: ${slug}`);
    await page.waitForFunction(() => {
      const video = document.querySelector(".film-video video");
      if (video?.error) throw new Error("Film trailer failed to load");
      return video?.readyState >= 1;
    });
    assert.ok(await video.evaluate((element) => element.duration > 0 && element.videoWidth > 0));
  }
  await page.goto(base + "/seances");
  assert.equal(await page.locator(".screening-row").count(), 0);
  assert.doesNotMatch(await page.locator("main").innerText(), /fictional|fictives|démonstration|demonstration|Cinéma des étoiles/i);
  assert.deepEqual(await page.getByLabel("Your city", { exact: true }).locator("option").allTextContents(), ["All cities", "Bordeaux", "Lille", "Lyon", "Marseille", "Montpellier", "Nantes", "Paris", "Rennes", "Strasbourg", "Toulouse"]);
  assert.equal(await page.locator(".map-hit").count(), 10);
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
  assert.equal(await page.locator(".screening-row").count(), 0);
  await page
    .getByRole("button", { name: "View screenings in Rennes", exact: true })
    .click();
  await page.waitForFunction(() => document.querySelector('.screening-filters select').value === "Rennes");
  assert.equal(await page.locator(".screening-detail").count(), 0);
  await page.locator(".empty-state").waitFor();
  await page.getByLabel("From date").fill("2099-01-01");
  await page.locator(".empty-state").waitFor();
  assert.equal(await page.locator(".map-hit").count(), 10);
  await page.goto(base + "/presse");
  assert.equal(await page.locator(".poster-download").count(), 2);
  for (const [index, filename, checksum] of [
    [0, "sommes-nous-seules-affiche-fr.png", "f41268dd6842b9c3a7742bad3b0d709c4fd953aa83972d562802bcd26b5844e6"],
    [1, "musicals-poster-en.png", "40dfc405076adadacf75e34a77192e0a1ef1a87d5c70efe5a83e605b54ed89bc"],
  ]) {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator(".poster-download").nth(index).click(),
    ]);
    assert.equal(download.suggestedFilename(), filename);
    assert.equal(createHash("sha256").update(readFileSync(await download.path())).digest("hex"), checksum);
  }
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ["fr", "en"]) {
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
        await page.goto(base + path, { waitUntil: "domcontentloaded" });
        await page.getByRole("button", { name: language.toUpperCase(), exact: true }).click();
        await loadImages();
        assert.doesNotMatch(await page.locator("body").innerText(), /stagiaire\.diffusion/i);
        for (const label of await page.locator('a[href="mailto:stagiaire.diffusion@miyu.fr"]').allTextContents()) {
          assert.equal(label, language === "fr" ? "écrivez-nous" : "email us");
        }
        if (path !== "/") {
          assert.equal(await page.locator("header .home-brand").textContent(), language === "fr" ? "Sommes-nous seules dans l’univers\u00a0?" : "Are we alone in the universe?");
          assert.equal(await page.locator("header .brand img").count(), 0);
        }
        if (path === "/programme" && language === "fr") assert.match(await page.locator(".page-title > p").innerText(), /Six courts métrages, six chansons, zéro bonne raison de ne pas y aller\.[\s\S]*une chanson en tête\./);
        if (path === "/programme" && language === "fr") {
          assert.match(await page.locator("main").innerText(), /Une visite au magasin/);
          assert.match(await page.locator("main").innerText(), /sur la court/);
        }
        const imageRatios = await page.locator(".film-image, .film-detail .film-video video").evaluateAll(elements => elements.map(element => { const rect = element.getBoundingClientRect(); return rect.width / rect.height; }));
        assert.ok(imageRatios.every(ratio => Math.abs(ratio - 16 / 9) < .01), `Non-16:9 film image on ${path} at ${width}px: ${imageRatios}`);
        if (path === "/a-propos") {
          assert.deepEqual(await page.locator(".company-logo").evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor)), ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"]);
          assert.match(await page.locator(".company-logo img").nth(0).getAttribute("src"), /miyu-black\.png$/);
          assert.match(await page.locator(".company-logo img").nth(1).getAttribute("src"), /vivement-lundi-black\.svg$/);
        }
        if (path === "/seances" && width === 320 && language === "fr") {
          await page.locator(".france-map").scrollIntoViewIfNeeded();
          const names = await page.locator(".map-city").allTextContents();
          for (let index = 0; index < names.length; index++) {
            const rect = await page.locator(".map-point").nth(index).boundingBox();
            await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
            await page.waitForFunction(name => document.querySelector('.screening-filters select').value === name, names[index]);
          }
        }
        if (path === "/") await page.screenshot({ path: `.qa/home-${language}-${width}.png` });
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
          `Horizontal overflow on ${path} at ${width}px (${language})`,
        );
      }
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
    "Browser checks passed: supplied poster downloads and checksums, empty bookings despite legacy saved data, ten cities including Rennes, map geography/zoom and filters, 16:9 film images, fonts, videos, translations, navigation, modal focus and both-language layouts at 1440/768/390/320px. Email form was not submitted or tested; zero email-service requests.",
  );
} finally {
  await browser.close();
}
