# 16 — The Review Circuit

The circuit exists to stop the bureau from shipping work it has talked itself into liking. It is adversarial by design: ten independent gates, then a Tribunal.

**Gate Zero + Nine Gates + Tribunal.** Weighted 100. Any hard failure vetoes the release, regardless of score.

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

**Evidence:** three comps at the same viewport, `decision.md` with the matrix, rejected directions.

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

**Evidence:** `DESIGN.md`, world sheet, first viewport at 1440/768/390, type specimen, color-in-context sheet.

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

**Evidence:** axe/visual audit JSON, keyboard notes, reduced-motion shot, contrast table, screen-reader notes.

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

The Tribunal does not re-score. It asks:

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

```bash
node scripts/review.mjs --status
node scripts/review.mjs --gate g2-direction --scores .bureau/review/g2.json
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

The circuit is only as good as its willingness to say **fail**.
