# The review circuit

Finalization also requires the 10–15-member independent jury and complete Laws of UX review described in `skill/references/29-jury-and-ux.md`. All members vote on all gates and principles. The jury loop runs at most 10 minutes from `--jury-start`; each `--jury-round` scores the votes and the decision is the best round recorded in that time. Dissent in the best round caps the verdict at conditional. If independent reviewers are unavailable, the verdict remains pending.

Ten independent gates and a Tribunal. The goal is not a pretty score; it is to stop the bureau from approving work it has fallen for.

![Review circuit](../assets/diagrams/circuit.svg)

## How scoring works

Each gate scores **0–5** in 0.5 steps. Weight converts:

```
gate points = (score / 5) × weight
total       = sum of points
```

| Verdict | Total | Meaning |
|---|---:|---|
| **Award Track** | ≥ 90 | ready for a serious jury |
| **Pass** | 82–89 | ship |
| **Conditional** | 72–81 | ship with named P1s and a date |
| **Fail** | < 72 | do not ship |

## Hard failures

- Any gate below **3.5/5**.
- Any unresolved **P0**.
- Missing required evidence.
- Any fabricated claim, logo, metric, testimonial, or award.
- A gate reviewed against changed code (hash mismatch).
- Tribunal veto.

A 95 average with one accessibility P0 is a **Fail**. That is the point.

---

## Three honesty rules

1. **Judge before you measure.** Write the design review before reading the detector output.
2. **The builder is the weakest reviewer.** The Tribunal runs in a fresh context, or the run is declared `degraded` and cannot reach Award Track.
3. **Checked rules hold; prose rules drift.** Every mechanical rule has a failing and a passing fixture.

## The gates

| Gate | Persona | Weight | Question |
|---|---|---:|---|
| **G0 Intake** | The Producer | 5 | Is the brief true, bounded, and evidenced? |
| **G1 Concept** | The Creative Director | 14 | Is there an idea only this brand could own? |
| **G2 Direction** | The Art Director | 15 | Does the visual world feel inevitable and alive? |
| **G3 Type & Color** | The Type Director | 12 | Is the type distinctive and the color narrative coherent? |
| **G4 Composition** | The Layout Architect | 12 | Does composition direct attention at every viewport? |
| **G5 Motion** | The Motion Director | 12 | Is motion choreographed, purposeful, and performant? |
| **G6 Engineering** | The Tech Lead | 10 | Is it fast, resilient, and maintainable? |
| **G7 Access** | The Access Lead | 9 | Can everyone use it, including keyboard and reduced motion? |
| **G8 Truth** | The Editor-in-Chief | 8 | Is every word true and free of AI tells? |
| **G9 Launch** | The Release Engineer | 3 | Can it ship, be found, measured, and recovered? |

### G0 — Intake

**Criteria:** audience, offer, sourced proof, non-goals, metric, constraints, honest inventory.

**Hard fails:** invented proof; vague audience; impossible scope with no recorded trade-off.

**Evidence:** `BUREAU.md`, `.bureau/config.json`.

### G1 — Concept

**Criteria:** three genuinely distinct directions; the chosen one is ownable, legible, generative, and buildable; signature move named and testable.

**Hard fails:** the idea could serve any competitor; no signature; depends on assets that do not exist.

**Evidence:** three comps at the same viewport + `decision.md` + `blend.md` (three lineages on three axes). Hard fail if a reviewer names a single source.

**Pre-build critique:** philosophy, hierarchy, execution, specificity, restraint, variety, 1–5 each, plus the weakest axis and the fix. Any axis under 3 fails G1.

### G2 — Direction

**Criteria:** ground, voice, light, and motion tell one story; every section belongs; one signature; accent discipline; recognizable in a grayscale thumbnail.

**Hard fails:** template with the logo swapped; two competing signatures; a section from another world.

**Evidence:** `DESIGN.md`, type specimen, color sheet, 1440/768/390 viewports, `divergence.json`. Hard fail above 0.35 against the scaffold or any template.

### G3 — Type & Color

**Criteria:** display with voice; comfortable body; composed scale and measure; palette with roles; contrast in every state; dark/light designed.

**Hard fails:** body < 4.5:1; gradient text; > 3 families without reason; accent > 3 times above the fold; PT/ES accents break the display face.

**Evidence:** tokens, contrast report, specimen, color sheet.

### G4 — Composition

**Criteria:** a clear spine; density rhythm; one grid break; complete fold; 320 px recomposes; no overflow.

**Hard fails:** horizontal scroll at 320; unreachable CTA; content clipped at 200%; fixed elements blocking interaction.

**Evidence:** 390/768/1440/1920 screenshots + full page + zoom notes.

### G5 — Motion

**Criteria:** one entrance, one scroll narrative, one interaction signature; consistent character; reduced motion designed; 60 fps; no scroll hijack.

**Hard fails:** reduced motion ignored; scroll hijack; autoplay audio; P0 performance; flashing > 3 Hz.

**Evidence:** `MOTION.md`, short recording, reduced screenshot, FPS notes.

### G6 — Engineering

**Criteria:** budgets met; semantic HTML; clean console; graceful degradation; static content readable without JS; no dead code.

**Hard fails:** LCP > 4 s or CLS > 0.25; an error breaks a primary interaction; blank without JS; incompatible license.

**Evidence:** `report.json`, Lighthouse/RUM, console, build notes.

### G7 — Access

**Criteria:** zero P0/P1; complete keyboard path; visible focus; semantics; helpful forms; captioned media; 200/400% zoom; screen-reader test.

**Hard fails:** any P0 barrier; missing labels; keyboard trap; contrast failure over media; no captions for speech.

**Evidence:** axe/visual audit, keyboard notes, reduced shot, contrast table, screen-reader notes.

**Heuristics:** Nielsen's ten, 0–4 each, `n/a` with a reason. Under half the applicable maximum fails G7. Add a persona walk: what broke, for whom, on which element.

### G8 — Truth

**Criteria:** sourced claims; specific voice; zero P0 patterns; zero fake data; human microcopy; the page sounds like a person with a point of view.

**Hard fails:** any fabrication; lorem ipsum; a P0 pattern defining the page; copy that misrepresents price, availability, or capability.

**Evidence:** `audit.json`, `copy-review.md`, source list, final deck.

### G9 — Launch

**Criteria:** metadata/OG; sitemap/robots; 404/500; analytics + consent; monitoring; rollback; locale routing; redirects; DNS/TLS.

**Hard fails:** broken primary action; exposed secret; missing consent; no rollback.

**Evidence:** launch checklist, OG preview, sitemap, analytics plan, rollback notes.

---

## Required evidence

`review.mjs` verifies real paths. Example score:

```json
{
  "gate": "g2-direction",
  "score": 4.5,
  "reviewer": "art-director",
  "notes": "The world holds; the pricing section slips into another radius language.",
  "strengths": ["Type", "Signature object", "Color discipline"],
  "issues": [
    {
      "id": "G2-01",
      "severity": "P1",
      "title": "Pricing cards use a 24px radius and a generic shadow",
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

The script refuses:

- out-of-order gates;
- notes under 12 characters;
- invalid severity;
- an issue without `fix`;
- an issue whose evidence does not exist;
- missing required evidence;
- a score outside 0–5.

---

## State and staleness

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node skill/scripts/review.mjs --delivery-init
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

Each gate stores a source/docs hash. If the code changes, the gate becomes `STALE` and the Tribunal fails. To resume: re-run that gate and every later one.

State lives in `.bureau/review/state.json`. The scorecard is written as `.md`, `.json`, and `.html`.

---

## Delivery Gate

`node skill/scripts/review.mjs --delivery-init` writes `.bureau/review/delivery.md`. Every line is `[PASS]` or `[FAIL]` with evidence after an em dash.

| Block | Items |
|---|---|
| Floor | DG-F1–F8: proof, controls, contrast, keyboard, reduced motion, overflow, fold at 1280×800, content without JS |
| Reflex | DG-R1–R3: waivers, attribution test, divergence ≤ 0.35 |
| Liveliness | DG-L1–L3: dials, focal point and accent, identity motif |
| Finish | DG-C1–C3: browser surfaces, typographic finish, states |
| Process | DG-P1–P2: judged before measured, fresh-context Tribunal |

An unchecked line, a `[PASS]` without evidence, or a Floor `N/A` refuses the final.

## The Tribunal

The Tribunal reads every gate, the evidence, and the brief. It does not rewrite scores. It asks:

1. Does the work keep the promise of `BUREAU.md`?
2. Is the signature memorable or merely present?
3. Is any gate passing on charm rather than evidence?
4. Would we sign this in public?
5. What is the smallest fix that raises it one tier?

**Veto:** technically passing but generic; staged evidence; a P1 averaged away; public embarrassment.

A veto requires a reason, the smallest fix, and an owner. "I don't like it" is not a veto.

```json
{
  "decision": "conditional",
  "notes": "The work keeps the brief, but the signature is still an effect, not proof of the product.",
  "fix": "Turn the scroll scene into a demonstration of the real mechanism; keep the rest.",
  "reviewer": "The Partner"
}
```

---

**Method:** `tribunal.json` declares `"method": "isolated"` or `"degraded"`. Degraded caps the verdict at PASS.

## Anti-gaming

- Do not review from memory.
- Do not run all gates in one pass and call it a circuit.
- Do not reuse evidence from another build.
- Do not let the same person be creative director and Tribunal without a written challenge.
- Do not pass because the deadline arrived.
- Do not write "looks great" as notes.

The circuit is only worth anything if it can say **fail**.
