#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Write the landing's static proof list (between <!-- proof:start --> and <!-- proof:end -->) from the detector's
 * real output on site/assets/specimen/generic.html, using the same engine the page runs in the browser.
 * Usage: node scripts/proof.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { rules } from "../skill/scripts/lib/rules.mjs";
import { proof } from "../site/assets/proof-engine.js";

const root = path.resolve(import.meta.dirname, "..");
const SYM = { color: "del", imagery: "del", type: "wf", content: "qy", motion: "mo", access: "ins", behavior: "fix", engineering: "eng", composition: "rs" };
// Titles are entity-encoded so the page that quotes a rule never trips it.
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/:/g, "&#58;").replace(/!/g, "&#33;").replace(/ /g, "&#32;");
const marks = proof(fs.readFileSync(path.join(root, "site", "assets", "specimen", "generic.html"), "utf8"), rules);
const items = marks.map((m) => `            <li data-rule="${m.id}" data-sym="${SYM[m.category] || "qy"}"><span class="sym" aria-hidden="true">${SYM[m.category] || "qy"}</span><span class="id">${m.id}<small>${m.severity.toUpperCase()}, line ${m.line}</small></span><span class="t">${esc(m.title)}</span></li>`).join("\n");
const p0 = marks.filter((m) => m.severity === "p0").length;
const summary = `${marks.length} marks, ${p0} of them P0: the specimen ${p0 ? "fails" : "goes back for changes"}. Listed from the detector's output at build time.`;

const file = path.join(root, "site", "index.html");
const text = fs.readFileSync(file, "utf8");
let next = text.replace(/(<!-- proof:start -->)[\s\S]*?\n([ \t]*)(<!-- proof:end -->)/, (_, a, indent, b) => `${a}\n${items}\n${indent}${b}`);
next = next.replace(/(<span class="no-js-only">)[^<]*(<\/span>)/, `$1${summary}$2`);
if (next === text) { console.log(`proof list current: ${marks.length} marks`); process.exit(0); }
if (process.argv.includes("--check")) { console.error("site/index.html: proof list is out of date; run node scripts/proof.mjs"); process.exit(1); }
fs.writeFileSync(file, next);
console.log(`updated site/index.html: ${marks.length} marks`);
