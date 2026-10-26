#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/** Render site/og.html to site/assets/img/og.png at 1200×630. */
import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const browser = await chromium.launch({ headless: true, executablePath: process.env.BUREAU_CHROMIUM || "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(root, "site", "og.html")).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(root, "site", "assets", "img", "og.png") });
await browser.close();
console.log("og.png written");
