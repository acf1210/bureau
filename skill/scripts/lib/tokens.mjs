/* @bureau-internal — excluded from design audits */
/**
 * Token normalization and generation.
 * Accepts W3C Design Tokens, Tokens Studio exports, and flat JSON.
 */

import { parseColor, rgbToOklch, formatOklch, contrastRatio, contrastGrade } from "./color.mjs";

const GENERIC = new Set(["system-ui", "sans-serif", "serif", "monospace", "cursive", "fantasy", "inherit", "initial", "unset", "ui-sans-serif", "ui-serif", "ui-monospace"]);

export function isTokenLeaf(v) {
  return v && typeof v === "object" && !Array.isArray(v) && ("$value" in v || "value" in v);
}

export function tokenValue(v) {
  return v && typeof v === "object" && "$value" in v ? v.$value : v?.value;
}

export function tokenType(v, key = "") {
  if (v && typeof v === "object" && "$type" in v) return v.$type;
  if (v && typeof v === "object" && "type" in v && typeof v.type === "string") return v.type;
  if (/color|background|ink|accent|surface|line|border|focus|signal/i.test(key)) return "color";
  if (/space|gap|margin|padding/i.test(key)) return "dimension";
  if (/radius/i.test(key)) return "dimension";
  if (/font/i.test(key)) return "fontFamily";
  if (/duration|delay/i.test(key)) return "duration";
  return "unknown";
}

export function toKebab(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s.]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function pickSet(input, mode) {
  if (!input || typeof input !== "object") return input;
  const setKeys = ["global", "light", "dark", "theme", "value"];
  const hasSets = setKeys.some((k) => input[k] && typeof input[k] === "object");
  if (!hasSets) return input;
  let base = {};
  if (input.global && typeof input.global === "object") base = { ...input.global };
  const chosen = mode && input[mode] && typeof input[mode] === "object" ? input[mode] : null;
  if (chosen) base = { ...base, ...chosen };
  return base;
}

export function flattenTokens(input, { mode = null } = {}) {
  const root = pickSet(input, mode);
  const flat = new Map();
  const visit = (node, pathParts) => {
    if (!node || typeof node !== "object") return;
    if (isTokenLeaf(node)) {
      const key = pathParts.join(".");
      if (!key) return;
      flat.set(key, { key, path: pathParts, value: tokenValue(node), type: tokenType(node, key), description: node.$description || node.description || "" });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$") || k === "description" || k === "type") continue;
      if (v && typeof v === "object" && !Array.isArray(v)) visit(v, [...pathParts, k]);
      else if (v !== null && v !== undefined) {
        const key = [...pathParts, k].join(".");
        flat.set(key, { key, path: [...pathParts, k], value: v, type: tokenType(v, key), description: "" });
      }
    }
  };
  visit(root, []);
  return flat;
}

export function resolveAliases(flat) {
  const out = new Map();
  const resolving = new Set();
  const resolve = (token) => {
    if (!token) return undefined;
    if (typeof token.value !== "string") return token.value;
    const m = token.value.match(/^\{([^}]+)\}$/);
    if (!m) return token.value;
    const targetKey = m[1].trim();
    if (resolving.has(targetKey)) return token.value;
    resolving.add(targetKey);
    const target = flat.get(targetKey);
    const v = target ? resolve(target) : token.value;
    resolving.delete(targetKey);
    return v;
  };
  for (const [key, token] of flat.entries()) {
    out.set(key, { ...token, resolved: resolve(token) });
  }
  return out;
}

export function formatTokenValue(token) {
  const v = token.resolved ?? token.value;
  const type = token.type;
  if (v == null) return "";
  if (Array.isArray(v)) {
    if (type === "fontFamily") return v.map((f) => (GENERIC.has(f) ? f : `"${f}"`)).join(", ");
    return v.join(", ");
  }
  if (typeof v === "number") {
    if (type === "dimension") return `${v}px`;
    if (type === "duration") return `${v}ms`;
    return String(v);
  }
  if (typeof v === "object") {
    if (v.fontFamily || v.fontSize || v.fontWeight) {
      const parts = [];
      if (v.fontWeight) parts.push(v.fontWeight);
      if (v.fontSize) parts.push(v.fontSize);
      if (v.fontFamily) parts.push(Array.isArray(v.fontFamily) ? v.fontFamily.map((f) => `"${f}"`).join(", ") : v.fontFamily);
      return parts.join(" ") || JSON.stringify(v);
    }
    if ("x" in v && "y" in v) {
      return `${v.x} ${v.y} ${v.blur ?? 0} ${v.spread ?? 0} ${v.color ?? ""}`.trim();
    }
    return JSON.stringify(v);
  }
  return String(v);
}

export function cssName(key, prefix = "") {
  const kebab = toKebab(key);
  return prefix ? `--${prefix}-${kebab}` : `--${kebab}`;
}

export function buildCss(tokens, { prefix = "", selector = ":root" } = {}) {
  const lines = [];
  const supports = [];
  for (const token of tokens.values()) {
    const name = cssName(token.key, prefix);
    const value = formatTokenValue(token);
    if (value === "") continue;
    lines.push(`  ${name}: ${value};`);
    if (token.type === "color" || parseColor(value)) {
      const rgb = parseColor(value);
      if (rgb) {
        const o = rgbToOklch(rgb);
        supports.push(`    ${name}: ${formatOklch(o)};`);
        lines.push(`  ${name}-oklch: ${formatOklch(o)};`);
      }
    }
  }
  const head = `${selector} {\n${lines.join("\n")}\n}`;
  const block = supports.length ? `\n\n@supports (color: oklch(0% 0 0)) {\n  ${selector} {\n${supports.join("\n")}\n  }\n}` : "";
  return `/* Generated by BUREAU. Do not edit by hand. */\n${head}${block}\n`;
}

export function buildTailwind(tokens) {
  const lines = [];
  for (const token of tokens.values()) {
    const value = formatTokenValue(token);
    if (!value) continue;
    let key = toKebab(token.key);
    if (token.type === "dimension" && /^space/.test(key)) key = key.replace(/^space-/, "spacing-");
    if (token.type === "fontFamily") key = key.replace(/^font-/, "font-");
    lines.push(`  --${key}: ${value};`);
  }
  return `/* Generated by BUREAU — Tailwind CSS v4 @theme. */\n@theme {\n${lines.join("\n")}\n}\n`;
}

export function colorTokens(tokens) {
  const out = [];
  for (const token of tokens.values()) {
    const value = formatTokenValue(token);
    const rgb = parseColor(value);
    if (rgb) out.push({ key: token.key, name: toKebab(token.key), value, rgb, type: token.type });
  }
  return out;
}

export function contrastPairs(tokens) {
  const colors = colorTokens(tokens);
  const bg = colors.filter((c) => /(^|[-.])(ground|surface|bg|background|canvas|paper)([-.]|$)/i.test(c.name));
  const fg = colors.filter((c) => /(^|[-.])(ink|text|fg|foreground|content|muted)([-.]|$)/i.test(c.name) && !/(^|-)accent-ink$/.test(c.name));
  const pairs = [];
  const seen = new Set();
  const add = (a, b) => {
    if (!a || !b || a.key === b.key) return;
    const id = a.key + "|" + b.key;
    if (seen.has(id)) return;
    seen.add(id);
    const ratio = contrastRatio(a.rgb, b.rgb);
    if (ratio == null) return;
    pairs.push({ fg: a.key, bg: b.key, ratio: Math.round(ratio * 100) / 100, grade: contrastGrade(ratio), pass: ratio >= 4.5 });
  };
  for (const b of bg) for (const f of fg) add(f, b);
  for (const c of colors) {
    if (/(^|-)accent-ink$/.test(c.name)) {
      const accent = colors.find((x) => /(^|-)accent$/.test(x.name));
      add(c, accent);
    }
  }
  return pairs;
}

export function contrastMarkdown(pairs) {
  const lines = ["# Contrast report", "", "| Foreground | Background | Ratio | Grade | AA body |", "|---|---|---:|---|---|"];
  for (const p of pairs.sort((a, b) => a.ratio - b.ratio)) {
    lines.push(`| \`${p.fg}\` | \`${p.bg}\` | ${p.ratio}:1 | ${p.grade} | ${p.pass ? "pass" : "FAIL"} |`);
  }
  return lines.join("\n") + "\n";
}

export function toDtcg(tokens) {
  const root = {};
  for (const token of tokens.values()) {
    let node = root;
    for (const part of token.path) {
      node[part] ??= {};
      node = node[part];
    }
    const value = token.resolved ?? token.value;
    node.$value = value;
    node.$type = token.type === "unknown" ? "string" : token.type;
    if (token.description) node.$description = token.description;
  }
  return root;
}
