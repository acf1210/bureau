#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Regenerate the template gallery in the showcase and the three READMEs from
 * skill/assets/templates/catalog.json, between <!-- gallery:start --> and <!-- gallery:end -->.
 * Usage: node scripts/gallery.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "skill", "assets", "templates", "catalog.json"), "utf8"));
const check = process.argv.includes("--check");
const PAGES = "https://acf1210.github.io/bureau/demos";
const img = (id, kind) => `site/assets/img/demos/${id}-${kind}.webp`;

const readme = (lang) => {
  const head = { "pt-BR": ["Template", "Tema", "Mescla", "Assinatura"], en: ["Template", "Theme", "Blend", "Signature"], es: ["Plantilla", "Tema", "Mezcla", "Firma"] }[lang];
  const open = { "pt-BR": "Abrir", en: "Open", es: "Abrir" }[lang];
  const cells = catalog.map((t) => `<td width="33%" valign="top"><a href="${PAGES}/${t.id}/index.html"><img src="${img(t.id, "desktop")}" alt="${t.title}: ${t.alt}" width="100%"></a><br><a href="${PAGES}/${t.id}/index.html"><img src="${img(t.id, "mobile")}" alt="${t.title}, mobile" width="38%"></a><br><b>${t.title}</b><br><sub>${t.theme[lang]} · ${t.lineage}</sub><br><sub>${t.move[lang]}. <a href="${PAGES}/${t.id}/index.html">${open} ↗</a></sub></td>`);
  const rows = [];
  for (let i = 0; i < cells.length; i += 3) rows.push(`<tr>\n${cells.slice(i, i + 3).join("\n")}\n</tr>`);
  const table = `| ${head.join(" | ")} |\n|---|---|---|---|\n` + catalog.map((t) => `| [${t.title}](${PAGES}/${t.id}/index.html) | ${t.theme[lang]} | ${t.lineage} | ${t.move[lang]} |`).join("\n");
  return `<table>\n${rows.join("\n")}\n</table>\n\n${table}`;
};

const site = () => catalog.map((t, i) => `      <a class="demo${i === 0 ? " demo--lead" : i === catalog.length - 1 ? " demo--close" : ""}" href="demos/${t.id}/index.html">
        <div class="demo__media">
          <picture><source type="image/avif" srcset="assets/img/demos/${t.id}-desktop.avif"><img src="assets/img/demos/${t.id}-desktop.webp" alt="${t.title}: ${t.alt}." width="1200" height="750" loading="lazy"></picture>
          <picture class="demo__phone"><source type="image/avif" srcset="assets/img/demos/${t.id}-mobile.avif"><img src="assets/img/demos/${t.id}-mobile.webp" alt="" width="480" height="1039" loading="lazy"></picture>
        </div>
        <div class="demo__body">
          <div><h3>${t.title}</h3><p><b>${t.lineage}.</b> ${t.move.en}.</p></div>
          <span class="demo__tag">${t.theme.en}</span>
        </div>
      </a>`).join("\n");

const targets = [
  ["site/index.html", () => site()],
  ["README.md", () => readme("pt-BR")],
  ["README.en.md", () => readme("en")],
  ["README.es.md", () => readme("es")]
];
let stale = 0;
for (const [file, make] of targets) {
  const abs = path.join(root, file);
  const text = fs.readFileSync(abs, "utf8");
  const re = /(<!-- gallery:start -->)[\s\S]*?\n([ \t]*)(<!-- gallery:end -->)/;
  if (!re.test(text)) { console.error(`${file}: gallery markers missing`); process.exitCode = 2; continue; }
  const next = text.replace(re, (_, start, indent, end) => `${start}\n${make()}\n${indent}${end}`);
  if (next !== text) {
    stale++;
    if (check) console.error(`${file}: gallery is out of date; run node scripts/gallery.mjs`);
    else { fs.writeFileSync(abs, next); console.log(`updated ${file}`); }
  }
}
if (check && stale) process.exitCode = 1;
