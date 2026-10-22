import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = (process.env.TEST_URL || "http://localhost:5173").replace(/\/$/, "");
const cases = [
  ["", "programme-trailer-vf.mp4", 1920, 1080, 64.75, "fr"],
  ["", "programme-trailer-veng.mp4", 1920, 1080, 64.75, "en"],
  ["maestro", "maestro-teaser.mp4", 1920, 1080, 20.308],
  ["signal", "signal-teaser.mp4", 1920, 1080, 55],
  ["la-fee-des-roberts", "boob-fairy-trailer.mp4", 2048, 1152, 59.208],
  ["tuna-tartare", "tuna-tartare-trailer.mp4", 1920, 1080, 60.667],
  ["jeanne-jean-jean", "jeanne-jean-jean-trailer.mp4", 3840, 2160, 41.833],
  ["2-love", "2-love-trailer.mp4", 1998, 1080, 44.76],
];
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--autoplay-policy=document-user-activation-required"],
  ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } } : {}),
});
const context = await browser.newContext();
let emailRequests = 0;
await context.route("https://formsubmit.co/**", async (route) => {
  emailRequests++;
  await route.abort();
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  for (const [slug, filename, width, height, duration, lang = "fr"] of cases) {
    const response = await page.goto(base + (slug ? "/programme/" : "/"), { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200, `Page failed: ${slug || "home"}`);
    await page.getByRole("button", { name: lang.toUpperCase(), exact: true }).click();
    if (slug) await page.locator(`.film-card[href$="/programme/${slug}"]`).click();
    else await page.getByRole("button", { name: lang === "fr" ? "Bande-annonce" : "Watch the trailer", exact: true }).click();
    const video = page.locator(slug ? ".film-video video" : "dialog video");
    await page.waitForFunction(() => {
      const element = document.querySelector(".film-video video");
      if (element?.error) throw new Error(`Video error ${element.error.code}: ${element.error.message}`);
      return element?.readyState >= 1;
    }, null, { timeout: 60000 });
    assert.ok(new URL(await video.locator("source").getAttribute("src"), base).pathname.endsWith(`/videos/${filename}`));
    const metadata = await video.evaluate((element) => ({ width: element.videoWidth, height: element.videoHeight, duration: element.duration }));
    assert.deepEqual([metadata.width, metadata.height], [width, height], `Resolution changed: ${filename}`);
    assert.ok(Math.abs(metadata.duration - duration) < 0.1, `Duration changed: ${filename}`);
    assert.equal(await video.getAttribute("controls"), "");
    // A real click must start playback with sound, without a second play command.
    await page.waitForFunction(() => {
      const element = document.querySelector(".film-video video");
      return !element.paused && !element.muted && element.currentTime > 0.25;
    }, null, { timeout: 60000 });
    await video.evaluate((element) => element.pause());
    for (const fraction of [0.5, 0.95]) {
      await video.evaluate((element, fraction) => { element.currentTime = element.duration * fraction; }, fraction);
      await page.waitForFunction((fraction) => {
        const element = document.querySelector(".film-video video");
        if (element.error) throw new Error(element.error.message);
        return !element.seeking && element.readyState >= 2 && Math.abs(element.currentTime - element.duration * fraction) < 0.15;
      }, fraction, { timeout: 60000 });
    }
    console.log(`${filename}: ${metadata.width}×${metadata.height}, one-click playback with sound and middle/end seeking passed`);
  }
  for (const mobile of [false, true]) {
    const directContext = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {});
    await directContext.route("https://formsubmit.co/**", async route => { emailRequests++; await route.abort(); });
    const directPage = await directContext.newPage();
    await directPage.goto(base + "/programme/maestro/");
    await directPage.waitForFunction(() => document.querySelector("video")?.readyState >= 1);
    assert.ok(await directPage.locator("video").evaluate(element => element.paused));
    await directPage.getByRole("button", { name: "Lire : Teaser de Maestro", exact: true }).click();
    await directPage.waitForFunction(() => {
      const element = document.querySelector("video");
      return !element.paused && !element.muted && element.currentTime > .25;
    });
    assert.equal(await directPage.locator(".video-start").count(), 0);
    await directPage.goto(base + "/");
    for (const lang of ["fr", "en", "fr"]) {
      await directPage.getByRole("button", { name: lang.toUpperCase(), exact: true }).click();
      await directPage.getByRole("button", { name: lang === "fr" ? "Bande-annonce" : "Watch the trailer", exact: true }).click();
      await directPage.waitForFunction(() => {
        const element = document.querySelector("dialog video");
        return element && !element.paused && !element.muted && element.currentTime > .25;
      });
      const expected = lang === "fr" ? "programme-trailer-vf.mp4" : "programme-trailer-veng.mp4";
      assert.ok(new URL(await directPage.locator("dialog video source").getAttribute("src"), base).pathname.endsWith(`/videos/${expected}`));
      await directPage.keyboard.press("Escape");
      await directPage.locator("dialog").waitFor({ state: "detached" });
    }
    console.log(`${mobile ? "Mobile" : "Desktop"}: direct-page play button and both language-specific homepage trailers start on the first click`);
    await directContext.close();
  }
  assert.equal(emailRequests, 0, "No FormSubmit requests may be made");
  assert.deepEqual(errors, []);
  console.log(`Both V4 homepage trailers and all six original-resolution film videos work at ${base}; zero FormSubmit requests.`);
} finally {
  await browser.close();
}
