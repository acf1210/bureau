#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/** Capture the three templates for the showcase site. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "site", "assets", "img");
fs.mkdirSync(outDir, { recursive: true });

const templates = [
  ["kinetic-editorial", "demo-kinetic"],
  ["product-surface", "demo-product"],
  ["immersive-experience", "demo-immersive"]
];

const browser = await chromium.launch({ headless: true, executablePath: process.env.BUREAU_CHROMIUM || "/usr/bin/chromium" });
for (const [folder, name] of templates) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const file = path.join(root, "skill", "assets", "templates", folder, "index.html");
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(900);
  const png = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: png, animations: "disabled" });
  await page.close();
  execFileSync("magick", [png, "-resize", "1200x", "-quality", "82", path.join(outDir, `${name}.webp`)]);
  execFileSync("magick", [png, "-resize", "1200x", "-quality", "50", path.join(outDir, `${name}.avif`)]);
  fs.unlinkSync(png);
  console.log("captured", name);
}
await browser.close();
