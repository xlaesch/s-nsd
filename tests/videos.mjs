import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = (process.env.TEST_URL || "http://localhost:5173").replace(/\/$/, "");
const cases = [
  ["", "programme-trailer.mp4", 1920, 1080, 64.75],
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
  args: ["--no-sandbox"],
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
  for (const [slug, filename, width, height, duration] of cases) {
    const response = await page.goto(base + (slug ? `/programme/${slug}/` : "/"), { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200, `Page failed: ${slug || "home"}`);
    if (!slug) await page.getByRole("button", { name: /bande-annonce/i, exact: true }).click();
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
    await video.evaluate(async (element) => { element.muted = true; await element.play(); });
    await page.waitForFunction(() => document.querySelector(".film-video video").currentTime > 0.25, null, { timeout: 60000 });
    await video.evaluate((element) => element.pause());
    for (const fraction of [0.5, 0.95]) {
      await video.evaluate((element, fraction) => { element.currentTime = element.duration * fraction; }, fraction);
      await page.waitForFunction((fraction) => {
        const element = document.querySelector(".film-video video");
        if (element.error) throw new Error(element.error.message);
        return !element.seeking && element.readyState >= 2 && Math.abs(element.currentTime - element.duration * fraction) < 0.15;
      }, fraction, { timeout: 60000 });
    }
    console.log(`${filename}: ${metadata.width}×${metadata.height}, playback and middle/end seeking passed`);
  }
  assert.equal(emailRequests, 0, "No FormSubmit requests may be made");
  assert.deepEqual(errors, []);
  console.log(`All seven original-resolution supplied videos work at ${base}; zero FormSubmit requests.`);
} finally {
  await browser.close();
}
