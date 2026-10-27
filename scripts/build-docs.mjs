#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Build the trilingual static documentation site into dist/.
 * Usage: node scripts/build-docs.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE = process.env.BASE_URL || "https://acf1210.github.io/bureau/";
const VERSION = fs.readFileSync(path.join(ROOT, "VERSION"), "utf8").trim();

const LANGS = {
  "pt-BR": {
    label: "Português",
    short: "PT",
    htmlLang: "pt-BR",
    docs: "Documentação",
    language: "Idioma",
    search: "Buscar na documentação…",
    edit: "Editar esta página",
    prev: "Anterior",
    next: "Próximo",
    home: "Início",
    notFound: "Página não encontrada",
    notFoundText: "O endereço mudou ou nunca existiu. Volte ao índice.",
    titles: {
      index: "Visão geral",
      quickstart: "Primeiros 15 minutos",
      architecture: "Arquitetura",
      workflow: "Fluxo de trabalho",
      "review-circuit": "Circuito de revisão",
      commands: "Comandos",
      antislop: "Anti-AI-slop",
      "design-language": "Linguagem visual",
      install: "Instalação"
    },
    descriptions: {
      index: "BUREAU é um bureau de design digital autônomo: conceito, direção de arte, motion, WebGL, Figma, Playwright QA, acessibilidade, performance e revisão adversarial.",
      quickstart: "De uma instalação limpa a um projeto com brief, comps, build, QA e circuito aberto.",
      architecture: "As camadas, scripts, artefatos e o fluxo de evidência do BUREAU.",
      workflow: "Sete passes, três loops de ferramenta e um sprint de cinco dias.",
      "review-circuit": "Dez portões ponderados e um Tribunal com poder de veto.",
      commands: "Todos os comandos, flags, scripts e códigos de saída.",
      antislop: "A taxonomia dos sinais de IA e como o BUREAU os remove.",
      "design-language": "Pantone, OKLCH, tipografia, motion e prova tecnológica.",
      install: "Claude Code, Codex, Antigravity, Hermes; atualização, remoção e troubleshooting."
    }
  },
  en: {
    label: "English",
    short: "EN",
    htmlLang: "en",
    docs: "Documentation",
    language: "Language",
    search: "Search the docs…",
    edit: "Edit this page",
    prev: "Previous",
    next: "Next",
    home: "Home",
    notFound: "Page not found",
    notFoundText: "The address changed or never existed. Go back to the index.",
    titles: {
      index: "Overview",
      quickstart: "First 15 minutes",
      architecture: "Architecture",
      workflow: "Workflow",
      "review-circuit": "Review circuit",
      commands: "Commands",
      antislop: "Anti-AI-slop",
      "design-language": "Visual language",
      install: "Install"
    },
    descriptions: {
      index: "BUREAU is an autonomous digital design bureau: concept, art direction, motion, WebGL, Figma, Playwright QA, accessibility, performance, and adversarial review.",
      quickstart: "From a clean install to a project with a brief, comps, build, QA, and an open circuit.",
      architecture: "BUREAU's layers, scripts, artifacts, and evidence flow.",
      workflow: "Seven passes, three tool loops, and a five-day sprint.",
      "review-circuit": "Ten weighted gates and a Tribunal with veto power.",
      commands: "Every command, flag, script, and exit code.",
      antislop: "The taxonomy of AI tells and how BUREAU removes them.",
      "design-language": "Pantone, OKLCH, typography, motion, and technological proof.",
      install: "Claude Code, Codex, Antigravity, Hermes; update, uninstall, troubleshooting."
    }
  },
  es: {
    label: "Español",
    short: "ES",
    htmlLang: "es",
    docs: "Documentación",
    language: "Idioma",
    search: "Buscar en la documentación…",
    edit: "Editar esta página",
    prev: "Anterior",
    next: "Siguiente",
    home: "Inicio",
    notFound: "Página no encontrada",
    notFoundText: "La dirección cambió o nunca existió. Vuelve al índice.",
    titles: {
      index: "Visión general",
      quickstart: "Primeros 15 minutos",
      architecture: "Arquitectura",
      workflow: "Flujo de trabajo",
      "review-circuit": "Circuito de revisión",
      commands: "Comandos",
      antislop: "Anti-AI-slop",
      "design-language": "Lenguaje visual",
      install: "Instalación"
    },
    descriptions: {
      index: "BUREAU es un bureau de diseño digital autónomo: concepto, dirección de arte, motion, WebGL, Figma, Playwright QA, accesibilidad, rendimiento y revisión adversarial.",
      quickstart: "De una instalación limpia a un proyecto con brief, comps, build, QA y circuito abierto.",
      architecture: "Las capas, scripts, artefactos y el flujo de evidencia de BUREAU.",
      workflow: "Siete pasos, tres bucles de herramienta y un sprint de cinco días.",
      "review-circuit": "Diez puertas ponderadas y un Tribunal con poder de veto.",
      commands: "Todos los comandos, flags, scripts y códigos de salida.",
      antislop: "La taxonomía de las señales de IA y cómo BUREAU las elimina.",
      "design-language": "Pantone, OKLCH, tipografía, motion y prueba tecnológica.",
      install: "Claude Code, Codex, Antigravity, Hermes; actualización, desinstalación y troubleshooting."
    }
  }
};

const ORDER = [
  "index", "quickstart", "architecture", "workflow",
  "review-circuit", "commands", "antislop", "design-language", "install"
];

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function slugify(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "section";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function stripTags(s) {
  return String(s).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function addImageDimensions(html, lang) {
  return html.replace(/<img\b([^>]*)>/g, (match, attrs) => {
    if (/\bwidth=/.test(attrs) && /\bheight=/.test(attrs)) return match;
    const m = attrs.match(/src="([^"]+)"/);
    if (!m || /^(https?:|data:)/.test(m[1])) return match;
    const file = path.resolve(ROOT, "docs", lang, m[1]);
    if (!fs.existsSync(file) || path.extname(file).toLowerCase() !== ".svg") return match;
    const head = fs.readFileSync(file, "utf8").slice(0, 800);
    const w = head.match(/\bwidth="(\d+)"/);
    const h = head.match(/\bheight="(\d+)"/);
    if (!w || !h) return match;
    return `<img${attrs} width="${w[1]}" height="${h[1]}">`;
  });
}

function rewrite(html) {
  html = html.replace(/href="([^"]+)\.md(#[^"]*)?"/g, 'href="$1.html$2"');
  html = html.replace(/<a href="(https?:[^"]+)"(?![^>]*target=)/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return html;
}

function parse(md) {
  let html = marked.parse(md, { gfm: true, breaks: false });
  const used = new Map();
  const toc = [];
  html = html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const text = stripTags(inner);
    let id = slugify(text);
    const n = used.get(id) || 0;
    used.set(id, n + 1);
    if (n) id = `${id}-${n + 1}`;
    if (Number(level) <= 3) toc.push({ level: Number(level), id, text });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  html = rewrite(html);
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = titleMatch ? stripTags(titleMatch[1]) : "BUREAU";
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");
  return { html, title, toc };
}

function searchIndex(md, title, url, description) {
  const entries = [{
    t: title,
    u: url,
    h: "",
    x: (description + " " + md).replace(/[#>*`_\[\]()!-]/g, " ").replace(/\s+/g, " ").slice(0, 2400)
  }];
  const parts = md.split(/\n(?=##\s)/);
  for (const part of parts) {
    const m = part.match(/^##\s+(.+)$/m);
    if (!m) continue;
    const heading = m[1].replace(/[*_`]/g, "").trim();
    entries.push({
      t: heading,
      u: `${url}#${slugify(heading)}`,
      h: title,
      x: part.replace(/[#>*`_\[\]()!-]/g, " ").replace(/\s+/g, " ").slice(0, 1600)
    });
  }
  return entries;
}

function sidebar(lang, current) {
  const meta = LANGS[lang];
  const links = ORDER.map((slug) => {
    const active = slug === current ? ' aria-current="page"' : "";
    const href = slug === "index" ? "index.html" : `${slug}.html`;
    return `<a href="${href}"${active}>${escapeHtml(meta.titles[slug] || slug)}</a>`;
  }).join("");
  const langs = Object.keys(LANGS).map((code) => {
    const href = `../${code}/${current === "index" ? "index" : current}.html`;
    const active = code === lang ? ' aria-current="true"' : "";
    return `<a href="${href}"${active}>${LANGS[code].short}</a>`;
  }).join("");
  return `<aside class="sidebar" id="sidebar">
    <p class="sidebar__label">${escapeHtml(meta.docs)}</p>
    <nav aria-label="${escapeHtml(meta.docs)}">${links}</nav>
    <p class="sidebar__label">${escapeHtml(meta.language)}</p>
    <div class="sidebar__lang">${langs}</div>
    <p class="sidebar__meta">BUREAU v${escapeHtml(VERSION)} · MIT<br><a href="../index.html">${escapeHtml(meta.home)}</a> · <a href="https://github.com/acf1210/bureau" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p>
  </aside>`;
}

function tocHtml(toc) {
  if (!toc.length) return "";
  return `<p class="toc__label">On this page</p>` + toc.map((h) => `<a class="${h.level === 3 ? "h3" : ""}" href="#${h.id}">${escapeHtml(h.text)}</a>`).join("");
}

function pageHtml({ lang, slug, title, description, html, toc, prev, next }) {
  const meta = LANGS[lang];
  const canonical = `${BASE}${lang}/${slug}.html`;
  return `<!doctype html>
<html lang="${meta.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — BUREAU</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="../assets/fonts/bodoni-moda-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/fonts/archivo-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/docs.css">
<script>try{const t=localStorage.getItem("bureau-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="progress" id="progress"></div>
<header class="topbar">
  <button class="button-ghost mobile-menu" id="menu" type="button" aria-label="Menu">☰</button>
  <a class="brand" href="../index.html">BUREAU <span>/ ${escapeHtml(meta.docs)}</span></a>
  <div class="topbar__spacer"></div>
  <div class="search">
    <input id="search-input" type="search" placeholder="${escapeHtml(meta.search)}" aria-label="${escapeHtml(meta.search)}" autocomplete="off">
    <div class="search__results" id="search-results" role="list" aria-live="polite"></div>
  </div>
  <a class="button-ghost" href="https://github.com/acf1210/bureau" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">GitHub ↗</a>
  <button class="button-ghost" id="theme" type="button" aria-label="Toggle theme">◐</button>
</header>
<div class="layout">
  ${sidebar(lang, slug)}
  <div class="doc-wrap">
    <main class="doc" id="main">
      <p class="breadcrumb">BUREAU / ${escapeHtml(meta.docs)} / ${escapeHtml(title)}</p>
      <h1>${escapeHtml(title)}</h1>
      ${description ? `<p class="doc-lede">${escapeHtml(description)}</p>` : ""}
      ${html}
      <footer class="doc-footer">
        <div>${prev ? `<a href="${prev.slug}.html">← ${escapeHtml(meta.prev)}: ${escapeHtml(prev.title)}</a>` : ""}</div>
        <div>${next ? `<a href="${next.slug}.html">${escapeHtml(meta.next)}: ${escapeHtml(next.title)} →</a>` : ""}</div>
        <div><a href="https://github.com/acf1210/bureau/blob/main/docs/${lang}/${slug}.md" target="_blank" rel="noopener noreferrer">${escapeHtml(meta.edit)} ↗</a></div>
      </footer>
    </main>
    <aside class="toc" aria-label="Table of contents">${tocHtml(toc)}</aside>
  </div>
</div>
<script src="../assets/docs.js"></script>
</body>
</html>`;
}

function landing() {
  const src = path.join(ROOT, "site", "index.html");
  if (!fs.existsSync(src)) return null;
  return fs.readFileSync(src, "utf8")
    .replaceAll("{{VERSION}}", VERSION)
    .replaceAll("{{DATE}}", new Date().toISOString().slice(0, 10));
}

function showcasePage() {
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "showcase", "catalog.json"), "utf8"));
  const cards = catalog.map((t) => `<a class="demo" href="${t.id}/index.html">
    <img src="../assets/img/showcase/${t.id}-desktop.webp" alt="" width="1200" height="750" loading="lazy" style="width:100%;height:auto;display:block;margin-bottom:.6rem">
    <span class="demo__tag">${t.theme.en.toUpperCase()}</span>
    <h2>${t.title}</h2>
    <p>${t.theme.en} · ${t.lineage}. ${t.move.en}.</p>
    <span class="demo__link">Open ↗</span>
  </a>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>BUREAU ShowCase</title>
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="../assets/fonts/bodoni-moda-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/fonts/archivo-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/docs.css">
<style>
body{background:var(--bg);color:var(--ink);font-family:var(--body);margin:0;padding:clamp(1.5rem,5vw,5rem)}
header{max-width:1100px;margin:0 auto 3rem}h1{font-family:var(--display);font-size:clamp(2.5rem,7vw,5rem);font-weight:400;margin:.2em 0}
p{color:var(--muted);max-width:60ch}.grid{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.demo{border:1px solid var(--line);padding:1.5rem;background:var(--surface);display:flex;flex-direction:column;gap:.5rem;min-height:240px}
.demo:hover{border-color:var(--acid)}.demo__tag{font:11px var(--mono);color:var(--ember);letter-spacing:.1em}
.demo h2{font-family:var(--display);font-weight:400;font-size:1.8rem;margin:0}.demo p{font-size:14px;margin:0}.demo__link{margin-top:auto;font:12px var(--mono);color:var(--acid)}
a{color:inherit;text-decoration:none}footer{max-width:1100px;margin:3rem auto 0;font:12px var(--mono);color:var(--faint)}
</style></head>
<body><header><p style="font:11px var(--mono);color:var(--ember);letter-spacing:.1em">BUREAU / SHOWCASE</p><h1>Four models, design first.</h1><p>Each model is one page with its own lineage and its own phone composition. Explore the design decisions and interactions in each example. The studios are fictional.</p></header>
<div class="grid">${cards}</div>
<footer><a href="../index.html" style="display:inline-block;padding:.6rem 0">← Back to BUREAU</a></footer></body></html>`;
}

function notFound(lang = "en") {
  const meta = LANGS[lang] || LANGS.en;
  const other = lang === "en" ? "pt-BR" : "en";
  return `<!doctype html><html lang="${meta.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — BUREAU</title><link rel="stylesheet" href="assets/docs.css"></head>
<body style="min-height:100svh;display:grid;place-items:center;padding:2rem"><main style="max-width:620px"><p style="font:11px var(--mono);color:var(--ember);letter-spacing:.14em">BUREAU / 404</p><h1 style="font-family:var(--display);font-size:clamp(3rem,10vw,7rem);font-weight:400;line-height:.9;margin:.2em 0">${meta.notFound}.</h1><p style="color:var(--muted)">${meta.notFoundText}</p><p><a href="${lang}/index.html" style="border-bottom:1px solid var(--line)">${meta.home}</a> · <a href="${other}/index.html" style="border-bottom:1px solid var(--line)">${LANGS[other].label}</a></p></main></body></html>`;
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
  ensureDir(path.join(DIST, "assets"));

  copyDir(path.join(ROOT, "site", "assets"), path.join(DIST, "assets"));
  copyDir(path.join(ROOT, "docs", "assets"), path.join(DIST, "assets"));

  const landingHtml = landing();
  if (landingHtml) fs.writeFileSync(path.join(DIST, "index.html"), landingHtml);

  // ShowCase
  const showcase = path.join(ROOT, "showcase");
  const models = fs.readdirSync(showcase).filter((name) => fs.existsSync(path.join(showcase, name, "index.html")));
  for (const name of models) copyDir(path.join(showcase, name), path.join(DIST, "showcase", name));
  fs.writeFileSync(path.join(DIST, "showcase", "index.html"), showcasePage());

  const sitemap = [];
  const search = {};

  // Landing and the ShowCase are part of the public site, not only the docs.
  sitemap.push(`${BASE}`);
  sitemap.push(`${BASE}showcase/index.html`);
  for (const name of models) sitemap.push(`${BASE}showcase/${name}/index.html`);

  for (const lang of Object.keys(LANGS)) {
    const outDir = path.join(DIST, lang);
    ensureDir(outDir);
    search[lang] = [];
    for (const slug of ORDER) {
      const file = path.join(ROOT, "docs", lang, `${slug}.md`);
      if (!fs.existsSync(file)) {
        console.warn(`Missing docs source: ${file}`);
        continue;
      }
      const md = fs.readFileSync(file, "utf8");
      const parsed = parse(md);
      const title = LANGS[lang].titles[slug] || parsed.title;
      const description = LANGS[lang].descriptions[slug] || "";
      const idx = ORDER.indexOf(slug);
      const prev = idx > 0 ? { slug: ORDER[idx - 1], title: LANGS[lang].titles[ORDER[idx - 1]] } : null;
      const next = idx >= 0 && idx < ORDER.length - 1 ? { slug: ORDER[idx + 1], title: LANGS[lang].titles[ORDER[idx + 1]] } : null;
      parsed.html = addImageDimensions(parsed.html, lang);
      // The frontmatter description is rendered as the lede; drop the leading
      // paragraph when the markdown repeats it verbatim.
      const tokenize = (value) => new Set(value.toLowerCase().replace(/<[^>]+>/g, " ").replace(/[^a-z0-9\u00c0-\u024f ]/g, " ").split(/\s+/).filter(Boolean));
      const ledeTokens = tokenize(description || "");
      if (ledeTokens.size) {
        parsed.html = parsed.html.replace(/^\s*<p>([\s\S]*?)<\/p>/, (match, inner) => {
          const bodyTokens = tokenize(inner);
          if (!bodyTokens.size) return match;
          let shared = 0;
          for (const token of bodyTokens) if (ledeTokens.has(token)) shared++;
          return shared / bodyTokens.size >= 0.6 ? "" : match;
        });
      }
      const html = pageHtml({ lang, slug, title, description, html: parsed.html, toc: parsed.toc, prev, next });
      fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
      search[lang].push(...searchIndex(md, title, `${slug}.html`, description));
      sitemap.push(`${BASE}${lang}/${slug}.html`);
    }
    fs.writeFileSync(path.join(outDir, "search.json"), JSON.stringify(search[lang]));
  }

  // Language root pages
  for (const lang of Object.keys(LANGS)) {
    const src = path.join(ROOT, "docs", lang, "index.md");
    if (!fs.existsSync(src)) continue;
    // index.html already written; no redirect needed.
  }

  fs.writeFileSync(path.join(DIST, "404.html"), notFound("en"));
  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");
  fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`);

  const count = sitemap.length;
  console.log(`BUREAU docs built → ${path.relative(process.cwd(), DIST)}`);
  console.log(`${count} pages · 3 languages · ${models.length} showcase models`);
  console.log(`Landing: ${landingHtml ? "yes" : "missing"}`);
}

main();
