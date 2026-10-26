/* @bureau-internal — excluded from design audits */
/**
 * Design fingerprint of an HTML page.
 * Extracts the decisions that make a page recognizable (palette, faces, easing,
 * declarations, class vocabulary, section skeleton, favicon) so two pages can
 * be compared. It measures sameness, not quality.
 */

import crypto from "node:crypto";
import { hexToOklch } from "./color.mjs";

export const DIMENSIONS = {
  palette: 0.2,
  faces: 0.15,
  easing: 0.1,
  declarations: 0.25,
  vocabulary: 0.1,
  skeleton: 0.15,
  favicon: 0.05
};

function styles(html) {
  const blocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  const inline = [...html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)].map((m) => m[1]);
  return blocks.join("\n") + "\n" + inline.join(";");
}

// Colors are binned perceptually so #0B0B0C and #08090A count as the same ink.
function bin({ l, c, h }) {
  const lightness = Math.round(l * 10);
  return c < 0.035 ? `L${lightness}:neutral` : `L${lightness}:h${Math.round(h / 30) % 12}`;
}

function palette(css) {
  const out = new Set();
  for (const m of css.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)) {
    let hex = m[0].toLowerCase();
    if (hex.length === 4) hex = "#" + [...hex.slice(1)].map((x) => x + x).join("");
    const lch = hexToOklch(hex);
    if (lch) out.add(bin(lch));
  }
  for (const m of css.matchAll(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/gi)) {
    const l = Number(m[1]) / (m[2] ? 100 : 1);
    out.add(bin({ l, c: Number(m[3]), h: Number(m[4]) }));
  }
  return out;
}

function faces(html, css) {
  const out = new Set();
  for (const m of html.matchAll(/family=([^&"':]+)/g)) out.add(decodeURIComponent(m[1]).replace(/\+/g, " ").toLowerCase());
  for (const m of css.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
    const first = m[1].split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    if (first && !first.startsWith("var(")) out.add(first);
  }
  for (const m of css.matchAll(/--[\w-]*(?:display|body|mono|serif|sans|font)[\w-]*\s*:\s*([^;}]+)/gi)) {
    const first = m[1].split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    if (first) out.add(first);
  }
  return out;
}

function easing(css) {
  const out = new Set();
  for (const m of css.matchAll(/cubic-bezier\([^)]*\)|steps\([^)]*\)|linear\([^)]*\)/gi)) out.add(m[0].replace(/\s+/g, "").toLowerCase());
  return out;
}

function declarations(css) {
  const out = new Set();
  // @font-face blocks are loading mechanics (metric fallbacks), not design decisions.
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@font-face\s*\{[^}]*\}/g, "");
  for (const m of body.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/gi)) {
    const prop = m[1].toLowerCase();
    if (prop.startsWith("--")) continue;
    const value = m[2].trim().toLowerCase().replace(/\s+/g, " ");
    if (value.length > 160) continue;
    out.add(`${prop}:${value}`);
  }
  return out;
}

function vocabulary(html) {
  const out = new Set();
  for (const m of html.matchAll(/\sclass\s*=\s*"([^"]*)"/gi)) for (const c of m[1].split(/\s+/)) if (c) out.add(c);
  return out;
}

function skeleton(html) {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] || html;
  const seq = [];
  for (const m of main.matchAll(/<(section|header|footer|aside|figure|form|table|details|nav|article|canvas|video|dl|ol|ul)\b/gi)) seq.push(m[1].toLowerCase());
  const grams = new Set();
  for (let i = 0; i + 2 < seq.length; i++) grams.add(seq.slice(i, i + 3).join(">"));
  return grams;
}

function favicon(html) {
  const href = html.match(/<link[^>]*rel\s*=\s*"icon"[^>]*href\s*=\s*"([^"]+)"/i)?.[1];
  return new Set(href ? [crypto.createHash("sha1").update(href).digest("hex").slice(0, 12)] : []);
}

export function fingerprint(html) {
  const css = styles(html);
  return {
    palette: palette(css),
    faces: faces(html, css),
    easing: easing(css),
    declarations: declarations(css),
    vocabulary: vocabulary(html),
    skeleton: skeleton(html),
    favicon: favicon(html)
  };
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  return shared / (a.size + b.size - shared);
}

export function compare(htmlA, htmlB) {
  const a = fingerprint(htmlA);
  const b = fingerprint(htmlB);
  const dimensions = {};
  let total = 0;
  for (const [dim, weight] of Object.entries(DIMENSIONS)) {
    const score = jaccard(a[dim], b[dim]);
    const shared = [...a[dim]].filter((x) => b[dim].has(x));
    dimensions[dim] = { similarity: Number(score.toFixed(3)), weight, shared: shared.slice(0, 12) };
    total += score * weight;
  }
  return { similarity: Number(total.toFixed(3)), dimensions };
}
