#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/** Capture every template, desktop and mobile, for the showcase site and the README gallery. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "site", "assets", "img", "demos");
fs.mkdirSync(outDir, { recursive: true });

// Every template, captured at a laptop fold and a phone fold.
const tplRoot = path.join(root, "skill", "assets", "templates");
const templates = fs.readdirSync(tplRoot).filter((d) => fs.existsSync(path.join(tplRoot, d, "index.html"))).sort();
const shots = [["desktop", { width: 1440, height: 900 }, 1200], ["mobile", { width: 390, height: 844 }, 480]];

const browser = await chromium.launch({ headless: true, executablePath: process.env.BUREAU_CHROMIUM || "/usr/bin/chromium" });
for (const folder of templates) {
  for (const [kind, viewport, width] of shots) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: kind === "mobile" ? 2 : 1, reducedMotion: "reduce" });
    const file = path.join(root, "skill", "assets", "templates", folder, "index.html");
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(1200);
    const name = `${folder}-${kind}`;
    const png = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: png, animations: "disabled" });
    await page.close();
    execFileSync("magick", [png, "-resize", `${width}x`, "-quality", "82", path.join(outDir, `${name}.webp`)]);
    execFileSync("magick", [png, "-resize", `${width}x`, "-quality", "50", path.join(outDir, `${name}.avif`)]);
    fs.unlinkSync(png);
    console.log("captured", name);
  }
}
await browser.close();

// README banner: a mosaic of six desktop folds, so the repository opens on the work itself.
const pick = ["restaurant-table", "record-label", "architecture-studio", "museum-archive", "private-bank", "immersive-experience"].filter((t) => templates.includes(t));
execFileSync("magick", ["montage", ...pick.map((t) => path.join(outDir, `${t}-desktop.webp`)), "-tile", "3x2", "-geometry", "800x500+0+0", "-background", "#0B0B0C", path.join(root, "site", "assets", "img", "readme-banner.webp")]);
console.log("banner", pick.length);
