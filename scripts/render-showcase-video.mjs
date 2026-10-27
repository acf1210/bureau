#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Render the Pólvora videos from the same engine the page runs live (showcase/pyrotechnics/pyro.js),
 * frame by frame at a fixed step, then encode H.264 MP4 with ffmpeg (one format plays everywhere; a second would double the weight).
 * Usage: node scripts/render-showcase-video.mjs [name ...]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const model = path.join(root, "showcase", "pyrotechnics");
const out = path.join(model, "media");
fs.mkdirSync(out, { recursive: true });

const FPS = 30;
// Each clip: size, seconds, warm-up before recording, loop crossfade, keyframe interval and the programme of shells.
const CLIPS = {
  hero: { w: 1600, h: 900, seconds: 12, warm: 5, loop: 1, gop: 60, crf: 28, programme: "continuous" },
  "hero-portrait": { w: 720, h: 1280, seconds: 12, warm: 5, loop: 1, gop: 60, crf: 28, programme: "continuous" },
  finale: { w: 960, h: 540, seconds: 10, warm: 0, loop: 0, gop: 4, crf: 27, programme: "finale" },
  peony: { w: 640, h: 640, seconds: 4.2, warm: 0, loop: 0, gop: 30, crf: 28, programme: "single", type: "peony" },
  willow: { w: 640, h: 640, seconds: 4.2, warm: 0, loop: 0, gop: 30, crf: 28, programme: "single", type: "willow" },
  ring: { w: 640, h: 640, seconds: 4.2, warm: 0, loop: 0, gop: 30, crf: 28, programme: "single", type: "ring" },
  crossette: { w: 640, h: 640, seconds: 4.2, warm: 0, loop: 0, gop: 30, crf: 28, programme: "single", type: "crossette" },
  chrysanthemum: { w: 640, h: 640, seconds: 4.2, warm: 0, loop: 0, gop: 30, crf: 28, programme: "single", type: "chrysanthemum" }
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CLIPS);
const browser = await chromium.launch({ headless: true, executablePath: process.env.BUREAU_CHROMIUM || "/usr/bin/chromium" });

for (const name of names) {
  const clip = CLIPS[name];
  if (!clip) { console.error(`unknown clip ${name}`); process.exitCode = 2; continue; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `pyro-${name}-`));
  const page = await browser.newPage();
  await page.exposeFunction("saveFrame", (i, b64) => fs.writeFileSync(path.join(dir, `f${String(i).padStart(5, "0")}.jpg`), Buffer.from(b64, "base64")));
  await page.setContent("<!doctype html><canvas id=c></canvas>");
  await page.addScriptTag({ path: path.join(model, "pyro.js") });
  const count = await page.evaluate(async ({ clip, FPS }) => {
    const canvas = document.getElementById("c");
    canvas.width = clip.w; canvas.height = clip.h;
    const show = new Pyro.Show(canvas, { seed: clip.w * 7 + clip.h, water: clip.programme !== "single", scenery: clip.programme !== "single" });
    const dt = 1 / FPS, R = (() => { let s = 99; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const types = ["peony", "willow", "ring", "crossette", "chrysanthemum"];
    const metals = ["strontium", "sodium", "barium", "copper", "magnesium"];
    let next = 0;
    const programme = (t) => {
      if (clip.programme === "single") { if (next === 0) { show.launch(clip.type, { x: .5, height: .36, from: .82, scale: 1.55 }); next = 1; } return; }
      if (clip.programme === "continuous") {
        if (t < next) return;
        const type = types[R() * 5 | 0];
        show.launch(type, { metal: R() < .5 ? undefined : metals[R() * 5 | 0], x: .12 + R() * .76, height: .1 + R() * .3 });
        next = t + .35 + R() * .6;
        return;
      }
      // The finale climbs: single shells, then pairs, then crossettes over willows, then a barrage of salutes.
      if (t < next) return;
      if (t < 3) { show.launch(types[R() * 5 | 0], { x: .2 + R() * .6 }); next = t + .7; }
      else if (t < 6) { show.launch("peony", { x: .25 + R() * .2 }); show.launch("chrysanthemum", { x: .55 + R() * .2 }); next = t + .55; }
      else if (t < 8) { show.launch("willow", { x: .15 + R() * .7, height: .08 + R() * .1 }); show.launch("crossette", { x: .2 + R() * .6 }); show.launch("ring", { x: .3 + R() * .4 }); next = t + .3; }
      else if (t < 9.3) { for (let i = 0; i < 3; i++) show.launch("salute", { x: .1 + R() * .8, height: .2 + R() * .25, scale: .7 }); show.launch("peony", { x: .5, height: .14, scale: 1.4, metal: "magnesium" }); next = t + .16; }
      else next = 1e9;
    };
    const ctx = canvas.getContext("2d");
    const grab = () => canvas.toDataURL("image/jpeg", .93).split(",")[1];
    const total = Math.round(clip.seconds * FPS), warm = Math.round(clip.warm * FPS), fade = Math.round(clip.loop * FPS);
    // For a seamless loop, the last second dissolves into the second before the first frame.
    const lead = [];
    let i = 0;
    for (let f = 0; f < warm + total; f++) {
      programme(f * dt); show.step(dt);
      if (f < warm - fade) continue;
      show.draw();
      if (f < warm) { const c = document.createElement("canvas"); c.width = clip.w; c.height = clip.h; c.getContext("2d").drawImage(canvas, 0, 0); lead.push(c); continue; }
      const k = f - warm - (total - fade);
      if (fade && k >= 0) { ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = (k + 1) / fade; ctx.drawImage(lead[k], 0, 0); ctx.globalAlpha = 1; }
      await window.saveFrame(i++, grab());
    }
    return i;
  }, { clip, FPS });
  await page.close();
  const src = path.join(dir, "f%05d.jpg");
  const mp4 = path.join(out, `${name}.mp4`), poster = path.join(out, `${name}.jpg`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", String(clip.crf), "-pix_fmt", "yuv420p", "-g", String(clip.gop), "-movflags", "+faststart", "-an", mp4]);
  const still = Math.min(count - 1, Math.round((clip.programme === "single" ? 2.1 : clip.programme === "finale" ? 8.6 : 3.2) * FPS));
  execFileSync("magick", [path.join(dir, `f${String(still).padStart(5, "0")}.jpg`), "-quality", "78", poster]);
  fs.rmSync(dir, { recursive: true, force: true });
  const kb = (f) => Math.round(fs.statSync(f).size / 1024);
  console.log(`${name}: ${count} frames · mp4 ${kb(mp4)} KB`);
}
await browser.close();
