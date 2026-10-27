#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU static design audit.
 * Usage:
 *   node scripts/audit.mjs [target...] [--json] [--out file] [--fail-on p0|p1|p2|none]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rules, SEVERITY_PENALTY, createMatcher, stripHtmlForText } from "./lib/rules.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = readVersion();

const CODE_EXT = new Set([
  ".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
  ".vue", ".svelte", ".astro", ".svg"
]);
const HTML_EXT = new Set([".html", ".htm", ".vue", ".svelte", ".astro"]);
const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".bureau", "dist", "build", ".next", ".astro",
  "coverage", ".cache", ".turbo", "vendor", "test-results", "playwright-report",
  "docs", "references", ".venv", "__pycache__"
]);
const MAX_BYTES = 2 * 1024 * 1024;

function readVersion() {
  try {
    const p = path.join(__dirname, "..", "..", "VERSION");
    return fs.readFileSync(p, "utf8").trim();
  } catch {
    return "7.10.0";
  }
}

function parseArgs(argv) {
  const opts = {
    targets: [],
    json: false,
    out: null,
    failOn: "none",
    quiet: false,
    listRules: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") opts.json = true;
    else if (a === "--quiet") opts.quiet = true;
    else if (a === "--list-rules") opts.listRules = true;
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--fail-on") opts.failOn = (argv[++i] || "none").toLowerCase();
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU audit ${VERSION}

Usage: node scripts/audit.mjs [target...] [options]

Options:
  --json              print machine-readable JSON
  --out <file>        write JSON (.json) or Markdown (.md)
  --fail-on <level>   exit 1 on p0 | p1 | p2 | none (default none)
  --quiet             summary only
  --list-rules        list detector rules
`);
      process.exit(0);
    } else if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.targets.push(a);
  }
  if (!opts.targets.length) opts.targets.push(".");
  return opts;
}

function walk(target, files = []) {
  let stat;
  try { stat = fs.statSync(target); } catch { return files; }
  if (stat.isFile()) {
    if (CODE_EXT.has(path.extname(target).toLowerCase())) files.push(path.resolve(target));
    return files;
  }
  if (!stat.isDirectory()) return files;
  let entries = [];
  try { entries = fs.readdirSync(target, { withFileTypes: true }); } catch { return files; }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith(".git")) continue;
      walk(path.join(target, entry.name), files);
    } else if (entry.isFile()) {
      if (CODE_EXT.has(path.extname(entry.name).toLowerCase())) {
        files.push(path.resolve(target, entry.name));
      }
    }
  }
  return files;
}

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) {
    if (content.charCodeAt(i) === 10) line++;
  }
  return line;
}

function columnOf(content, index) {
  const last = content.lastIndexOf("\n", index - 1);
  return index - last;
}

// Waivers bind by tier. P0 is the Floor: never waived by a line comment.
// P1/P2 need the rule ID and a reason of at least MIN_REASON characters.
// `bureau-ignore-file <IDs>` in the first 24 lines exempts a file that documents tells.
const MIN_REASON = 20;
const waivers = [];

function parseWaiver(line, ruleId) {
  const m = line.match(/bureau-ignore\s+((?:BS-[A-Z0-9]+[\s,]*)+)(?::\s*(.*?))?\s*(?:\*\/|-->|$)/);
  if (!m || !m[1].split(/[\s,]+/).includes(ruleId)) return null;
  return { reason: (m[2] || "").trim() };
}

function isSuppressed(lines, index, ruleId, severity, file) {
  for (let i = 0; i <= Math.min(lines.length - 1, 23); i++) {
    const m = lines[i].match(/bureau-ignore-file\s+((?:BS-[A-Z0-9]+[\s,]*)+)/);
    if (m && m[1].split(/[\s,]+/).includes(ruleId)) {
      waivers.push({ id: ruleId, file, line: i + 1, kind: "file", accepted: true });
      return true;
    }
  }
  for (let i = Math.max(0, index - 1); i <= Math.min(lines.length - 1, index); i++) {
    const w = parseWaiver(lines[i], ruleId);
    if (!w) continue;
    const record = { id: ruleId, file, line: i + 1, kind: "line", reason: w.reason };
    if (severity === "p0") { waivers.push({ ...record, accepted: false, rejected: "P0 is the Floor and cannot be waived" }); return false; }
    if (w.reason.length < MIN_REASON) { waivers.push({ ...record, accepted: false, rejected: `reason shorter than ${MIN_REASON} characters` }); return false; }
    waivers.push({ ...record, accepted: true });
    return true;
  }
  return false;
}

function maskHtml(content) {
  const blank = (s) => s.replace(/[^\n]/g, " ");
  return content
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, blank)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function addFinding(list, finding) {
  list.push(finding);
}

function scanFile(file, root) {
  let content;
  try {
    const stat = fs.statSync(file);
    if (stat.size > MAX_BYTES) {
      return { file, skipped: "file larger than 2 MB" };
    }
    content = fs.readFileSync(file, "utf8");
    if (content.slice(0, 400).includes("@bureau-internal")) {
      return { file, skipped: "internal bureau tool" };
    }
  } catch (err) {
    return { file, skipped: err.message };
  }
  const ext = path.extname(file).toLowerCase();
  const isHtml = HTML_EXT.has(ext);
  const masked = isHtml ? maskHtml(content) : content;
  const lines = content.split(/\r?\n/);
  const findings = [];
  const counts = new Map();

  for (const rule of rules) {
    if (rule.textOnly && !isHtml) continue;
    if (rule.skipSvg && ext === ".svg") continue;
    const target = rule.textOnly ? masked : content;
    const matcher = createMatcher(rule);
    let match;
    let perRule = 0;
    while ((match = matcher.exec(target)) !== null) {
      const index = match.index;
      const line = lineOf(target, index);
      if (isSuppressed(lines, line - 1, rule.id, rule.severity, path.relative(root, file) || path.basename(file))) continue;
      if (perRule >= 8) break;
      perRule++;
      addFinding(findings, {
        id: rule.id,
        severity: rule.severity,
        category: rule.category,
        title: rule.title,
        why: rule.why,
        fix: rule.fix,
        file: path.relative(root, file) || path.basename(file),
        line,
        column: columnOf(target, index),
        match: String(match[0]).replace(/\s+/g, " ").slice(0, 160),
        suppressed: false
      });
      if (match[0].length === 0) matcher.lastIndex++;
    }
    if (perRule) counts.set(rule.id, perRule);
  }

  return { file, content, isHtml, ext, findings, counts };
}

function tagAttr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i");
  const m = tag.match(re);
  return m ? m[1].replace(/^["']|["']$/g, "") : null;
}

function projectChecks(scanned, root) {
  const findings = [];
  const add = (f) => findings.push({ ...f });
  const htmlFiles = scanned.filter((s) => s.content && s.isHtml);

  for (const s of htmlFiles) {
    const rel = path.relative(root, s.file) || path.basename(s.file);
    const content = s.content;

    if (/<html\b/i.test(content)) {
      if (!/<meta[^>]+name\s*=\s*["']viewport["']/i.test(content)) {
        add({
          id: "BS-E06", severity: "p0", category: "engineering",
          title: "Missing viewport meta",
          why: "Without a viewport meta, mobile browsers render a zoomed-out desktop page.",
          fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
          file: rel, line: 1, column: 1, match: "<html>"
        });
      }
      if (!/<html\b[^>]*\blang\s*=/i.test(content)) {
        add({
          id: "BS-E07", severity: "p1", category: "engineering",
          title: "Missing lang attribute",
          why: "Screen readers and translators cannot determine the page language.",
          fix: 'Add lang="pt-BR" / "en" / "es" to <html>.',
          file: rel, line: 1, column: 1, match: "<html>"
        });
      }
    }

    const imgTags = content.match(/<img\b[^>]*>/gi) || [];
    for (const tag of imgTags) {
      if (tagAttr(tag, "alt") === null) {
        add({
          id: "BS-A01", severity: "p0", category: "access",
          title: "Image without alt",
          why: "Images without alt are invisible to screen readers and often break.",
          fix: 'Add descriptive alt text, or alt="" if the image is purely decorative.',
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    const videoTags = content.match(/<video\b[^>]*>/gi) || [];
    for (const tag of videoTags) {
      if (/\bautoplay\b/i.test(tag) && !/\bmuted\b/i.test(tag)) {
        add({
          id: "BS-M03V", severity: "p0", category: "motion",
          title: "Autoplaying video without muted",
          why: "Autoplay with sound is blocked by browsers and hostile to users.",
          fix: "Add muted + playsinline, or require an explicit play action.",
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    const anchors = content.match(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi) || [];
    for (const tag of anchors) {
      const relAttr = tagAttr(tag, "rel") || "";
      if (!/noopener|noreferrer/i.test(relAttr)) {
        add({
          id: "BS-A06", severity: "p2", category: "access",
          title: "target=_blank without rel",
          why: "The opened page can access window.opener in some browsers.",
          fix: 'Add rel="noopener noreferrer".',
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    const iframes = content.match(/<iframe\b[^>]*>/gi) || [];
    for (const tag of iframes) {
      if (tagAttr(tag, "title") === null) {
        add({
          id: "BS-A12", severity: "p1", category: "access",
          title: "Iframe without title",
          why: "Screen readers announce an untitled frame with no context.",
          fix: "Add a descriptive title attribute.",
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    const headings = [...content.matchAll(/<h([1-6])\b[^>]*>/gi)];
    const h1s = headings.filter((m) => m[1] === "1").length;
    if (h1s > 1) {
      add({
        id: "BS-A04B", severity: "p1", category: "access",
        title: "Multiple h1 elements",
        why: "Multiple h1s flatten the document outline for assistive technology.",
        fix: "Keep one h1 per page; use h2/h3 for sections.",
        file: rel, line: lineOf(content, headings.find((m) => m[1] === "1")?.index || 0), column: 1,
        match: `${h1s} × <h1>`
      });
    }
    let prev = 0;
    for (const m of headings) {
      const level = Number(m[1]);
      if (prev && level > prev + 1) {
        add({
          id: "BS-A04", severity: "p1", category: "access",
          title: "Skipped heading level",
          why: "Heading jumps make the page harder to navigate with a screen reader.",
          fix: `Use h${prev + 1} or restructure the section.`,
          file: rel, line: lineOf(content, m.index), column: 1,
          match: m[0].slice(0, 80)
        });
        break;
      }
      prev = level;
    }

    const labelsFor = new Set(
      [...content.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1])
    );
    // An input inside <label>…</label> is labelled implicitly.
    const labelSpans = [...content.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)].map((m) => [m.index, m.index + m[0].length]);
    const inputs = [...content.matchAll(/<input\b[^>]*>/gi)].filter((m) => !labelSpans.some(([a, b]) => m.index > a && m.index < b)).map((m) => m[0]);
    for (const tag of inputs) {
      const type = (tagAttr(tag, "type") || "text").toLowerCase();
      if (["hidden", "submit", "button", "reset", "image"].includes(type)) continue;
      const id = tagAttr(tag, "id");
      const hasAria = tagAttr(tag, "aria-label") || tagAttr(tag, "aria-labelledby");
      const labelled = id && labelsFor.has(id);
      if (!hasAria && !labelled) {
        add({
          id: "BS-A05", severity: "p1", category: "access",
          title: "Input without a label",
          why: "Placeholders are not labels; screen readers may announce nothing.",
          fix: "Add a <label for> or aria-label/aria-labelledby.",
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    const canvases = content.match(/<canvas\b[^>]*>/gi) || [];
    for (const tag of canvases) {
      if (tagAttr(tag, "aria-hidden") === null && tagAttr(tag, "role") === null) {
        add({
          id: "BS-G01", severity: "p2", category: "graphics",
          title: "Canvas without accessibility state",
          why: "A decorative canvas should be hidden; a meaningful one needs an alternative.",
          fix: 'Add aria-hidden="true" for decoration, or role + text alternative.',
          file: rel, line: lineOf(content, content.indexOf(tag)), column: 1,
          match: tag.slice(0, 120)
        });
      }
    }

    // In-page anchors and ARIA id references must resolve (a dead control is a fake control).
    const ids = new Set([...content.matchAll(/\s(?:id|name)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
    const deadAnchors = [...content.matchAll(/<a\b[^>]*\bhref\s*=\s*["']#([^"']+)["']/gi)].filter((m) => !ids.has(decodeURIComponent(m[1])));
    for (const m of deadAnchors.slice(0, 8)) {
      add({
        id: "BS-E10", severity: "p1", category: "engineering",
        title: "In-page link to a missing section",
        why: `#${m[1]} does not exist on this page; the control looks interactive and does nothing.`,
        fix: "Point the link at a real id, or remove it.",
        file: rel, line: lineOf(content, m.index), column: 1, match: m[0].slice(0, 120)
      });
    }
    const refAttrs = [...content.matchAll(/\s(aria-labelledby|aria-describedby|aria-controls|for)\s*=\s*["']([^"']+)["']/gi)];
    for (const m of refAttrs) {
      const missing = m[2].split(/\s+/).filter((x) => x && !ids.has(x));
      if (!missing.length) continue;
      add({
        id: "BS-A13", severity: "p1", category: "access",
        title: "ARIA or label reference to a missing id",
        why: `${m[1]} points at ${missing.join(", ")}, which is not on the page; assistive technology announces nothing.`,
        fix: "Give the referenced element that id, or fix the reference.",
        file: rel, line: lineOf(content, m.index), column: 1, match: m[0].trim().slice(0, 120)
      });
      break;
    }

    // A form that reports success with no request behind it is an invented outcome.
    const scripts = [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");
    if (/addEventListener\(\s*["']submit["']/.test(scripts) && !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.submit\s*\(\s*\)|\baction\s*=/.test(scripts + content.match(/<form\b[^>]*>/gi)?.join("")) ) {
      const claim = scripts.match(/["'`][^"'`]*\b(?:thanks|thank you|you(?:'|’)re (?:on the list|in|all set)|subscribed|message sent|request sent|we(?:'|’)ll be in touch|successfully)\b[^"'`]*["'`]/i);
      if (claim) {
        add({
          id: "BS-W14", severity: "p0", category: "content",
          title: "Fake send: success shown with no request",
          why: "The form tells the visitor something happened when nothing was sent.",
          fix: "Wire a real endpoint, or say plainly that nothing was sent because the form is not connected.",
          file: rel, line: lineOf(content, content.indexOf(claim[0])), column: 1, match: claim[0].slice(0, 120)
        });
      }
    }

    // Browser surfaces left at defaults: the cheapest sign a page was assembled, not built.
    const linkedCss = [...content.matchAll(/<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*href\s*=\s*["']([^"':]+)["']/gi)]
      .map((m) => { try { return fs.readFileSync(path.resolve(path.dirname(s.file), m[1]), "utf8"); } catch { return ""; } }).join("\n");
    if (/<style\b/i.test(content) && /<html\b/i.test(content) && !/::selection/.test(content + linkedCss)) {
      add({
        id: "BS-E11", severity: "p2", category: "engineering",
        title: "Browser surfaces unthemed",
        why: "Selection, caret and focus are still browser defaults on a page with its own palette.",
        fix: "Theme ::selection, caret-color and :focus-visible from the palette.",
        file: rel, line: 1, column: 1, match: "no ::selection"
      });
    }
  }

  const allSource = scanned.map((s) => s.content || "").join("\n");
  const hasMotion = /@keyframes\b|animation\s*:|animation-name\s*:|requestAnimationFrame\s*\(/.test(allSource);
  const hasReduced = /prefers-reduced-motion/i.test(allSource);
  if (hasMotion && !hasReduced) {
    add({
      id: "BS-M07", severity: "p1", category: "motion",
      title: "Motion without reduced-motion support",
      why: "Vestibular-sensitive users cannot opt out of animation.",
      fix: "Add a prefers-reduced-motion mode with a designed static alternative.",
      file: "(project)", line: 1, column: 1, match: "animation found, no @media (prefers-reduced-motion)"
    });
  }

  const hasOutlineKill = /outline\s*:\s*(?:none|0)\b/i.test(allSource);
  const hasFocusVisible = /:focus-visible|:focus\b/i.test(allSource);
  if (hasOutlineKill && !hasFocusVisible) {
    add({
      id: "BS-A02", severity: "p0", category: "access",
      title: "Focus outline removed without replacement",
      why: "Keyboard users lose their position entirely.",
      fix: "Add a high-contrast :focus-visible style; never remove focus without a replacement.",
      file: "(project)", line: 1, column: 1, match: "outline:none without :focus-visible"
    });
  }

  const primaryFamilies = (content) => {
    const families = new Set();
    for (const m of content.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
      const stack = m[1].split(",").map((x) => x.trim().replace(/^["']|["']$/g, ""));
      const first = stack.find((x) => x && !/^(?:system-ui|ui-|sans-serif|serif|monospace|cursive|fantasy|inherit|initial|unset|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Helvetica|Arial|Georgia|Times|var\()/i.test(x));
      // Metric-matched fallback faces (`… Fallback`) are not extra families.
      if (first && !first.includes("(") && !/\bFallback$/i.test(first)) families.add(first);
    }
    return families;
  };

  for (const s of scanned) {
    if (!s.content) continue;
    const rel = path.relative(root, s.file) || path.basename(s.file);
    const families = primaryFamilies(s.content);
    if (families.size > 3) {
      add({
        id: "BS-E05", severity: "p1", category: "engineering",
        title: "Too many font families in one file",
        why: `${families.size} primary families: ${[...families].join(", ")}.`,
        fix: "Limit to 2 families + 1 mono per page; remove the rest.",
        file: rel, line: 1, column: 1, match: [...families].join(", ")
      });
    }
    if (/\bSpace\s+Grotesk\b/i.test(s.content) && /\bInter\b/i.test(s.content)) {
      add({
        id: "BS-T01", severity: "p1", category: "type",
        title: "Default AI font pairing",
        why: "Space Grotesk + Inter is the default LLM startup pairing.",
        fix: "Give the display type a distinct voice; keep one body family.",
        file: rel, line: 1, column: 1, match: "Space Grotesk + Inter"
      });
    }
    const importantCount = (s.content.match(/!important/g) || []).length;
    if (importantCount > 6) {
      add({
        id: "BS-E04", severity: "p2", category: "engineering",
        title: "!important overuse",
        why: `${importantCount} uses in one file indicate a specificity problem.`,
        fix: "Fix the cascade with layers and component scope.",
        file: rel, line: 1, column: 1, match: `${importantCount} × !important`
      });
    }
  }

  const kept = findings.filter((f) => {
    if (!f.file || f.file === "(project)") return true;
    try {
      const lines = fs.readFileSync(path.resolve(root, f.file), "utf8").split(/\r?\n/);
      return !isSuppressed(lines, Math.max(0, (f.line || 1) - 1), f.id, f.severity, f.file);
    } catch {
      return true;
    }
  });

  // Waiver ledger: rejected waivers are findings; the same rule waived in more than three places is a house style.
  for (const w of waivers.filter((x) => !x.accepted)) {
    kept.push({
      id: "BS-E12", severity: "p1", category: "engineering",
      title: "Rejected waiver",
      why: `bureau-ignore ${w.id}: ${w.rejected}.`,
      fix: "Fix the finding, or give a P1/P2 waiver a specific reason of 20+ characters.",
      file: w.file, line: w.line, column: 1, match: `bureau-ignore ${w.id}`
    });
  }
  const perRule = new Map();
  for (const w of waivers.filter((x) => x.accepted && x.kind === "line")) perRule.set(w.id, (perRule.get(w.id) || 0) + 1);
  for (const [id, n] of perRule) {
    if (n > 3) kept.push({
      id: "BS-E13", severity: "p2", category: "engineering",
      title: "Waiver became a house style",
      why: `${id} is waived ${n} times; a repeated exception is a design decision.`,
      fix: "Record the decision in DESIGN.md, or fix the instances.",
      file: "(project)", line: 1, column: 1, match: `${n} × bureau-ignore ${id}`
    });
  }
  return kept;
}

function summarize(findings) {
  const bySeverity = { p0: 0, p1: 0, p2: 0 };
  const byCategory = {};
  const byRule = {};
  for (const f of findings) {
    bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
    byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    byRule[f.id] = (byRule[f.id] || 0) + 1;
  }
  const penalty =
    Math.min(60, bySeverity.p0 * SEVERITY_PENALTY.p0) +
    Math.min(60, bySeverity.p1 * SEVERITY_PENALTY.p1) +
    Math.min(20, bySeverity.p2 * SEVERITY_PENALTY.p2);
  const score = Math.max(0, 100 - penalty);
  const hardFail = bySeverity.p0 > 0;
  const grade = score >= 95 ? "A+" : score >= 90 ? "A" : score >= 82 ? "B" : score >= 72 ? "C" : score >= 60 ? "D" : "F";
  return { bySeverity, byCategory, byRule, score, grade, hardFail };
}

function severityRank(s) {
  return s === "p0" ? 0 : s === "p1" ? 1 : 2;
}

function renderText(result, quiet = false) {
  const { findings, summary, filesScanned, skipped, root } = result;
  const lines = [];
  lines.push(`BUREAU audit ${VERSION} — ${root}`);
  lines.push(`${filesScanned} files scanned · ${findings.length} findings · score ${summary.score}/100 (${summary.grade})${summary.hardFail ? " · HARD FAIL" : ""}`);
  if (summary.bySeverity.p0 || summary.bySeverity.p1 || summary.bySeverity.p2) {
    lines.push(`P0 ${summary.bySeverity.p0} · P1 ${summary.bySeverity.p1} · P2 ${summary.bySeverity.p2}`);
  }
  if (!quiet) {
    const sorted = [...findings].sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || a.file.localeCompare(b.file));
    for (const f of sorted) {
      lines.push("");
      lines.push(`[${f.severity.toUpperCase()}] ${f.id} ${f.title}`);
      lines.push(`  ${f.file}:${f.line}:${f.column}  ${f.match}`);
      lines.push(`  why: ${f.why}`);
      lines.push(`  fix: ${f.fix}`);
    }
  }
  if (skipped.length) {
    lines.push("");
    lines.push(`Skipped ${skipped.length} file(s): ${skipped.slice(0, 5).map((s) => path.relative(root, s.file)).join(", ")}${skipped.length > 5 ? "…" : ""}`);
  }
  if (!findings.length) {
    lines.push("");
    lines.push("No mechanical findings. This is not a verdict — taste, composition, and truth still require the review circuit.");
  }
  return lines.join("\n");
}

function renderMarkdown(result) {
  const { findings, summary, filesScanned, root } = result;
  const out = [];
  out.push(`# BUREAU audit — ${path.basename(root)}`);
  out.push("");
  out.push(`**Score:** ${summary.score}/100 (${summary.grade})${summary.hardFail ? " · **HARD FAIL**" : ""}  `);
  out.push(`**Files:** ${filesScanned}  `);
  out.push(`**Findings:** P0 ${summary.bySeverity.p0} · P1 ${summary.bySeverity.p1} · P2 ${summary.bySeverity.p2}`);
  out.push("");
  if (!findings.length) {
    out.push("No mechanical findings.");
  } else {
    out.push("| Severity | Rule | Title | Location | Fix |");
    out.push("|---|---|---|---|---|");
    for (const f of [...findings].sort((a, b) => severityRank(a.severity) - severityRank(b.severity))) {
      out.push(`| ${f.severity.toUpperCase()} | ${f.id} | ${f.title} | \`${f.file}:${f.line}\` | ${f.fix} |`);
    }
  }
  return out.join("\n");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.listRules) {
    for (const r of rules) console.log(`${r.severity.toUpperCase()}  ${r.id}  ${r.title}`);
    return;
  }
  const root = path.resolve(opts.targets[0]);
  const files = [...new Set(opts.targets.flatMap((t) => walk(path.resolve(t))))];
  const skipped = [];
  const scanned = [];
  for (const file of files) {
    const s = scanFile(file, root);
    if (s.skipped) skipped.push(s);
    else scanned.push(s);
  }
  const regexFindings = scanned.flatMap((s) => s.findings);
  const projectFindings = projectChecks(scanned, root);
  const findings = [...regexFindings, ...projectFindings];
  const summary = summarize(findings);
  const result = {
    root,
    meta: { tool: "bureau-audit", version: VERSION, generatedAt: new Date().toISOString(), root },
    filesScanned: files.length - skipped.length,
    skipped,
    findings,
    summary,
    waivers
  };

  if (opts.out) {
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
    const text = opts.out.endsWith(".md") ? renderMarkdown(result) : JSON.stringify(result, null, 2);
    fs.writeFileSync(path.resolve(opts.out), text);
  }
  if (opts.json) console.log(JSON.stringify(result, null, 2));
  else console.log(renderText(result, opts.quiet));

  if (opts.failOn !== "none") {
    const rank = { p0: 0, p1: 1, p2: 2 };
    const threshold = rank[opts.failOn];
    if (threshold === undefined) {
      console.error(`Invalid --fail-on value: ${opts.failOn}`);
      process.exit(2);
    }
    const fails = findings.some((f) => rank[f.severity] <= threshold);
    if (fails) process.exit(1);
  }
}

main();
