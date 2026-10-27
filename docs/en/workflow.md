# Workflow

BUREAU works in **passes**, not one shot. Each pass leaves an artifact and a decision.

![Workflow](../assets/diagrams/workflow.svg)

## Overview

For collaborative work, use the roles, handoff contract, technical illustration checks and source boundaries in `skill/references/25-collaborative-studio.md`. Roles can be performed sequentially by one agent; independent review must never be claimed unless it occurred. External tools and skills are optional and require license and provenance checks.

To compare versions by design quality or approval rate, use the paired real-brief protocol in `skill/references/26-outcome-evaluation.md`. The design-quality rubric draws on Awwwards categories but is not an official award score. Record baseline and new results, independent verdicts and uncertainty; automated audit scores alone cannot establish an improvement.

For an assessment independent of award rubrics and the review circuit, use `skill/references/28-independent-design-assessment.md` and `skill/assets/studio-templates/independent-assessment.md`. Independent reviewers score five dimensions using evidence; missing evidence leaves the total unassessed.

For deeper briefs, reference research and optional candidate assessment, use `skill/references/27-design-intelligence.md` and `skill/assets/studio-templates/qualification.md`. The design engine starts from a five-source survey (`skill/references/30-reference-survey.md`): `survey.mjs` orders the 25 entries by the brief's need, a source that cannot be verified is skipped with its reason and the next one taken until five are verified, with the shared pattern and the creative departure recorded. The 25 entries include names still needing identification; the rubric requires evidence for every score. Continuous indexing and trend prediction are not implemented.

`node skill/scripts/source-monitor.mjs --out source-report.json` records availability of identified sources' `robots.txt` endpoints. The repository workflow schedules it daily at 09:00 UTC and retains reports for 30 days when GitHub Actions is enabled. It does not index projects or classify designs and will not overwrite a report.

| Phase | Gates | Deliverable | Typical time |
|---|---|---|---|
| A. Intake | G0 | `BUREAU.md`, `config.json` | 1–2 h |
| B. Concept | G1 | 3 directions + decision | 4–8 h |
| C. Direction | G2–G4 | `DESIGN.md`, type, color, composition | 1–2 days |
| D. Build | G4, G6 | real page, components, tokens | 2–5 days |
| E. Motion | G5 | `MOTION.md`, signature, video/3D | 1–3 days |
| F. QA | G6–G7 | screenshots, metrics, fixes | 4–8 h |
| G. Review | G8–G9 | scorecard, Tribunal, launch | 3–6 h |

A campaign site fits 5–7 days. A product with CMS and multiple surfaces, 2–4 weeks.

---

## A. Intake (G0)

**Do:**

- Read the request, repo, assets, and existing truth.
- Write `BUREAU.md`: audience, offer, proof, non-goals, metric.
- Declare the mode per surface.
- Write `.bureau/config.json` with viewports and budgets.
- Inventory evidence: what exists, what is missing, who approves.

**Do not:**

- Open Figma before knowing what the page must prove.
- Choose a palette before choosing a world.
- Invent a metric because proof is missing.

**Output:** one-page brief, config, risk list.

---

## B. Concept (G1)

**Do:**

- Generate three directions with different lenses (material, editorial, systemic, spatial, temporal, instrumental, documentary, play).
- For each: thesis, tension, emotion, ground/voice/light/motion, signature move, technological proof, risk.
- Produce three comps at the same viewport with real content.
- Score with the 6-criteria matrix.
- Record the decision and rejected directions.

**Do not:**

- Three variations of the same idea.
- Approve a direction from a generated image with no layout.
- Let the comp become the build by accident.

**Output:** `.bureau/comps/` with three comps + `decision.md` + `blend.md` (lineage: dominant × counter × accent).

---

## C. Direction (G2–G4)

**Do:**

- Write the world sheet: ground, light, voice, palette, material, motion, image, prohibitions.
- Generate tokens (OKLCH + hex) and validate contrast.
- Produce a type specimen and a color-in-context sheet.
- Compose the first viewport as a thesis.
- Test 320, 390, 768, 1440, 1920.
- Break the grid once, at the signature move.

**Do not:**

- Start with components.
- Use 24 px radius on everything.
- Confuse "minimal" with "empty".
- Let the accent appear 12 times above the fold.

**Output:** `DESIGN.md`, tokens, specimen, first viewports.

---

## D. Build (G4, G6)

**Do:**

- Semantic HTML first.
- CSS in layers (`reset, tokens, base, layout, components, utilities, motion`).
- Minimal JS; code-split heavy scenes.
- Real content in every state.
- States: default, hover, focus, active, disabled, loading, empty, error, success.
- i18n from the start (PT/EN/ES), with `lang` and `hreflang`.

**Do not:**

- Hide essential content behind hover.
- Render the hero on the client.
- Load 6 weights of 3 families.
- Leave a `div onclick` where a button belongs.

**Output:** navigable page, reproducible build, clean console.

**Then refine:** seven passes from structure to detail (`skill/references/24-refinement-passes.md`), logged in `.bureau/evidence/refinement.md`.

---

## E. Motion (G5)

Document five distinct awarded motion references with `node skill/scripts/motion-research.mjs --init` and `node skill/scripts/motion-research.mjs --check`. Use `node skill/scripts/motion-research.mjs --plan` to generate a draft production plan. Record award sources and local observation evidence; `skill/references/31-motion-production.md` explains the process and optional tools. G5 requires the completed record.

**Do:**

- Write `MOTION.md` before the effect.
- Choose a character: precise, viscous, mechanical, organic, or cinematic.
- One entrance sequence, one scroll narrative, one interaction signature.
- Animate `transform` and `opacity`.
- Design `prefers-reduced-motion`.
- Measure 60 fps at 4× CPU throttle.

**Do not:**

- Fade-up on every section.
- Scroll hijack.
- Parallax on reading text.
- Autoplay audio.
- Full-screen shader on mobile without a fallback.

**Output:** `MOTION.md`, short recording, normal + reduced screenshots.

---

## F. QA (G6–G7)

**Do:**

- Run `visual-audit.mjs` at 4 viewports.
- Open every screenshot and classify: real defect, acceptable trade-off, false positive.
- Fix at the source, not in the screenshot.
- Re-run the same command and keep before/after.
- Complete the task with keyboard only.
- Test 200% and 400% zoom.
- Test with a screen reader.

**Do not:**

- Pass because the JSON is green.
- Ignore contrast over media.
- Accept horizontal overflow.
- Let a P1 become an average.

**Output:** `.bureau/qa/` + `.bureau/evidence/`.

---

## G. Review (G8–G9)

**Do:**

- Run the static audit and read findings in context.
- Fill one `scores.json` per gate with real evidence.
- Run `review.mjs --gate` in order.
- Write the Tribunal statement.
- Generate the scorecard and attach it to delivery.
- Ship only on PASS or a written, accepted CONDITIONAL.

**Do not:**

- Review from memory.
- Reuse evidence from another build.
- Round away a P0.
- Pass because the deadline arrived.

**Output:** `scorecard.html`, verdict, blockers, next move.

---

## Figma → code loop

```
Figma frame
  → reference screenshot
  → variables/tokens
  → real code
  → screenshot at the same viewport
  → side-by-side comparison
  → fix the largest deviation
  → repeat
```

Rules:

- Same viewport, DPR, content, and state.
- Compare the hero and the signature moment first.
- Pixel difference is evidence, not the goal.
- If code and Figma disagree, decide the source of truth and update the other.

Details: `skill/references/14-figma-workflow.md`.

---

## Playwright loop

```
local server
  → visual-audit (4 viewports + reduced motion)
  → screenshots + JSON
  → human inspection
  → fix
  → identical re-run
  → baseline
```

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Details: `skill/references/15-playwright-qa.md`.

---

## Five-day sprint (example)

| Day | Morning | Afternoon |
|---|---|---|
| 1 | intake, truth, inventory | three directions + comps |
| 2 | choice, world sheet, tokens | hero + signature |
| 3 | full page, responsive | motion + reduced motion |
| 4 | QA, a11y, performance | P0/P1 fixes |
| 5 | G2–G9, Tribunal | launch checklist, ship |

If day 5 becomes day 9, the scope was wrong on day 1. Revisit the brief, not the CSS.

---

## Handoff

Always deliver:

1. the idea in one sentence;
2. the world in 3–5 lines;
3. files, stack, commands;
4. evidence: screenshots, metrics, audit, verdict;
5. honest limitations;
6. the single highest-value next move.

Without this, it is not a delivery; it is a file dump.
