#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU visual audit — Playwright evidence.
 * Usage:
 *   node scripts/visual-audit.mjs <url|file> --out .bureau/qa \
 *     --viewports 390x844,768x1024,1440x900 --full --motion
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = readVersion();

const DEFAULT_VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, dpr: 3 },
  { name: "tablet", width: 768, height: 1024, dpr: 2 },
  { name: "laptop", width: 1440, height: 900, dpr: 1 },
  { name: "desktop", width: 1920, height: 1080, dpr: 1 }
];

function readVersion() {
  try { return fs.readFileSync(path.join(__dirname, "..", "..", "VERSION"), "utf8").trim(); }
  catch { return "1.0.0"; }
}

function parseArgs(argv) {
  const opts = {
    target: null,
    out: ".bureau/qa",
    viewports: null,
    full: true,
    motion: true,
    scrollShots: false,
    failOn: "none",
    timeout: 45000,
    wait: 600,
    locale: "pt-BR",
    colorScheme: "light",
    headed: false,
    baseline: null,
    updateBaseline: false,
    json: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") opts.out = argv[++i];
    else if (a === "--viewports") opts.viewports = argv[++i];
    else if (a === "--full") opts.full = true;
    else if (a === "--no-full") opts.full = false;
    else if (a === "--motion") opts.motion = true;
    else if (a === "--no-motion") opts.motion = false;
    else if (a === "--scroll-shots") opts.scrollShots = true;
    else if (a === "--fail-on") opts.failOn = (argv[++i] || "none").toLowerCase();
    else if (a === "--timeout") opts.timeout = Number(argv[++i]) || 45000;
    else if (a === "--wait") opts.wait = Number(argv[++i]) || 600;
    else if (a === "--locale") opts.locale = argv[++i];
    else if (a === "--dark") opts.colorScheme = "dark";
    else if (a === "--headed") opts.headed = true;
    else if (a === "--baseline") opts.baseline = argv[++i];
    else if (a === "--update-baseline") opts.updateBaseline = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU visual audit ${VERSION}

Usage: node scripts/visual-audit.mjs <url|file> [options]

Options:
  --out <dir>            output directory (default .bureau/qa)
  --viewports <list>     390x844,768x1024,1440x900[@dpr]
  --full / --no-full     full-page screenshots (default full)
  --motion / --no-motion reduced-motion pass (default on)
  --scroll-shots         capture 25/50/75% scroll frames
  --fail-on <level>      exit 1 on p0 | p1 | p2 | none
  --timeout <ms>         page timeout (default 45000)
  --wait <ms>            settle time after load (default 600)
  --locale <bcp47>       browser locale (default pt-BR)
  --dark                 dark color scheme
  --baseline <dir>       compare screenshot hashes with baseline
  --update-baseline      write baseline manifest
  --headed               show the browser
  --json                 print JSON
`);
      process.exit(0);
    } else if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.target = a;
  }
  return opts;
}

function parseViewports(spec) {
  if (!spec) return DEFAULT_VIEWPORTS;
  return spec.split(",").map((raw) => {
    const [dims, dprRaw] = raw.trim().split("@");
    const [w, h] = dims.toLowerCase().split("x").map(Number);
    const width = w || 1440;
    const height = h || 900;
    const dpr = Number(dprRaw) || 1;
    const name = width < 480 ? "mobile" : width < 900 ? "tablet" : width < 1600 ? "laptop" : "desktop";
    return { name: `${name}-${width}`, width, height, dpr };
  });
}

function resolveTarget(target) {
  if (!target) {
    console.error("Missing target URL or file.");
    process.exit(2);
  }
  if (/^(https?|file):\/\//i.test(target)) return target;
  let abs = path.resolve(target);
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) abs = path.join(abs, "index.html");
  if (!fs.existsSync(abs)) {
    console.error(`Target not found: ${abs}`);
    process.exit(2);
  }
  return pathToFileURL(abs).href;
}

function safeName(s) {
  return s.replace(/[^a-z0-9._-]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function loadBudgets() {
  const defaults = { lcpMs: 2500, inpMs: 200, cls: 0.1, jsKbGzip: 250, heroMediaKb: 1500 };
  try {
    const cfg = JSON.parse(fs.readFileSync(path.resolve(".bureau/config.json"), "utf8"));
    return { ...defaults, ...(cfg.budgets || {}) };
  } catch {
    return defaults;
  }
}

const PERF_INIT = `
(() => {
  const perf = { lcp: 0, lcpTag: "", cls: 0, longTasks: 0, longTaskTime: 0 };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.startTime > perf.lcp) { perf.lcp = e.startTime; perf.lcpTag = e.element ? e.element.tagName : ""; }
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) perf.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) { perf.longTasks++; perf.longTaskTime += e.duration; }
    }).observe({ type: "longtask", buffered: true });
  } catch {}
  window.__bureauPerf = perf;
})();
`;

function collectInPage() {
  const parse = (str) => {
    const m = String(str || "").match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i);
    if (!m) return null;
    let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: Math.max(0, Math.min(1, a)) };
  };
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  });
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > -200 && r.top < innerHeight + 4000;
  };
  const selector = (el) => {
    if (!el || el.nodeType !== 1) return "";
    if (el.id) return `#${el.id}`;
    const cls = (el.className || "").toString().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
  };
  const effectiveBg = (el) => {
    let node = el;
    const stack = [];
    while (node && node.nodeType === 1) {
      const s = getComputedStyle(node);
      if (s.backgroundImage && s.backgroundImage !== "none") return null;
      const c = parse(s.backgroundColor);
      if (c && c.a > 0) stack.push(c);
      if (c && c.a >= 0.99) break;
      node = node.parentElement;
    }
    let base = { r: 1, g: 1, b: 1, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base);
    return base;
  };

  const overflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const wide = [];
  if (overflow > 0) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (s.position === "fixed" || r.width === 0 || r.height === 0) continue;
      if (r.right > innerWidth + 1 || r.left < -1) {
        wide.push({ selector: selector(el), left: Math.round(r.left), right: Math.round(r.right), text: (el.textContent || "").trim().slice(0, 60) });
        if (wide.length >= 8) break;
      }
    }
  }

  const contrast = [];
  let unverifiable = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p || !visible(p)) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "CANVAS"].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const seen = new Set();
  let node;
  while ((node = walker.nextNode()) && contrast.length < 700) {
    const el = node.parentElement;
    if (seen.has(el)) continue;
    seen.add(el);
    // WCAG 1.4.3 exempts pure decoration; aria-hidden text is not content.
    if (el.closest('[aria-hidden="true"]')) continue;
    const s = getComputedStyle(el);
    const fg = parse(s.color);
    if (!fg || fg.a === 0) continue;
    const bg = effectiveBg(el);
    if (!bg) { unverifiable++; continue; }
    const blended = fg.a < 1 ? blend(fg, bg) : fg;
    const cr = ratio(blended, bg);
    const size = parseFloat(s.fontSize) || 16;
    const weight = Number(s.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const threshold = large ? 3 : 4.5;
    if (cr < threshold) {
      contrast.push({
        selector: selector(el),
        text: node.nodeValue.trim().slice(0, 70),
        color: s.color,
        background: `rgb(${Math.round(bg.r * 255)}, ${Math.round(bg.g * 255)}, ${Math.round(bg.b * 255)})`,
        ratio: Math.round(cr * 100) / 100,
        size: Math.round(size),
        large,
        threshold
      });
    }
  }

  const tap = [];
  const interactive = document.querySelectorAll("a,button,input,select,textarea,[role=button],[role=link],[tabindex]:not([tabindex='-1'])");
  for (const el of interactive) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if (s.pointerEvents === "none") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const inlineInText = el.tagName === "A" && el.closest("p,li,span") && s.display === "inline";
    if (inlineInText) continue;
    if (r.width < 24 || r.height < 24) {
      tap.push({ selector: selector(el), width: Math.round(r.width), height: Math.round(r.height), text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 50) });
      if (tap.length >= 20) break;
    }
  }

  const images = { total: 0, missingAlt: 0, broken: [], noDimensions: 0 };
  for (const img of document.querySelectorAll("img")) {
    images.total++;
    if (!img.hasAttribute("alt")) images.missingAlt++;
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      images.broken.push({ src: (img.currentSrc || img.src || "").slice(0, 180), alt: img.alt || "" });
    }
    if (!img.hasAttribute("width") && !img.hasAttribute("height") && getComputedStyle(img).aspectRatio === "auto") images.noDimensions++;
  }

  const videos = [];
  for (const v of document.querySelectorAll("video")) {
    videos.push({ autoplay: v.autoplay, muted: v.muted, paused: v.paused, readyState: v.readyState, src: (v.currentSrc || v.src || "").slice(0, 160) });
  }

  const family = (el) => (el ? getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim() : "");
  const fonts = [...new Set([family(document.body), family(document.querySelector("h1")), family(document.querySelector("h2")), family(document.querySelector("button"))].filter(Boolean))];

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({ level: Number(h.tagName[1]), text: (h.textContent || "").trim().slice(0, 70) }));
  const h1Count = headings.filter((h) => h.level === 1).length;

  const anims = document.getAnimations ? document.getAnimations({ subtree: true }) : [];
  let longAnims = 0, runningAnims = 0;
  for (const a of anims) {
    if (a.playState !== "running") continue;
    runningAnims++;
    try {
      const timing = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      if (timing && (timing.activeDuration === Infinity || timing.activeDuration > 100)) longAnims++;
    } catch { longAnims++; }
  }

  const resources = performance.getEntriesByType("resource").map((r) => ({
    name: r.name.split("?")[0].slice(-120),
    type: r.initiatorType,
    transfer: r.transferSize || 0,
    duration: Math.round(r.duration)
  }));
  const jsBytes = resources.filter((r) => /script|\.js|\.mjs|\.ts/.test(r.type + r.name)).reduce((n, r) => n + r.transfer, 0);
  const mediaBytes = resources.filter((r) => /img|image|video|\.jpg|\.png|\.webp|\.avif|\.mp4|\.webm/.test(r.type + r.name)).reduce((n, r) => n + r.transfer, 0);

  // Fold: at desktop widths the headline and the first action after it must be visible without scrolling.
  const absBottom = (el) => el.getBoundingClientRect().bottom + scrollY;
  let fold = null;
  const h1 = document.querySelector("h1");
  if (h1 && innerWidth >= 1024) {
    const scope = h1.closest("section,header,main") || document.body;
    const action = [...scope.querySelectorAll("a[href],button")].find((el) => (h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) && el.getClientRects().length);
    fold = { h1: Math.round(absBottom(h1)), action: action ? Math.round(absBottom(action)) : null, actionText: action ? (action.textContent || "").trim().slice(0, 40) : null, height: innerHeight };
  }

  // Screen budget: words per 900px window at desktop widths.
  let budget = null;
  if (innerWidth >= 1280) {
    const windows = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const el = node.parentElement;
      if (!el || el.closest("script,style,noscript,[aria-hidden='true']")) continue;
      const words = node.textContent.trim().split(/\s+/).filter(Boolean).length;
      if (!words) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const w = Math.floor((r.top + scrollY) / 900);
      windows.set(w, (windows.get(w) || 0) + words);
    }
    const worst = [...windows.entries()].sort((x, y) => y[1] - x[1])[0];
    budget = worst ? { window: worst[0], words: worst[1] } : null;
  }

  // Crowded heads: a section head nearer what precedes it than what it heads.
  const crowded = [];
  for (const h of document.querySelectorAll("main h2, main h3")) {
    const prev = h.previousElementSibling, next = h.nextElementSibling;
    if (!prev || !next) continue;
    // A short label directly above the head belongs to the head group; judge the group, not the label.
    if (prev.getBoundingClientRect().height < 48 && parseFloat(getComputedStyle(prev).fontSize) < parseFloat(getComputedStyle(h).fontSize) * 0.6) continue;
    if (getComputedStyle(h.parentElement).display.includes("grid") && Math.abs(next.getBoundingClientRect().left - h.getBoundingClientRect().left) > 4) continue;
    const r = h.getBoundingClientRect();
    const above = r.top - prev.getBoundingClientRect().bottom;
    const below = next.getBoundingClientRect().top - r.bottom;
    if (above >= 0 && below > 0 && above < below * 0.75 && below - above >= 12) crowded.push((h.textContent || "").trim().slice(0, 50));
  }

  return {
    fold,
    budget,
    crowded: crowded.slice(0, 5),
    title: document.title,
    lang: document.documentElement.lang || "",
    overflow,
    wide,
    docHeight: document.documentElement.scrollHeight,
    contrast,
    unverifiableContrast: unverifiable,
    tap,
    images,
    videos,
    fonts,
    headings,
    h1Count,
    anims: { total: anims.length, running: runningAnims, long: longAnims },
    resources: { count: resources.length, jsBytes, mediaBytes, list: resources.slice(0, 60) },
    perf: window.__bureauPerf || null,
    canvases: document.querySelectorAll("canvas").length,
    main: document.querySelectorAll("main").length,
    forms: { inputs: document.querySelectorAll("input,select,textarea").length, labels: document.querySelectorAll("label").length }
  };
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(320, Math.floor(innerHeight * 0.8));
    const max = Math.min(document.documentElement.scrollHeight, 30000);
    for (let y = 0; y < max; y += step) {
      scrollTo(0, y);
      await sleep(80);
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await sleep(250);
    scrollTo(0, 0);
    await sleep(250);
  }).catch(() => {});
}

function dedupeIssues(issues) {
  const map = new Map();
  for (const i of issues) {
    const key = i.id + "|" + (i.detail || "").slice(0, 120);
    if (!map.has(key)) {
      map.set(key, { ...i, viewports: i.viewport ? [i.viewport] : [] });
    } else {
      const existing = map.get(key);
      if (i.viewport && !existing.viewports.includes(i.viewport)) existing.viewports.push(i.viewport);
    }
  }
  for (const v of map.values()) delete v.viewport;
  return [...map.values()];
}

function scoreIssues(issues) {
  const by = { p0: 0, p1: 0, p2: 0 };
  for (const i of issues) by[i.severity] = (by[i.severity] || 0) + 1;
  const penalty = Math.min(60, by.p0 * 20) + Math.min(60, by.p1 * 6) + Math.min(20, by.p2 * 2);
  return { by, score: Math.max(0, 100 - penalty), hardFail: by.p0 > 0 };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push(`# BUREAU visual audit`);
  lines.push("");
  lines.push(`- **Target:** ${report.target}`);
  lines.push(`- **Generated:** ${report.generatedAt}`);
  lines.push(`- **Score:** ${report.summary.score}/100${report.summary.hardFail ? " · **HARD FAIL**" : ""}`);
  lines.push(`- **Issues:** P0 ${report.summary.by.p0} · P1 ${report.summary.by.p1} · P2 ${report.summary.by.p2}`);
  lines.push("");
  lines.push("## Viewports");
  lines.push("");
  lines.push("| Viewport | Size | Overflow | LCP | CLS | Long tasks | Console | Screenshots |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const v of report.viewports) {
    lines.push(`| ${v.name} | ${v.width}×${v.height} | ${v.metrics.overflow}px | ${v.metrics.perf?.lcp ? Math.round(v.metrics.perf.lcp) + "ms" : "—"} | ${(v.metrics.perf?.cls ?? 0).toFixed(3)} | ${v.metrics.perf?.longTasks ?? 0} | ${v.console.length} | ${v.screenshots.length} |`);
  }
  lines.push("");
  if (report.issues.length) {
    lines.push("## Issues");
    lines.push("");
    for (const i of report.issues) {
      lines.push(`### [${i.severity.toUpperCase()}] ${i.title}`);
      lines.push("");
      lines.push(`- **ID:** ${i.id}`);
      lines.push(`- **Where:** ${i.viewports.join(", ") || "—"}`);
      lines.push(`- **Detail:** ${i.detail}`);
      if (i.evidence) lines.push(`- **Evidence:** \`${i.evidence}\``);
      lines.push("");
    }
  } else {
    lines.push("No automated issues. Inspect the screenshots before concluding.");
  }
  return lines.join("\n");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const target = resolveTarget(opts.target);
  const outDir = path.resolve(opts.out);
  fs.mkdirSync(path.join(outDir, "screenshots"), { recursive: true });
  const budgets = loadBudgets();
  const viewports = parseViewports(opts.viewports);

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(`Playwright is not installed. Run:
  npm install
  npx playwright install chromium
`);
    process.exit(2);
  }

  let browser = null;
  let engine = null;
  const candidates = [
    process.env.BUREAU_CHROMIUM,
    null,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  ].filter((x, i, a) => a.indexOf(x) === i);
  for (const executablePath of candidates) {
    if (executablePath && !fs.existsSync(executablePath)) continue;
    try {
      browser = await chromium.launch({ headless: !opts.headed, ...(executablePath ? { executablePath } : {}) });
      engine = executablePath || "playwright-chromium";
      break;
    } catch {}
  }
  if (!browser) {
    console.error(`Could not launch Chromium.
Install it with: npx playwright install chromium
Or set BUREAU_CHROMIUM=/path/to/chrome`);
    process.exit(2);
  }

  const report = {
    meta: { tool: "bureau-visual-audit", version: VERSION, generatedAt: new Date().toISOString(), engine },
    target,
    budgets,
    viewports: [],
    issues: [],
    screenshots: []
  };
  const allIssues = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      locale: opts.locale,
      colorScheme: opts.colorScheme,
      reducedMotion: "no-preference"
    });
    await context.addInitScript(PERF_INIT);
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        const text = msg.text();
        if (/GL Driver Message|GPU stall due to ReadPixels|WebGL.*performance/i.test(text)) return;
        consoleErrors.push({ type: msg.type(), text: text.slice(0, 300), location: msg.location() });
      }
    });
    page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 300)));
    page.on("requestfailed", (req) => failedRequests.push({ url: req.url().slice(0, 220), reason: req.failure()?.errorText || "failed" }));
    page.on("response", (res) => {
      if (res.status() >= 400) {
        const type = res.request().resourceType();
        if (!["document", "script", "stylesheet", "image", "font", "media", "fetch", "xhr"].includes(type)) return;
        failedRequests.push({ url: res.url().slice(0, 220), reason: `HTTP ${res.status()}` });
      }
    });

    let metrics = {
      overflow: 0, wide: [], contrast: [], unverifiableContrast: 0, tap: [],
      images: { total: 0, missingAlt: 0, broken: [], noDimensions: 0 },
      videos: [], fonts: [], headings: [], h1Count: 1, anims: { total: 0, running: 0, long: 0 },
      resources: { count: 0, jsBytes: 0, mediaBytes: 0, list: [] }, perf: null,
      canvases: 0, main: 0, forms: { inputs: 0, labels: 0 }
    };
    const screenshots = [];
    try {
      await page.goto(target, { waitUntil: "load", timeout: opts.timeout });
      await page.evaluate(() => document.fonts?.ready).catch(() => {});
      await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(opts.wait);

      const fold = path.join(outDir, "screenshots", `${safeName(vp.name)}-fold.png`);
      await page.screenshot({ path: fold, animations: "disabled" });
      screenshots.push(path.relative(process.cwd(), fold));

      metrics = await page.evaluate(collectInPage);

      if (opts.full) {
        await autoScroll(page);
        const full = path.join(outDir, "screenshots", `${safeName(vp.name)}-full.png`);
        try {
          await page.screenshot({ path: full, fullPage: true, animations: "disabled" });
          screenshots.push(path.relative(process.cwd(), full));
        } catch (err) {
          allIssues.push({ id: "VA-FULLSHOT", severity: "p2", title: "Full-page screenshot failed", detail: String(err.message).slice(0, 200), viewport: vp.name, evidence: path.relative(process.cwd(), fold) });
        }
      }

      if (opts.scrollShots) {
        for (const pct of [25, 50, 75]) {
          await page.evaluate((p) => scrollTo(0, document.documentElement.scrollHeight * (p / 100)), pct);
          await page.waitForTimeout(300);
          const shot = path.join(outDir, "screenshots", `${safeName(vp.name)}-scroll-${pct}.png`);
          await page.screenshot({ path: shot, animations: "disabled" });
          screenshots.push(path.relative(process.cwd(), shot));
        }
        await page.evaluate(() => scrollTo(0, 0));
      }
    } catch (err) {
      allIssues.push({ id: "VA-LOAD", severity: "p0", title: "Page failed to load", detail: String(err.message).slice(0, 300), viewport: vp.name });
    }

    const foldEvidence = screenshots[0] || null;
    if (metrics.overflow > 0) {
      allIssues.push({
        id: "VA-OVERFLOW", severity: "p0", title: "Horizontal overflow",
        detail: `${metrics.overflow}px wider than the viewport. Elements: ${metrics.wide.map((w) => `${w.selector} [${w.left}..${w.right}]`).join("; ") || "unknown"}`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    if (metrics.fold && (metrics.fold.h1 > metrics.fold.height || (metrics.fold.action && metrics.fold.action > metrics.fold.height))) {
      allIssues.push({
        id: "VA-FOLD", severity: "p1", title: "Headline or primary action below the fold",
        detail: `h1 ends at ${metrics.fold.h1}px, first action "${metrics.fold.actionText || "none"}" at ${metrics.fold.action ?? "—"}px; the viewport is ${metrics.fold.height}px tall.`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    if (metrics.budget && metrics.budget.words > 80) {
      allIssues.push({
        id: "VA-BUDGET", severity: "p2", title: "Screen budget over 80 words",
        detail: `${metrics.budget.words} words in the 900px window starting at ${metrics.budget.window * 900}px. One idea per screen; reading columns in READ mode may answer this.`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    if (metrics.crowded?.length) {
      allIssues.push({
        id: "VA-HEAD", severity: "p2", title: "Crowded section head",
        detail: `Closer to what precedes it than to what it heads: ${metrics.crowded.join("; ")}.`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    if (metrics.h1Count === 0 && metrics.title) {
      allIssues.push({ id: "VA-H1", severity: "p1", title: "No h1", detail: `Page title is "${metrics.title}".`, viewport: vp.name, evidence: foldEvidence });
    }
    for (const c of metrics.contrast.slice(0, 25)) {
      allIssues.push({
        id: "VA-CONTRAST", severity: "p0", title: "Text contrast below WCAG AA",
        detail: `${c.selector} "${c.text}" — ${c.ratio}:1 (needs ${c.threshold}:1), ${c.color} on ${c.background}, ${c.size}px`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    for (const t of metrics.tap.slice(0, 10)) {
      allIssues.push({
        id: "VA-TAP", severity: "p1", title: "Touch target below 24px",
        detail: `${t.selector} ${t.width}×${t.height} "${t.text}"`,
        viewport: vp.name, evidence: foldEvidence
      });
    }
    if (metrics.images.missingAlt) {
      allIssues.push({ id: "VA-ALT", severity: "p0", title: "Images without alt", detail: `${metrics.images.missingAlt} of ${metrics.images.total} images.`, viewport: vp.name, evidence: foldEvidence });
    }
    for (const b of metrics.images.broken.slice(0, 5)) {
      allIssues.push({ id: "VA-BROKEN", severity: "p1", title: "Broken image", detail: b.src, viewport: vp.name, evidence: foldEvidence });
    }
    for (const e of pageErrors.slice(0, 5)) {
      allIssues.push({ id: "VA-PAGEERROR", severity: "p0", title: "Page error", detail: e, viewport: vp.name, evidence: foldEvidence });
    }
    const uniqueConsole = [...new Map(consoleErrors.map((c) => [c.text, c])).values()];
    for (const c of uniqueConsole.slice(0, 8)) {
      allIssues.push({ id: "VA-CONSOLE", severity: "p1", title: "Console error/warning", detail: `${c.type}: ${c.text}`, viewport: vp.name, evidence: foldEvidence });
    }
    const uniqueFailed = [...new Map(failedRequests.map((f) => [f.url + f.reason, f])).values()];
    for (const f of uniqueFailed.slice(0, 8)) {
      allIssues.push({ id: "VA-REQUEST", severity: "p1", title: "Failed request", detail: `${f.url} — ${f.reason}`, viewport: vp.name, evidence: foldEvidence });
    }
    if (metrics.fonts.length > 3) {
      allIssues.push({ id: "VA-FONTS", severity: "p1", title: "More than 3 font families", detail: metrics.fonts.join(", "), viewport: vp.name, evidence: foldEvidence });
    }
    if (metrics.perf) {
      if (metrics.perf.lcp > budgets.lcpMs * 1.6) {
        allIssues.push({ id: "VA-LCP", severity: "p0", title: "LCP over 1.6× budget", detail: `${Math.round(metrics.perf.lcp)}ms (budget ${budgets.lcpMs}ms)`, viewport: vp.name, evidence: foldEvidence });
      } else if (metrics.perf.lcp > budgets.lcpMs) {
        allIssues.push({ id: "VA-LCP", severity: "p1", title: "LCP over budget", detail: `${Math.round(metrics.perf.lcp)}ms (budget ${budgets.lcpMs}ms)`, viewport: vp.name, evidence: foldEvidence });
      }
      if (metrics.perf.cls > budgets.cls * 2.5) {
        allIssues.push({ id: "VA-CLS", severity: "p0", title: "CLS over 2.5× budget", detail: `${metrics.perf.cls.toFixed(3)} (budget ${budgets.cls})`, viewport: vp.name, evidence: foldEvidence });
      } else if (metrics.perf.cls > budgets.cls) {
        allIssues.push({ id: "VA-CLS", severity: "p1", title: "CLS over budget", detail: `${metrics.perf.cls.toFixed(3)} (budget ${budgets.cls})`, viewport: vp.name, evidence: foldEvidence });
      }
    }
    if (metrics.images.noDimensions > 2) {
      allIssues.push({ id: "VA-IMGDIM", severity: "p2", title: "Images without dimensions/aspect-ratio", detail: `${metrics.images.noDimensions} images can shift layout.`, viewport: vp.name, evidence: foldEvidence });
    }

    let reduced = null;
    if (opts.motion) {
      const rctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        locale: opts.locale,
        colorScheme: opts.colorScheme,
        reducedMotion: "reduce"
      });
      const rpage = await rctx.newPage();
      try {
        await rpage.goto(target, { waitUntil: "load", timeout: opts.timeout });
        await rpage.evaluate(() => document.fonts?.ready).catch(() => {});
        await rpage.waitForTimeout(Math.max(400, opts.wait));
        reduced = await rpage.evaluate(() => {
          const anims = document.getAnimations ? document.getAnimations({ subtree: true }) : [];
          let running = 0;
          for (const a of anims) {
            if (a.playState !== "running") continue;
            try {
              const t = a.effect?.getComputedTiming?.();
              if (t && (t.activeDuration === Infinity || t.activeDuration > 100)) running++;
            } catch { running++; }
          }
          return {
            running,
            videos: [...document.querySelectorAll("video")].map((v) => ({ paused: v.paused, autoplay: v.autoplay })),
            matches: matchMedia("(prefers-reduced-motion: reduce)").matches
          };
        });
        const shot = path.join(outDir, "screenshots", `${safeName(vp.name)}-reduced-motion.png`);
        await rpage.screenshot({ path: shot, animations: "disabled" });
        screenshots.push(path.relative(process.cwd(), shot));
        if (reduced.running > 0) {
          allIssues.push({ id: "VA-MOTION", severity: "p1", title: "Motion continues under reduced-motion", detail: `${reduced.running} long-running animation(s) still active.`, viewport: vp.name, evidence: path.relative(process.cwd(), shot) });
        }
        const playing = reduced.videos.filter((v) => v.autoplay && !v.paused);
        if (playing.length) {
          allIssues.push({ id: "VA-VIDEO", severity: "p1", title: "Video plays under reduced-motion", detail: `${playing.length} autoplaying video(s).`, viewport: vp.name, evidence: path.relative(process.cwd(), shot) });
        }
      } catch (err) {
        allIssues.push({ id: "VA-REDUCED", severity: "p2", title: "Reduced-motion pass failed", detail: String(err.message).slice(0, 200), viewport: vp.name });
      } finally {
        await rctx.close();
      }
    }

    report.viewports.push({
      name: vp.name,
      width: vp.width,
      height: vp.height,
      dpr: vp.dpr,
      metrics,
      reduced,
      console: uniqueConsole,
      pageErrors,
      failedRequests: uniqueFailed,
      screenshots
    });
    report.screenshots.push(...screenshots);
    await context.close();
  }

  await browser.close();

  report.issues = dedupeIssues(allIssues);
  report.summary = scoreIssues(report.issues);
  report.issues.sort((a, b) => ({ p0: 0, p1: 1, p2: 2 }[a.severity] - { p0: 0, p1: 1, p2: 2 }[b.severity]));

  if (opts.baseline) {
    const baselineDir = path.resolve(opts.baseline);
    const manifest = Object.fromEntries(report.screenshots.map((s) => [path.basename(s), sha256(path.resolve(s))]));
    const manifestPath = path.join(baselineDir, "baseline.json");
    if (opts.updateBaseline) {
      fs.mkdirSync(baselineDir, { recursive: true });
      fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
      report.baseline = { updated: true, path: manifestPath };
    } else if (fs.existsSync(manifestPath)) {
      const prev = JSON.parse(fs.readFileSync(manifestPath, "utf8")).files || {};
      const changed = Object.entries(manifest).filter(([name, hash]) => prev[name] && prev[name] !== hash).map(([name]) => name);
      const added = Object.keys(manifest).filter((name) => !prev[name]);
      const removed = Object.keys(prev).filter((name) => !manifest[name]);
      report.baseline = { changed, added, removed };
    }
  }

  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outDir, "report.md"), renderMarkdown(report));

  if (opts.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`BUREAU visual audit — ${target}`);
    console.log(`${report.viewports.length} viewports · ${report.issues.length} issues · score ${report.summary.score}/100${report.summary.hardFail ? " · HARD FAIL" : ""}`);
    console.log(`P0 ${report.summary.by.p0} · P1 ${report.summary.by.p1} · P2 ${report.summary.by.p2}`);
    for (const i of report.issues.slice(0, 40)) console.log(`[${i.severity.toUpperCase()}] ${i.id} ${i.title} — ${i.detail.slice(0, 160)}`);
    console.log(`\nReport: ${path.relative(process.cwd(), path.join(outDir, "report.md"))}`);
  }

  if (opts.failOn !== "none") {
    const rank = { p0: 0, p1: 1, p2: 2 };
    const threshold = rank[opts.failOn];
    if (threshold === undefined) {
      console.error(`Invalid --fail-on value: ${opts.failOn}`);
      process.exit(2);
    }
    if (report.issues.some((i) => rank[i.severity] <= threshold)) process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.stack || err);
  process.exit(1);
});
