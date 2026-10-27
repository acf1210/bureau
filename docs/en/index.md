# BUREAU — the autonomous digital design bureau

**BUREAU** is an agent skill that turns a language model into a complete design bureau: creative direction, art direction, typography, color, motion, WebGL, video, Figma, Playwright QA, accessibility, performance, copy, and adversarial review.

It is not a template generator. It is a **system for aesthetic decisions backed by evidence**.

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau
bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

Restart your agent and ask: *"Use BUREAU to design my brand site."*

---

## The problem

Models are trained on the average of the internet. Without direction they produce the same centered hero, the same purple gradient, the same three icon cards, the same "empower your business" copy. That is not a CSS problem. It is a lack of **concept, specificity, and review**.

BUREAU attacks all three:

1. **Concept before pixels** — three directions, one argued choice.
2. **Verifiable craft** — typography, color, composition, motion, and performance with explicit rubrics.
3. **Adversarial review** — ten independent gates and a Tribunal with veto power.

---

## What it does

| Capability | Output |
|---|---|
| **Creative direction** | three distinct directions, decision matrix, signature move |
| **Art direction** | visual world, palette, type, material, light, image |
| **Design system** | OKLCH tokens, type scale, spacing, motion, components |
| **Motion** | motion grammar, scroll narrative, microstates, reduced motion |
| **WebGL / 3D** | shaders, Three.js/R3F, particles, static fallback |
| **Video & parallax** | compressed loops, poster, captions, depth layers |
| **Figma** | MCP, variables, comps, handoff, side-by-side comparison |
| **Playwright** | multi-viewport screenshots, contrast, overflow, console, performance |
| **Accessibility** | WCAG 2.2 AA, keyboard, focus, motion, media, zoom |
| **Anti-AI-slop** | deterministic detector, 106-signal taxonomy, fixes |
| **Copy & truth** | voice, headlines, microcopy, sourced claims, SEO, i18n |
| **Ship** | OG, analytics, consent, monitoring, rollback |

---

## The circuit

```
G0 Intake → G1 Concept → G2 Direction → G3 Type & Color → G4 Composition
→ G5 Motion → G6 Engineering → G7 Access → G8 Truth → G9 Launch → TRIBUNAL
```

Each gate has a persona, a weight, hard failures, and required evidence. Total 100. Any P0, any gate below 3.5/5, or missing evidence **fails the release**.

| Verdict | Score |
|---|---|
| Award Track | ≥ 90 |
| Pass | 82–89 |
| Conditional | 72–81 |
| Fail | < 72 |

The Tribunal does not rewrite scores. It asks whether the work keeps the promise, whether any gate is passing on charm, and whether the bureau would sign it in public.

Read the full circuit in [review-circuit.md](review-circuit.md).

---

## Why it is different

- **It does not interview forever.** It decides with defensible defaults and at most three blocking questions.
- **It does not accept "beautiful".** Every claim points to a screenshot, metric, recording, or file.
- **It does not average.** A 95 with one accessibility P0 is a Fail.
- **It does not fabricate credibility.** Unsourced metrics, logos, quotes, and awards are P0.
- **It does not ship a template.** Every deliverable has a signature move and a technological proof.
- **It does not abandon craft.** The detector covers the mechanical; the eye covers the rest.

---

## Quick start

```bash
# 1. Check the environment
node skill/scripts/doctor.mjs

# 2. Create a project from one of the thirteen templates
node skill/scripts/new-project.mjs my-site --template kinetic-editorial

# 3. Fill in BUREAU.md and run the circuit
node skill/scripts/audit.mjs . --out .bureau/evidence/audit.json
node skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa
node skill/scripts/review.mjs --status
```

- [Install](install.md)
- [First 15 minutes](quickstart.md)
- [Architecture](architecture.md)
- [Workflow](workflow.md)
- [Commands](commands.md)
- [Anti-slop](antislop.md)
- [Visual language](design-language.md)

---

## Repository

```
skill/                 the installable skill
  SKILL.md             router and doctrine
  references/          30 depth modules
  scripts/             audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/              templates, tokens, snippets, media, diagrams
installers/            Claude, Codex, Antigravity, Hermes + bash/PowerShell
docs/                  PT-BR, EN, ES
site/                  landing + static docs
```

---

## License and credits

MIT. BUREAU is an original work; it references [Impeccable](https://github.com/pbakaus/impeccable), [Colorfigures](https://april-zhu.com/colorfigures), [Font Awesome](https://github.com/FortAwesome/Font-Awesome), and the galleries in `skill/references/20-reference-library.md`. PANTONE® is a trademark of Pantone LLC; BUREAU is not affiliated. Hex values are screen approximations.
