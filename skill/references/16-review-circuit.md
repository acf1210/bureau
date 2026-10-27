# 16 — The Review Circuit

The circuit exists to stop the bureau from shipping work it has talked itself into liking. It is adversarial by design: ten independent gates, then a Tribunal.

**Gate Zero + Nine Gates + Tribunal.** Weighted 100. Any hard failure vetoes the release, regardless of score.

Gate 5 also requires five documented awarded motion references and a project-specific synthesis, checked as described in `31-motion-production.md`. The script validates the record, not the truth of the cited awards or observations.

## Design generation: UI, UX and innovation

The [CSS Design Awards FAQ](https://www.cssdesignawards.com/sites/guidance/43364/) describes UI as interface aesthetics and effects, UX as experience and functionality, and innovation as new design and development ideas. The checks below are BUREAU's interpretation for making projects, not official CSSDA subcriteria or an award prediction.

For each concept, record the following in `.bureau/comps/decision.md`; revisit the chosen concept against the working build and attach actual evidence to the relevant gate:

| Dimension | Generation decisions | Evidence and review |
|---|---|---|
| UI | Define hierarchy, typography, composition, color and consistent component states around the brief. | Review real-content screenshots at desktop and mobile; check legibility, contrast and states in G2–G4 and G7. |
| UX | Map the primary task, navigation, feedback, error recovery and keyboard path; account for touch and reduced motion. | Exercise the task and states in the built interface; record findings and accessibility evidence in G4, G6 and G7. Do not claim user validation without user tests. |
| Innovation | Specify one distinctive design or technical idea, the user or communication purpose it serves, its cost and a usable fallback. | Show the idea in the build, test its fallback and performance in G1, G5 and G6; remove it if it obstructs the task. Novelty alone is not proof of quality. |

Record risks, unresolved findings and the smallest correction, then rerun the affected gates and independent jury review under the existing circuit. These dimensions do not change gate weights, jury voting, score thresholds or hard failures. Do not present BUREAU's judgment as a CSSDA score, nomination or award.

```text
G0 Intake ──► G1 Concept ──► G2 Direction ──► G3 Type & Color
                                                   │
                                                   ▼
G9 Launch ◄── G8 Truth ◄── G7 Access ◄── G6 Engineering ◄── G5 Motion ◄── G4 Composition
     │
     ▼
 TRIBUNAL ──► PASS / CONDITIONAL / FAIL
```

## 1. How scoring works

Each gate is scored **0–5** in 0.5 steps. The gate score is multiplied by its weight:

```
gate points = (score / 5) × weight
total       = Σ gate points
```

| Verdict | Score | Meaning |
|---|---:|---|
| **Award Track** | ≥ 90 | Could be submitted to a serious award jury. |
| **Pass** | 82–89 | Ship. Craft is evidenced. |
| **Conditional** | 72–81 | Ship only with written acceptance of named P1s and a date. |
| **Fail** | < 72 | Do not ship. |

**Hard failures:**

- Any gate score < 3.5.
- Any unresolved P0.
- Missing required evidence.
- Fabricated claims, logos, metrics, testimonials, or awards.
- A gate reviewed against stale code (source hash mismatch).
- Tribunal veto.

A 95 average with one accessibility P0 is a Fail. That is the point.

### Three rules that hold the circuit honest

1. **Judge before you measure.** Write the design review (specificity, hierarchy, world) before you read `audit.json` or the visual report. Detector output is deterministic, but it anchors judgment: a reviewer who has seen "0 findings" grades softer.
2. **The builder is the weakest reviewer.** Whoever made the work has already argued for it. The Tribunal, and ideally Gates 1, 2 and 8, run in a fresh context (a subagent with no inherited transcript) that receives only the brief, the files and the screenshots. If that is impossible, the run is **degraded**: it says so on the first line of the scorecard and cannot reach Award Track.
3. **Checked rules hold; prose rules drift.** Every mechanical rule has a failing and a passing fixture in `tests/`. When a review finds a defect the detectors missed, add the rule and both fixtures before closing the finding.

## 2. Gate Zero — Intake

**Persona: The Producer.** Protects truth, scope, and feasibility.

**Weight:** 5

**Question:** Is the brief true, bounded, and evidenced?

**Criteria (0–5):**

- 5 — `BUREAU.md` names audience, job, offer, sourced proof, non-goals, success metric, constraints; evidence inventory is honest; mode declared.
- 3.5 — Brief exists but one of proof/constraints/non-goals is thin; assumptions are labeled.
- 2 — Brief is a wish list; no audience specificity; no proof.
- 0 — No brief; the work is being designed from vibes.

**Hard fails:**

- Invented proof or implied credibility.
- No defined audience or action.
- Scope contradicts budget/deadline with no trade-off recorded.

**Evidence:** `BUREAU.md`, `.bureau/config.json`, evidence inventory.

## 3. Gate 1 — Concept

**Persona: The Creative Director.** Protects the idea.

**Weight:** 14

**Question:** Is there an idea only this brand could own?

**Criteria:**

- 5 — Three genuinely distinct directions; the chosen one is ownable, legible, generative across the page, and buildable with real assets. The signature move is named and testable.
- 3.5 — A direction exists and fits the category, but could be adapted to a competitor with minor changes.
- 2 — Mood board without behavior; the "idea" is an aesthetic.
- 0 — No concept; assembling sections.

**Hard fails:**

- The concept could belong to any competitor unchanged.
- The signature move is absent or is a generic effect.
- The direction depends on assets that do not exist and cannot be produced.

- One source dominates: a reviewer names it in the attribution test.

**Pre-build critique (required).** Before the build, score the chosen direction 1–5 on six axes. Any axis under 3 sends the direction back; `review.mjs` fails the gate.

| Axis | Scores 3 when | Scores 5 when |
|---|---|---|
| **Philosophy** | the mood is clear | the page takes a position someone could argue with |
| **Hierarchy** | the order emerges after a pause | a blurred thumbnail still shows what comes first |
| **Execution** | a few details are still open | the plan already clears the Floor and Reflex checks |
| **Specificity** | it suits the category | swapping the brand name would break it |
| **Restraint** | one ornament could still go | something good was cut to make room |
| **Variety** | three fingerprint dimensions differ from the scaffold | it shares nothing recognizable with any template or recent build |

Name the weakest axis and what you changed (`critique.weakest`). A perfect row must say what was removed to earn it. Do not manufacture a weakness to fill the field.

**Evidence:** three comps at the same viewport, `decision.md` with the matrix, rejected directions, `blend.md` with three lineages on three axes.

## 4. Gate 2 — Direction

**Persona: The Art Director.** Protects the world.

**Weight:** 15

**Question:** Does the visual world feel inevitable and alive?

**Criteria:**

- 5 — Ground, voice, light, and motion tell one story; every section belongs; one signature move; one accent discipline; the page is recognizable in a grayscale thumbnail.
- 3.5 — Coherent world, but one section or component falls out of it.
- 2 — A collection of nice sections from different sites.
- 0 — No world; default components and gradients.

**Hard fails:**

- The page reads as a template or a known site with the logo swapped.
- More than one competing signature move.
- A section visibly belongs to another design language.
- Divergence above 0.35 against the scaffold or any bundled template.

**Evidence:** `DESIGN.md`, `divergence.json`, world sheet, first viewport at 1440/768/390, type specimen, color-in-context sheet.

## 5. Gate 3 — Type and Color

**Persona: The Type Director.** Protects the voice and the light.

**Weight:** 12

**Question:** Is the type distinctive and the color narrative coherent?

**Criteria:**

- 5 — Display voice is specific; body is effortless; scale and measure are composed; palette has a story and roles; contrast passes in every state; dark/light each designed.
- 3.5 — Good type and color, with one weak role (e.g., captions too light, accent overused).
- 2 — Default pairing; gradient text; contrast failures; color used decoratively.
- 0 — Unreadable or incoherent.

**Hard fails:**

- Body contrast < 4.5:1.
- Gradient text on a headline.
- More than 3 families (or 2 + mono) with no editorial reason.
- Accent used more than 3 times above the fold without a system.
- Untested Portuguese/Spanish accents break the display face.

**Evidence:** `tokens.json`/`DESIGN.md`, contrast report, type specimen at 320/1440, color sheet.

## 6. Gate 4 — Composition

**Persona: The Layout Architect.** Protects attention.

**Weight:** 12

**Question:** Does the composition direct attention at every viewport?

**Criteria:**

- 5 — A clear spine; intentional density rhythm; one grid break at the signature moment; fold is a complete thought; 320 px recomposes rather than stacks; no overflow.
- 3.5 — Solid composition with one weak breakpoint or an ambiguous focal point.
- 2 — Uniform bands; everything centered; card grid as the only structure.
- 0 — Broken layout at a target viewport.

**Hard fails:**

- Horizontal scroll at 320 px.
- Primary action unreachable or hidden below a full-screen decoration.
- Content clipped at 200% zoom.
- Overlapping fixed elements that block interaction.

**Evidence:** screenshots at 390/768/1440/1920, fold and full page, 320 px check, zoom notes.

## 7. Gate 5 — Motion

**Persona: The Motion Director.** Protects time.

**Weight:** 12

**Question:** Is motion choreographed, purposeful, and performant?

**Criteria:**

- 5 — One entrance sequence, one scroll narrative, one interaction signature; character is consistent; reduced motion is designed; 60fps at 4× throttle; no hijack.
- 3.5 — Purposeful motion with one inconsistent primitive or a reduced-motion gap.
- 2 — Uniform fade-up everywhere; ambient effects with no hierarchy.
- 0 — Jank, scroll hijack, or inaccessible motion.

**Hard fails:**

- `prefers-reduced-motion` ignored.
- Scroll hijacking with no escape.
- Autoplay audio.
- Motion causes a P0 performance failure.
- Flashing above 3 Hz.

**Evidence:** `MOTION.md`, a short recording, reduced-motion screenshots, FPS notes.

## 8. Gate 6 — Engineering

**Persona: The Tech Lead.** Protects speed and resilience.

**Weight:** 10

**Question:** Is it fast, resilient, and maintainable?

**Criteria:**

- 5 — Budgets met; semantic HTML; no console errors; graceful degradation; no-JS content readable; sensible component boundaries; no dead code.
- 3.5 — Budgets close; one non-blocking error or a minor resilience gap.
- 2 — Over budget; fragile build; console noise.
- 0 — Broken in a target browser/device or unusable without JS when content requires it.

**Hard fails:**

- LCP > 4 s on mobile or CLS > 0.25.
- A console error that breaks a primary interaction.
- The page is blank without JS when content is static.
- A dependency with an incompatible license.

**Evidence:** `report.json` (perf), Lighthouse or RUM, console/network summary, build notes.

## 9. Gate 7 — Access

**Persona: The Access Lead.** Protects the excluded user.

**Weight:** 9

**Question:** Can everyone use it, including keyboard and reduced motion?

**Criteria:**

- 5 — Zero P0/P1 access issues; keyboard path complete; focus visible; semantics correct; forms helpful; media captioned; 200%/400% zoom; screen-reader spot check.
- 3.5 — Minor issues, all documented with fixes.
- 2 — Multiple barriers but the primary task is possible.
- 0 — Keyboard trap, unlabeled control, or unreadable body text.

**Hard fails:**

- Any P0 access barrier.
- Missing labels on form controls.
- Keyboard trap.
- Text over media failing contrast at a meaningful frame.
- No captions for meaningful speech.

**Usability heuristics (required).** Score Nielsen's ten heuristics 0–4 in `heuristics`, in this order: visibility of system status, match with the real world, user control and freedom, consistency and standards, error prevention, recognition over recall, flexibility and efficiency, aesthetic and minimalist design, error recovery, help and documentation. A heuristic that cannot apply (help on a one-page campaign) is `{"score": "n/a", "reason": "…"}`; the maximum shrinks with it. Under half the applicable maximum fails the gate. Most real interfaces land between 50% and 80%; a 4 means genuinely excellent.

**Persona walk.** Walk the primary task as two or three people who would fail differently (a keyboard-only user, a first-time visitor on a phone, a screen-reader user) and write what broke for each, by element.

**Evidence:** axe/visual audit JSON, keyboard notes, reduced-motion shot, contrast table, screen-reader notes, persona walk.

## 10. Gate 8 — Truth

**Persona: The Editor-in-Chief.** Protects the reader.

**Weight:** 8

**Question:** Is every word true and free of AI tells?

**Criteria:**

- 5 — Claims are sourced; copy has a specific voice; no slop patterns; no fake data; microcopy is human; the page sounds like a person with a point of view.
- 3.5 — True and clear, with a few generic phrases or one unsupported minor claim.
- 2 — Filler copy; vague superlatives; one fabricated proof.
- 0 — Material deception or a page of AI boilerplate.

**Hard fails:**

- Any fabricated claim, logo, metric, testimonial, or award.
- Lorem ipsum in a shipped page.
- A P0 slop pattern that defines the page (purple gradient hero, three-icon grid, etc.).
- Copy that misrepresents price, availability, or capability.

**Evidence:** `audit.json`, `copy-review.md`, source list for claims, final copy deck.

## 11. Gate 9 — Launch

**Persona: The Release Engineer.** Protects the launch.

**Weight:** 3

**Question:** Can it ship, be found, measured, and recovered?

**Criteria:**

- 5 — Metadata/OG correct; sitemap/robots; 404/500; analytics + consent; error monitoring; rollback; locale routing; redirects; DNS/TLS.
- 3.5 — Ready with one non-blocking gap.
- 2 — No analytics or no recovery plan.
- 0 — Broken deploy or missing critical metadata.

**Hard fails:**

- No working primary action in production.
- Exposed secrets or debug data.
- Missing consent where legally required.
- No way to roll back.

**Evidence:** launch checklist, OG preview, sitemap/robots, analytics plan, rollback notes.

## 12. The Tribunal

**Persona: The Partner.** Reads every gate, the evidence, and the original brief. Has veto power.

Before the Tribunal can finalize, an independent jury of 10–15 distinct specialists must review every gate and every Laws of UX principle as described in `29-jury-and-ux.md`. Every member must vote on every gate and every principle. The loop is time-boxed to ten minutes from `--jury-start`; each `--jury-round` scores the votes, and the decision is the best round inside the window (dissent in that round caps the verdict at conditional). The Tribunal then asks:

1. Does the work keep the promise of `BUREAU.md`?
2. Is the signature move actually memorable, or merely present?
3. Is any gate passing on charm rather than evidence?
4. Would we put our name on this in public?
5. What is the smallest fix that would raise the work one tier?

**Veto conditions:**

- The work is technically passing but conceptually generic.
- The evidence is thin, staged, or cherry-picked.
- A P1 is being averaged away.
- The work would embarrass the bureau in a public critique.

A veto must include: the reason, the smallest fix, and an owner. It cannot be "I don't like it" without a specific, actionable defect.

**Method.** `tribunal.json` declares `"method": "isolated"` (fresh context, design review before detector output) or `"degraded"`. A degraded Tribunal caps the verdict at PASS and the scorecard says so.

### The Delivery Gate

The Tribunal does not open until `.bureau/review/delivery.md` is clean. Create it with `node scripts/review.mjs --delivery-init`, then mark every line `[PASS]` or `[FAIL]`, with evidence after an em dash: a file, a screenshot, or a command and its result. "Looks fine" is not evidence.

| Block | Items | Binding |
|---|---|---|
| Floor | DG-F1–F8: no fabricated proof; every control clicked; contrast in every state; keyboard; reduced motion; no overflow 320–1920; hero fits 1280×800; content visible without JS | never `N/A`; one `FAIL` stops the release |
| Reflex | DG-R1–R3: every remaining tell has a page-specific waiver; attribution test; divergence ≤ 0.35 | `N/A` only with a reason |
| Liveliness | DG-L1–L3: dials declared and matched; one focal point and one accent per screen; an identity motif | the page is alive, not just clean |
| Finish | DG-C1–C3: browser surfaces themed; typographic finish; empty, loading and error states | answered |
| Process | DG-P1–P2: judged before measured; Tribunal in a fresh context | or declared degraded |

A `[PASS]` without evidence, an unchecked box, or a Floor `N/A` refuses the final.

## 13. Gate state machine

`review.mjs` enforces:

```
g0 must pass → g1 → g2 → g3 → g4 → g5 → g6 → g7 → g8 → g9 → final
```

- Each `--gate` call writes `.bureau/review/state.json`.
- A gate cannot open unless the previous gate passed.
- Source changes after a gate mark it **stale**; the final refuses stale gates unless the gate is re-run.
- Evidence paths are validated against the filesystem.
- Scores below 3.5 or any P0 issue fail the gate immediately.
- Gate 1 needs a complete `.bureau/research/survey.json` (`30-reference-survey.md`) and the six-axis `critique`; any axis under 3 fails it.
- Gate 7 needs the ten `heuristics`; under half the applicable maximum fails it.
- The final refuses a missing or unclean Delivery Gate, and a Tribunal without a declared method.

```bash
node scripts/review.mjs --status
node scripts/review.mjs --gate g2-direction --scores .bureau/review/g2.json
node scripts/review.mjs --delivery-init
node scripts/review.mjs --jury-start
node scripts/review.mjs --jury-round
node scripts/review.mjs --regate
node scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
```

## 14. Scores file schema

```json
{
  "gate": "g2-direction",
  "score": 4.5,
  "reviewer": "art-director",
  "notes": "The world holds; the pricing section slips into a different radius language.",
  "strengths": ["Type pairing", "Signature object", "Color discipline"],
  "issues": [
    {
      "id": "G2-01",
      "severity": "P1",
      "title": "Pricing cards use a 24px radius and generic shadow",
      "evidence": ".bureau/qa/screenshots/laptop-1440x900-full.png",
      "fix": "Use the 6px family and the line-based structure from the product section."
    }
  ],
  "evidence": [
    "DESIGN.md",
    ".bureau/qa/screenshots/laptop-1440x900-fold.png",
    ".bureau/evidence/type-specimen.png"
  ]
}
```

Rules:

- `score` is 0–5 in 0.5 steps.
- `issues[].severity` is `P0`, `P1`, or `P2`.
- `issues[].evidence` must be a real path.
- `evidence` must include the gate's required artifacts.
- `notes` must be specific enough for another reviewer to act on.
- Gate 1 adds `"critique": {"philosophy": 5, "hierarchy": 4, "execution": 4, "specificity": 5, "restraint": 4, "variety": 4, "weakest": "hierarchy: the index competed with the lede; moved it to the margin"}`.
- Gate 7 adds `"heuristics": [4, 4, 3, 4, 3, 4, {"score": "n/a", "reason": "single landing page"}, 4, 3, {"score": "n/a", "reason": "no help system"}]`.
- `tribunal.json`: `{"decision": "pass", "method": "isolated", "notes": "…", "reviewer": "The Partner"}`.

## 15. Scorecard

The script writes Markdown, JSON, and a styled HTML report:

```
BUREAU — REVIEW SCORECARD
Project: <name>              Mode: <mode>
Verdict: PASS (86.5/100)     Date: <ISO>

G0 Intake        4.5/5  × 5  =  4.5
G1 Concept       4.5/5  ×14  = 12.6
...
Tribunal: no veto

Blocking: none
Conditional: 2 P1 (named)
Evidence: .bureau/review/...
```

The HTML report is the artifact you attach to the client delivery.

## 16. Review anti-patterns

- Scoring from memory instead of screenshots.
- Running all gates in one pass and calling it a circuit.
- Averaging away a P0.
- Reviewing the design intent rather than the built page.
- Reusing evidence from a previous build.
- Letting the same person be creative director, art director, and Tribunal without a written challenge.
- Passing a gate because the deadline is close.
- Writing "looks great" as notes.
- Reading the detector report before writing the design review.
- Reviewing in the same thread that built the work and not declaring the run degraded.
- Waiving a Reflex tell with a reason that would fit any page.
- Treating zero findings as quality: a clean page with no world fails Gates 1 and 2.

The circuit is only as good as its willingness to say **fail**.
