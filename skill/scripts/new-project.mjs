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
  "kinetic-editorial": "Dark editorial world: Bodoni display, acid signal, scroll-driven type, generated film loop.",
  "product-surface": "Warm technical product surface: paper ground, live demo, precise motion, no SaaS clichés.",
  "immersive-experience": "Raw WebGL atmosphere, pointer/scroll response, cinematic threshold, accessible fallback."
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
| reveal | in-view | opacity + translateY | 600ms | out | opacity only |
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
  if (fs.existsSync(media)) copyDir(media, path.join(target, "media"));
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
  console.log(`Next: fill BUREAU.md, then run the concept gate.`);
}

main();
