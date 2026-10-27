/* @bureau-internal — browser regression tests */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

test("landing remains readable at 320px without JavaScript", async (t) => {
  const executablePath = process.env.BUREAU_CHROMIUM || (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  const browser = await chromium.launch({ headless: true, executablePath });
  t.after(() => browser.close());
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  await page.goto(pathToFileURL(path.resolve(import.meta.dirname, "../site/index.html")).href, { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(() => ({ opacity: getComputedStyle(document.querySelector(".hero h1 span")).opacity, width: document.documentElement.scrollWidth, viewport: innerWidth, skip: document.querySelector(".skip-link")?.getAttribute("href"), nav: getComputedStyle(document.querySelector(".site-nav")).display }));
  assert.equal(result.opacity, "1");
  assert.ok(result.width <= result.viewport, `horizontal overflow: ${result.width} > ${result.viewport}`);
  assert.equal(result.skip, "#top");
  assert.notEqual(result.nav, "none");
  await page.setViewportSize({ width: 768, height: 1024 });
  assert.notEqual(await page.locator(".site-nav").evaluate((nav) => getComputedStyle(nav).display), "none");
});
