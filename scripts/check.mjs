import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.TEST_URL || "http://localhost:5173");
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "/tmp/dergigi-desktop.png", fullPage: true });
for (const width of [1440, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (overflow) throw Error("Overflow at " + width);
  console.log("Layout OK at " + width);
}
await page.getByRole("button", { name: "#nostr", exact: true }).click();
if ((await page.locator("#nostr-search").inputValue()) !== "#nostr")
  throw Error("Suggestion failed");
await page.getByRole("link", { name: "Explore all apps" }).click();
if (!page.url().endsWith("#projects")) throw Error("Navigation failed");
for (const img of await page.locator("img").all()) {
  await img.scrollIntoViewIfNeeded();
  await img.evaluate((image) => image.decode());
}
const missing = await page
  .locator("img")
  .evaluateAll((imgs) =>
    imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
  );
if (missing.length) throw Error("Images missing " + missing);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "/tmp/dergigi-mobile.png", fullPage: true });
console.log({ errors, missing, links: await page.locator("a").count() });
if (errors.length) throw Error("Console errors");
await browser.close();
