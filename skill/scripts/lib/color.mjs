/**
 * Color utilities for BUREAU.
 * sRGB <-> OKLCH, WCAG contrast, parsing, blending.
 * No dependencies.
 */

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export function parseHex(hex) {
  if (typeof hex !== "string") return null;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3 || h.length === 4) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function parseRgb(str) {
  if (typeof str !== "string") return null;
  const m = str.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i);
  if (!m) return null;
  const a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: clamp(a) };
}

export function parseColor(str) {
  if (!str || typeof str !== "string") return null;
  const s = str.trim().toLowerCase();
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (s === "black") return { r: 0, g: 0, b: 0, a: 1 };
  if (s === "white") return { r: 1, g: 1, b: 1, a: 1 };
  if (s.startsWith("#")) return parseHex(s);
  if (s.startsWith("rgb")) return parseRgb(s);
  if (s.startsWith("oklch")) {
    const m = s.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)/);
    if (!m) return null;
    let l = parseFloat(m[1]);
    if (m[1].includes("%")) l /= 100;
    if (l > 1) l /= 100;
    const c = parseFloat(m[2]);
    const h = parseFloat(m[3]);
    const a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    const rgb = oklchToRgb(l, c, h);
    return { ...rgb, a: clamp(a) };
  }
  return null;
}

export function srgbToLinear(v) {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

export function relativeLuminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a, b) {
  const ca = typeof a === "string" ? parseColor(a) : a;
  const cb = typeof b === "string" ? parseColor(b) : b;
  if (!ca || !cb) return null;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function blend(fg, bg) {
  const a = fg.a ?? 1;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1
  };
}

export function rgbToHex({ r, g, b }) {
  const to = (v) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

export function rgbToOklch({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

export function oklchToRgb(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return {
    r: clamp(linearToSrgb(clamp(R))),
    g: clamp(linearToSrgb(clamp(G))),
    b: clamp(linearToSrgb(clamp(B)))
  };
}

export function hexToOklch(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  return rgbToOklch(rgb);
}

export function formatOklch({ l, c, h }, digits = 3) {
  const L = (l * 100).toFixed(1);
  const C = c.toFixed(digits);
  const H = h.toFixed(1);
  return `oklch(${L}% ${C} ${H})`;
}

export function formatOklchCss(value, alpha) {
  const rgb = parseColor(value);
  if (!rgb) return null;
  const o = rgbToOklch(rgb);
  const base = formatOklch(o);
  if (alpha !== undefined) return base.replace(/\)$/, ` / ${alpha})`);
  return base;
}

export function contrastGrade(ratio, large = false) {
  if (ratio == null) return "unknown";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (large && ratio >= 3) return "AA-large";
  return "FAIL";
}

export function isDark(color) {
  const c = typeof color === "string" ? parseColor(color) : color;
  return c ? relativeLuminance(c) < 0.2 : false;
}
