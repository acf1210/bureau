# Commands

Commands are invoked as `/bureau <command>` when the host exposes slash commands, or through natural language. The `SKILL.md` router also accepts unlabelled requests.

## Table

| Command | Intent | Reads | Produces |
|---|---|---|---|
| `/bureau` | router | project | two highest-value next actions with evidence |
| `/bureau auto` | full pipeline | brief, repo | artifacts + evidence, 3 checkpoints |
| `/bureau init` | brief and config | request, repo, assets | `BUREAU.md`, `.bureau/config.json` |
| `/bureau concept` | three directions | brief, references | `.bureau/comps/` + decision |
| `/bureau direction` | visual world | decision | `DESIGN.md`, tokens, specimen |
| `/bureau build` | implementation | `DESIGN.md` | real page |
| `/bureau motion` | movement | `MOTION.md` | entrance, scroll, interaction |
| `/bureau figma` | Figma → code | variables, frames | tokens, comparison |
| `/bureau qa` | technical evidence | URL/build | screenshots, `report.json` |
| `/bureau review` | circuit | scores, evidence | scorecard, verdict |
| `/bureau slop` | detector + fixes | source | `audit.json`, fixes |
| `/bureau ship` | launch | checklist | metadata, monitoring, deploy |
| `/bureau doctor` | environment | host, deps | capability report |

---

## `/bureau`

With no argument, inspect the project:

- no `BUREAU.md` → propose `init`;
- no comps → propose `concept`;
- URL without QA → propose `qa`;
- stale QA → propose `review`;
- everything ready → propose `ship`.

Lead with **two** highest-value actions and one line of evidence each. Never auto-run a destructive step.

---

## `/bureau auto`

Run the full pipeline with **three human checkpoints**:

1. **Direction choice** — three comps + a recommendation.
2. **Art direction lock** — world sheet, type specimen, color sheet.
3. **Ship** — scorecard + launch checklist.

Between checkpoints, act: write artifacts, run scripts, fix P0/P1, re-run evidence. Do not ask permission for reversible decisions. Stop only when the checkpoint needs taste, truth, or an irreversible commitment.

If the user cannot attend, choose the most defensible option, record the assumption, and continue. The Tribunal still applies.

## `/bureau init`

1. Ask at most three blocking questions per round.
2. Default everything else.
3. Write `BUREAU.md` and `.bureau/config.json`.
4. Declare the mode per surface.
5. Build the evidence inventory.

Definition of ready: offer, audience, sourced proof, non-goals, metric.

---

## `/bureau concept`

1. Generate three directions with different lenses.
2. Create three comps at the same viewport with real content.
3. Score with the 6-criteria matrix.
4. Choose and record the decision + rejected directions.
5. Write the chosen blend in `.bureau/comps/blend.md`: three lineages, three axes, one tension.

Never deliver three variations of the same idea.

---

## `/bureau direction`

1. World sheet: ground, voice, light, material, motion, image, prohibitions.
2. OKLCH + hex tokens, scale, spacing, radii.
3. Type specimen + color-in-context sheet.
4. First viewport as a thesis.
5. Validate contrast.

```bash
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

---

## `/bureau build`

1. Semantic HTML.
2. Layered CSS.
3. Minimal JS.
4. Complete states.
5. Real content.
6. i18n.

No build starts without `DESIGN.md` and a chosen comp.

---

## `/bureau motion`

1. Write `MOTION.md`.
2. Choose one character.
3. Implement one entrance, one narrative, one signature.
4. Design reduced motion.
5. Measure 60 fps.

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 --out .bureau/qa --motion
```

---

## `/bureau figma`

1. Discover available MCP tools.
2. Read variables and a frame screenshot.
3. Sync tokens.
4. Compare code vs Figma at the same viewport.
5. Record intentional deviations.

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

Without MCP: export JSON + PNG and record the limitation.

---

## `/bureau qa`

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

| Flag | Effect |
|---|---|
| `--full` / `--no-full` | full-page screenshot |
| `--motion` / `--no-motion` | reduced-motion pass |
| `--scroll-shots` | frames at 25/50/75% |
| `--dark` | dark color scheme |
| `--locale` | browser locale |
| `--baseline` | hash comparison against a baseline |
| `--update-baseline` | write baseline |
| `--fail-on p0` | exit 1 on P0 |

The report covers overflow, contrast, touch targets, images, fonts, videos, console, requests, LCP, CLS, long tasks, and reduced motion.

---

## `/bureau review`

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g1-concept --scores .bureau/review/g1.json
node skill/scripts/review.mjs --delivery-init
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

- Enforces order.
- Enforces evidence.
- Refuses score < 3.5 and P0.
- Marks stale gates by hash.
- Writes `.bureau/review/scorecard.html`.

---

## `/bureau slop`

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

Detects the mechanical subset: purple gradient, gradient text, pure ground, default AI fonts, generic lexicon, placeholders, autoplay, accessibility overflow, `transition: all`, scroll hijack, `div onclick`, and more.

It does not detect talent. Read findings in context.

---

## `/bureau ship`

Checklist:

- sourced claims;
- 1200×630 OG;
- sitemap/robots;
- 404/500;
- analytics + consent;
- monitoring;
- rollback;
- redirects;
- security headers.

---

## `/bureau doctor`

```bash
node skill/scripts/doctor.mjs
node skill/scripts/doctor.mjs --json
```

Checks Node, Playwright, Chromium, ffmpeg, ImageMagick, git, gh, Figma, project artifacts, and per-host installs.

---

## Scaffold

```bash
node skill/scripts/new-project.mjs --list
node skill/scripts/new-project.mjs my-site --template product-surface
```

Creates the project + `BUREAU.md`, `DESIGN.md`, `MOTION.md`, config, evidence folders, the template's `LINEAGE.md`, and a README. The page starts as a copy of the template; measure how far it has moved:

```bash
node skill/scripts/divergence.mjs index.html --templates --out .bureau/evidence/divergence.json
```

Exit 0 when every pair is at or below `--max` (default 0.35), 1 when a pair is too similar, 2 on a usage error.

---

## Tokens

```bash
node skill/scripts/tokens.mjs \
  --in design/tokens.json \
  --out-dir src/styles \
  --mode light \
  --check
```

Accepts W3C DTCG, Tokens Studio, and flat JSON. Generates:

- `tokens.css` (hex + OKLCH override);
- `tokens.tailwind.css` (`@theme`);
- `tokens.normalized.json`;
- `contrast.md`.

`--check` fails on contrast < 4.5:1 and unresolved aliases.

---

## Figma sync

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
```

Accepts:

- Tokens Studio (`global`/`light`/`dark`);
- W3C DTCG;
- Figma Variables export (`variables[]` with `valuesByMode`).

Resolves aliases and reports unresolved ones.

---

## Exit codes

| Code | Meaning |
|---|---|
| 0 | success |
| 1 | quality failure (threshold, gate, contrast) |
| 2 | usage/invalid input |
| 3 | precondition (gate order, missing Tribunal) |
| 4 | missing evidence |

---

## Flow examples

```bash
# new project
node skill/scripts/new-project.mjs studio --template kinetic-editorial
cd studio
node ../skill/scripts/audit.mjs . --out .bureau/evidence/audit.json

# QA
node ../skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --full --motion

# review
node ../skill/scripts/review.mjs --status
node ../skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
```

Repeat until the Tribunal. Do not skip the order.
