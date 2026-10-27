#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU project scaffold.
 * Usage:
 *   node scripts/new-project.mjs my-site --template kinetic-editorial
 *   node scripts/new-project.mjs --list
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(SKILL_ROOT, "assets", "templates");

const TEMPLATES = {
  "kinetic-editorial": "Night journal. Tschichold × Lubalin × Bass: asymmetric folio grid, Bodoni + Newsreader, live hour index.",
  "product-surface": "Planning desk. Tufte × Vignelli × Aicher: IBM Plex only, direct-labelled model, small multiples.",
  "immersive-experience": "Light installation. Moholy-Nagy × Cooper × Eames: WebGL light, type in depth, powers-of-ten scroll.",
  "legal-practice": "Arbitration chambers. Sutnar × Rand × Ruder: clauses in two registers, native popover definitions.",
  "architecture-studio": "Architecture studio. Ando × Mies × Scarpa: a slit of light that opens on scroll, plans not renders.",
  "restaurant-table": "Tasting counter. Barragán × Wyman × J. Albers: colour planes, a seat map, courses as nested squares.",
  "private-bank": "Family office. Müller-Brockmann × Crouwel × Tufte: modular grid, compounding with the formula shown.",
  "clinic-care": "Respiratory clinic. Hara × Kare × Tanaka: calm space, pixel icons, a breathing guide you start.",
  "developer-api": "Geocoding API. Gerstner × Weingart × Greiman: a playground that really matches typos, light ground.",
  "fashion-atelier": "Tailoring atelier. Brodovitch × A. Albers × B. Thompson: a pattern drafted from your measurements.",
  "record-label": "Record label. Reid Miles × Saville × Brody: type-only sleeves, synthesised sketches, an order basket.",
  "museum-archive": "Photo archive. Bo Bardi × Lustig × Munari: glass easels with the catalogue record on the back.",
  "hardware-store": "Product shop. Rams × Sottsass × Castiglioni: a lamp configurator with an exploded, priced view."
};

function parseArgs(argv) {
  const opts = { name: null, template: "kinetic-editorial", force: false, list: false, dir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--template") opts.template = argv[++i];
    else if (a === "--dir") opts.dir = argv[++i];
    else if (a === "--force") opts.force = true;
    else if (a === "--list") opts.list = true;
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU scaffold

Usage: node scripts/new-project.mjs <name> [--template <id>] [--dir <path>] [--force]
       node scripts/new-project.mjs --list
`);
      process.exit(0);
    } else if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.name = a;
  }
  return opts;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function titleFrom(name) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function brief(name, mode, template) {
  return `# BUREAU — ${titleFrom(name)}

> Scaffolded with \`${template}\`. Replace every TODO before Gate 0 passes.

## Truth
- Product: TODO — one sentence a customer would repeat.
- Audience: TODO — specific segment + current alternative.
- Job to be done: TODO — the progress the user wants.
- Offer: TODO — what they give, what they get.
- Proof (sourced): TODO — metric / demo / guarantee / credential + source.
- Claims we cannot make: TODO
- Non-goals: TODO

## Direction
- Mode: ${mode}
- Emotional target: TODO — three specific adjectives.
- Must never look like: TODO
- Signature move (hypothesis): TODO
- Technological proof (hypothesis): TODO

## Constraints
- Stack: vanilla HTML/CSS/JS (scaffold)
- Hosting: TODO
- Locales: pt-BR, en-US, es-ES
- Accessibility: WCAG 2.2 AA
- Performance: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, JS ≤ 250KB gzip
- Brand assets: TODO
- Legal: TODO

## Success
- Primary metric: TODO
- Secondary: TODO
- Instrumentation: TODO
- Definition of done: PASS on the Nine Gates + launch checklist

## Open questions
- TODO — owner, deadline, default assumption
`;
}

function design(name) {
  return `# DESIGN — ${titleFrom(name)}

> Visual contract. Tokens are normative. Replace TODO.

## Lineage
Survey five references first (references/30-reference-survey.md), then write
\`.bureau/comps/blend.md\` (references/23-lineage-and-blend.md).
The scaffold's LINEAGE.md is a worked example, not this project's lineage.
- Dominant (50–60%): TODO — designer, documented work, principle, axis.
- Counter (25–35%): TODO — must pull against the dominant.
- Accent (10–20%): TODO — one behaviour.
- Subject-only ingredient: TODO.

## Dials
ENERGY TODO / RHYTHM TODO / MOTION TODO (1–3 each; references/17-anti-ai-slop.md §8).
Without dials this is a draft without direction, not a deliverable.

## World
- Concept: TODO — one sentence.
- Ground: TODO — material + exact color.
- Light: TODO.
- Voice: TODO — display / body / mono.
- Material: TODO.
- Motion character: TODO.
- Image treatment: TODO.
- Signature move: TODO.
- Forbidden: TODO — five things this world must never do.

## Palette

| Role | Token | Value | Use |
|---|---|---|---|
| Ground | \`--color-ground\` | TODO | page ground |
| Ink | \`--color-ink\` | TODO | primary text |
| Muted | \`--color-ink-muted\` | TODO | secondary text |
| Line | \`--color-line\` | TODO | structure |
| Accent | \`--color-accent\` | TODO | emphasis |
| Accent ink | \`--color-accent-ink\` | TODO | text on accent |

## Type
- Display: TODO
- Body: TODO
- Mono: TODO
- Scale: see \`assets/tokens.css\` (replace with generated tokens)

## Layout
- Grid: 12 columns, 7/5 dominant split.
- Measure: 65ch.
- Radius family: 2 / 6 / 12.
- Spacing: 4–192 scale.

## Motion
See \`MOTION.md\`.

## Components
TODO — primitives, states, and where the signature move lives.
`;
}

function motion(name) {
  return `# MOTION — ${titleFrom(name)}

## Character
TODO — precise / viscous / mechanical / organic / cinematic, in one paragraph.

## Primitives
| Name | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| entrance | load, once | TODO — the signature only | TODO | TODO | final state, no motion |
| press | active | scale(.98) | 120ms | precise | none |
| scene | scroll | progress-driven | scrub | linear | static frame |

## Scroll narrative
1. TODO
2. TODO
3. TODO

## Budgets
- Max concurrent animations: 6
- Max ambient loops: 1
- Max scroll-linked effects: 3
- 60fps at 4× CPU throttle
`;
}

function config(name, template) {
  return JSON.stringify({
    name,
    version: 1,
    template,
    mode: "persuade",
    stack: "vanilla",
    url: "http://localhost:4173",
    paths: { source: ["index.html", "assets"], design: "DESIGN.md", brief: "BUREAU.md" },
    viewports: [
      { name: "mobile", width: 390, height: 844, dpr: 3 },
      { name: "tablet", width: 768, height: 1024, dpr: 2 },
      { name: "laptop", width: 1440, height: 900, dpr: 1 },
      { name: "wide", width: 1920, height: 1080, dpr: 1 }
    ],
    budgets: { lcpMs: 2500, inpMs: 200, cls: 0.1, jsKbGzip: 250, heroMediaKb: 1500 },
    review: { pass: 82, award: 90, conditional: 72 },
    locales: ["pt-BR", "en-US", "es-ES"],
    figma: { fileKey: null, mcp: "https://mcp.figma.com/mcp", variablesPath: "design/figma-variables.json" }
  }, null, 2) + "\n";
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.list) {
    for (const [id, desc] of Object.entries(TEMPLATES)) console.log(`${id.padEnd(24)} ${desc}`);
    return;
  }
  if (!opts.name) {
    console.error("Missing project name. Try: node scripts/new-project.mjs my-site --template kinetic-editorial");
    process.exit(2);
  }
  if (!TEMPLATES[opts.template]) {
    console.error(`Unknown template: ${opts.template}\nAvailable: ${Object.keys(TEMPLATES).join(", ")}`);
    process.exit(2);
  }
  const target = path.resolve(opts.dir || opts.name);
  if (fs.existsSync(target)) {
    const entries = fs.readdirSync(target);
    if (entries.length && !opts.force) {
      console.error(`Directory not empty: ${target}\nUse --force only if you accept overwriting scaffold files.`);
      process.exit(2);
    }
  }
  fs.mkdirSync(target, { recursive: true });
  const tpl = path.join(TEMPLATES_DIR, opts.template);
  if (!fs.existsSync(tpl)) {
    console.error(`Template missing: ${tpl}`);
    process.exit(2);
  }
  copyDir(tpl, target);

  const media = path.join(SKILL_ROOT, "assets", "media");
  const usesMedia = fs.readFileSync(path.join(tpl, "index.html"), "utf8").includes("media/");
  if (usesMedia && fs.existsSync(media) && !fs.existsSync(path.join(target, "media"))) copyDir(media, path.join(target, "media"));
  const tokens = path.join(SKILL_ROOT, "assets", "tokens", "generated", "tokens.css");
  if (fs.existsSync(tokens)) {
    fs.mkdirSync(path.join(target, "assets"), { recursive: true });
    fs.copyFileSync(tokens, path.join(target, "assets", "tokens.css"));
  }

  fs.mkdirSync(path.join(target, ".bureau", "comps"), { recursive: true });
  fs.mkdirSync(path.join(target, ".bureau", "evidence"), { recursive: true });
  fs.mkdirSync(path.join(target, ".bureau", "qa", "screenshots"), { recursive: true });
  fs.writeFileSync(path.join(target, "BUREAU.md"), brief(opts.name, "persuade", opts.template));
  fs.writeFileSync(path.join(target, "DESIGN.md"), design(opts.name));
  fs.writeFileSync(path.join(target, "MOTION.md"), motion(opts.name));
  fs.writeFileSync(path.join(target, ".bureau", "config.json"), config(opts.name, opts.template));
  fs.writeFileSync(path.join(target, ".bureau", "evidence", "README.md"), "Drop contrast sheets, type specimens, lighthouse JSON, keyboard notes and copy review here.\n");
  fs.writeFileSync(path.join(target, "README.md"), `# ${titleFrom(opts.name)}

Scaffolded by BUREAU (${opts.template}).

## Run

\`\`\`bash
npx serve .        # or python3 -m http.server 4173
\`\`\`

## Review

\`\`\`bash
node <bureau>/scripts/audit.mjs . --out .bureau/evidence/audit.json
node <bureau>/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa
node <bureau>/scripts/review.mjs --status
\`\`\`

Start with \`BUREAU.md\`: replace every TODO before designing.
`);

  console.log(`BUREAU project created: ${target}`);
  console.log(`Template: ${opts.template}`);
  console.log(`Next: fill BUREAU.md, then survey five references: node ${path.join(SKILL_ROOT, "scripts", "survey.mjs")} --init --need <need> --probe`);
  console.log(`Then write .bureau/comps/blend.md and run the concept gate.`);
  console.log(`The page starts as a copy of the template. Before Gate 2: node ${path.join(SKILL_ROOT, "scripts", "divergence.mjs")} index.html --templates`);
}

main();
