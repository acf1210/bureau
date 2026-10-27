#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/** Capture every ShowCase model, desktop and mobile, for the landing and the README gallery. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "site", "assets", "img", "showcase");
fs.mkdirSync(outDir, { recursive: true });

const catalog = JSON.parse(fs.readFileSync(path.join(root, "showcase", "catalog.json"), "utf8"));
const shots = [["desktop", { width: 1440, height: 900 }, 1200], ["mobile", { width: 390, height: 844 }, 480]];

// The models are live renderings (WebGL, canvas): motion stays on and each gets time to draw before the capture.
const browser = await chromium.launch({ headless: true, executablePath: process.env.BUREAU_CHROMIUM || "/usr/bin/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const { id } of catalog) {
  for (const [kind, viewport, width] of shots) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: kind === "mobile" ? 2 : 1 });
    await page.goto(pathToFileURL(path.join(root, "showcase", id, "index.html")).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(3500);
    const name = `${id}-${kind}`;
    const png = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: png });
    await page.close();
    execFileSync("magick", [png, "-resize", `${width}x`, "-quality", "82", path.join(outDir, `${name}.webp`)]);
    execFileSync("magick", [png, "-resize", `${width}x`, "-quality", "50", path.join(outDir, `${name}.avif`)]);
    fs.unlinkSync(png);
    console.log("captured", name);
  }
}
await browser.close();

// README banner: the phone compositions side by side.
execFileSync("magick", ["montage", ...catalog.map(({ id }) => path.join(outDir, `${id}-mobile.webp`)), "-tile", `${catalog.length}x1`, "-geometry", "360x780+12+0", "-background", "#0B0B0C", path.join(root, "site", "assets", "img", "readme-banner.webp")]);
console.log("banner", catalog.length);
