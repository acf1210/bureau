/* @bureau-internal — browser regression test */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

test("immersive scene restores the static fallback after WebGL context loss", async (t) => {
  const executablePath = process.env.BUREAU_CHROMIUM || (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  const browser = await chromium.launch({ headless: true, executablePath });
  t.after(() => browser.close());
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const file = path.resolve(import.meta.dirname, "../skill/assets/templates/immersive-experience/index.html");
  await page.goto(pathToFileURL(file).href, { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(async () => {
    const canvas = document.querySelector("#light");
    const gl = canvas?.getContext("webgl");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) return null;
    const event = (name) => Promise.race([
      new Promise((resolve) => canvas.addEventListener(name, resolve, { once: true })),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`${name} timed out`)), 5000))
    ]);
    const lost = event("webglcontextlost");
    extension.loseContext();
    await lost;
    const fallbackVisible = getComputedStyle(canvas).visibility === "hidden";
    await new Promise((resolve) => setTimeout(resolve, 100));
    const restored = event("webglcontextrestored");
    extension.restoreContext();
    await restored;
    return { fallbackVisible, restored: getComputedStyle(canvas).visibility === "visible" && !gl.isContextLost() };
  });
  if (!result) return t.skip("WebGL context-loss extension unavailable in this browser");
  assert.equal(result.fallbackVisible, true);
  assert.equal(result.restored, true);
});
