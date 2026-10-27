#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Regenerate the ShowCase gallery in the landing and the three READMEs from
 * showcase/catalog.json, between <!-- gallery:start --> and <!-- gallery:end -->.
 * Usage: node scripts/gallery.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "showcase", "catalog.json"), "utf8"));
const check = process.argv.includes("--check");
const PAGES = "https://acf1210.github.io/bureau/showcase";
const img = (id, kind) => `site/assets/img/showcase/${id}-${kind}.webp`;

// README: each model gets a row of its own, the desktop fold beside its phone composition.
const readme = (lang) => {
  const open = { "pt-BR": "Abrir", en: "Open", es: "Abrir" }[lang];
  const mobile = { "pt-BR": "mobile", en: "mobile", es: "móvil" }[lang];
  const rows = catalog.map((t) => `<tr>
<td width="72%" valign="top"><a href="${PAGES}/${t.id}/index.html"><img src="${img(t.id, "desktop")}" alt="${t.title}: ${t.alt}" width="100%"></a></td>
<td width="28%" valign="top"><a href="${PAGES}/${t.id}/index.html"><img src="${img(t.id, "mobile")}" alt="${t.title}, ${mobile}" width="100%"></a></td>
</tr>
<tr>
<td colspan="2"><b>${t.title}</b> · ${t.theme[lang]} · <sub>${t.lineage}</sub><br>${t.move[lang]}. <a href="${PAGES}/${t.id}/index.html">${open} ↗</a></td>
</tr>`);
  return `<table>\n${rows.join("\n")}\n</table>`;
};

const cls = (i) => i === 0 ? " demo--lead" : i === catalog.length - 1 ? " demo--wide" : "";
const site = () => catalog.map((t, i) => `      <a class="demo${cls(i)}" href="showcase/${t.id}/index.html" aria-label="${t.title}: ${t.theme.en}. ${t.lineage}. ${t.move.en}.">
        <div class="demo__media">
          <picture><source type="image/avif" srcset="assets/img/showcase/${t.id}-desktop.avif"><img src="assets/img/showcase/${t.id}-desktop.webp" alt="${t.title}: ${t.alt}." width="1200" height="750" loading="lazy"></picture>
          <picture class="demo__phone"><source type="image/avif" srcset="assets/img/showcase/${t.id}-mobile.avif"><img src="assets/img/showcase/${t.id}-mobile.webp" alt="" width="480" height="1039" loading="lazy"></picture>
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
