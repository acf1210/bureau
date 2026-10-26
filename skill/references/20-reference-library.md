# 20 — Reference Library

References are evidence of what is possible, not assets to copy. The bureau uses them to **extract principles**, then builds something the reference could not contain.

## 1. Extraction protocol

For every reference, run five passes:

1. **First impression** — what did you feel in 3 seconds? Name it.
2. **Structure** — what is the first viewport's composition? Where is the spine? How many bands? What is the density rhythm?
3. **Craft** — type pairing, scale jump, palette roles, image treatment, spacing, radius, borders.
4. **Behavior** — one signature move, one scroll narrative, one micro-interaction. What is the timing?
5. **Transfer** — what **principle** transfers to your subject? What must **not** transfer (brand content, layout signature, copy, assets)?

Write the extraction in `.bureau/comps/references.md`:

```markdown
## <reference URL>
- Principle: <one sentence>
- Structural move: <...>
- Craft detail: <...>
- Behavior: <...>
- Do not copy: <...>
- Transfer to this project: <...>
```

Never open a reference and immediately code. That is how cosplay happens.

Galleries tell you what the current default looks like. They are not lineages. Principles come from documented work by named designers, blended three at a time: see `23-lineage-and-blend.md`. If you save a reference page locally, compare your build against it with `scripts/divergence.mjs`.

## 2. Galleries — landing and marketing

| Source | Use it for | What to extract |
|---|---|---|
| **land-book.com** | landing-page patterns | section sequencing, proof placement, CTA rhythm |
| **onepagelove.com** | one-page narrative | compression, scroll pacing |
| **saaslandingpage.com** | SaaS structure | pricing, feature hierarchy, objection handling |
| **designbookmark.com** | curated web design | composition and type |
| **recent.design** | daily design | current visual language (use critically) |
| **godly.website** | award-level sites | ambition, signature moves |
| **minimal.gallery** | minimalism | restraint, spacing, typographic confidence |
| **siteinspire.com** | editorial/agency | grid, voice, image direction |
| **httpster.net** | independent web | personality, anti-template energy |
| **vibrant.design** | UI and interactions | color, motion, component detail |
| **inspora.design** | daily inspiration | fresh composition ideas |
| **landdding.com** | landing pages | conversion structure |

## 3. Product and app UI

| Source | Use it for | What to extract |
|---|---|---|
| **mobbin.com** | real app flows | navigation, density, states, patterns |
| **refero.design** | real product UI | onboarding, settings, data views |
| **vibrant.design** | UI captures | component detail and motion |
| **60fps.design** | mobile animation | timing, easing, gesture feedback |
| **on.design** | design community | critique language, process |

## 4. Motion and interaction

| Source | Use it for | What to extract |
|---|---|---|
| **promptmotionsite.com** | motion prompts | choreography vocabulary |
| **motionin.design** | prompt-to-site motion | one-prompt compositions |
| **transitions.dev** | UI transitions | page/element transition patterns |
| **60fps.design** | mobile motion | 60fps timing and gesture physics |
| **reelfolio.io** | showreels | pacing, edit rhythm, title cards |
| **bencho.dev** | interactive components | hover/press/scroll behaviors |
| **obsidianui.dev** | animated React components | implementation patterns (not visual copying) |

## 5. Components, icons, and assets

| Source | Use it for | What to extract |
|---|---|---|
| **Font Awesome** (`github.com/FortAwesome/Font-Awesome`) | fallback icons | universal metaphors; check license |
| **iconly.design** | icon direction | stroke, optical size, set consistency |
| **backgrounds.supply** | backgrounds | material, light, texture |
| **footer.design** | footer patterns | closing argument, link hierarchy |
| **wonderlist.design** | complete Figma designs | system thinking, not layouts |
| **modulify.ai** | modular sections | composition blocks |
| **opendesign.dev** | open-source design tools | tooling, not visuals |

## 6. Typography and color

| Source | Use it for | What to extract |
|---|---|---|
| **fontinlogo.com** | type in brands | display voice, wordmark behavior |
| **typewolf** (typewolf.com) | pairings | font combinations and use cases |
| **Google Fonts** | open fonts | licensing, variable axes, language coverage |
| **april-zhu.com/colorfigures** | object color systems | material palettes, see-through objects |
| **Pantone Color Institute** | color narrative | COY names, cultural anchoring (see `05-color-pantone.md`) |
| **Coolors / Huemint** | palette exploration | starting points only; build in OKLCH |

## 7. Prompt and skill references

| Source | Use it for | What to extract |
|---|---|---|
| **pbakaus/impeccable** | design detection, product truth | deterministic rules, artifact discipline, critique isolation |
| **Nutlope/hallmark** | anti-generated web pages | binding tiers, waivers on the record, render-tier budgets, fresh-context review |
| **miqdadbadjuber/anti-slop** | slop rulebook | purpose test, evidence-backed delivery gate, liveliness dials |
| **cathrynlavery/diagram-design** | publishable diagrams | rules as checkers with fixtures, accessible SVG contract, "would a sentence do?" |
| **vibeprompts.dev** | UI prompts (≈286, as listed by the source) | prompt structure; never paste outputs |
| **skill-issue.in** | agent skills for design/frontend | skill anatomy, progressive disclosure |
| **isreadyforlaunch.com** | launch readiness | checklist thinking |
| **daoho.dev** | editorial craft | restraint, typography, interaction |
| **Colorfigures** | interactive objects | cutaway/assembly as a signature move |

## 8. October 2026 radar

A working shortlist for the current season. Verify each link; the web moves.

1. **recent.design** — daily, high-signal.
2. **land-book.com** — landing structure.
3. **vibrant.design** — UI + interaction captures.
4. **mobbin.com** — real app flows.
5. **refero.design** — product UI patterns.
6. **minimal.gallery** — restraint.
7. **godly.website** — ambition.
8. **60fps.design** — motion timing.
9. **backgrounds.supply** — material grounds.
10. **footer.design** — closings.

Use the radar to **calibrate**, not to assemble. If three references share a skeleton, that skeleton is the new default — avoid it.

## 9. Anti-references

Do not browse these for "inspiration" unless you are studying a specific failure:

- Dribbble shots with no product logic when the goal is to validate a flow; a shot can still inform visual research if its limits are recorded.
- "Top 10 AI SaaS" listicles.
- Template marketplaces sorted by popularity.
- Pinterest mood boards with no source.
- Competitor sites (study them for parity, not for identity).
- Any gallery filtered by "trending gradient".

They flatten taste toward the average.

## 10. Ethics and law

- Do not copy a living designer's portfolio composition, copy, or assets.
- Do not use a reference's images without a license.
- Do not clone a competitor's site.
- Credit direct inspiration in the case study if it is substantial.
- Extract principles; rebuild the execution.
- Check font, icon, image, and video licenses before shipping.

The test: if the original designer saw your work, would they recognize a principle or a theft?

## 11. Reference log

Keep a log per project:

```markdown
| Date | Source | Principle extracted | Applied where | Status |
|---|---|---|---|---|
| 2026-10-26 | land-book.com/x | proof above the fold | hero | applied |
| 2026-10-26 | godly.website/y | type scale contrast | section 2 | rejected |
```

This prevents endless browsing and makes the influence auditable.
