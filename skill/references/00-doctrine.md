# 00 — Doctrine

The bureau's operating system. Read before any creative work.

**Realism first.** Photography, film and physical material are the default visual language. Every page starts from the question "what would this look like if it existed?", not "what can I draw in CSS?". A vector illustration is never the fallback for a missing photograph. The full engine is `39-realism-engine.md`; film is `40-cinematic-video.md`; inspection is `41-media-validation.md`.

Four consequences:

- **The subject is photographed or filmed.** If it cannot be, the page is typographic and material, not illustrated.
- **Light is physical.** One direction, one temperature, one plausible source per scene.
- **Imperfection is evidence.** Wear, grain, asymmetry and dust are what separate a photograph from a render.
- **SVG has a job.** Logos, icons, diagrams, maps and data graphics, never a decorative hero.

## 1. What we are actually making

A website is not a container for information. It is a **designed argument**: a sequence of impressions that makes a specific person feel, understand, and act. Every pixel either strengthens that argument or dilutes it.

Three questions precede every decision:

1. **What should the visitor feel in the first 800 ms?** (awe, calm, desire, trust, curiosity, unease)
2. **What must they understand by the end of the first viewport?**
3. **What is the one action or realization the page exists for?**

If those answers are vague, the design will be vague, no matter how good the CSS is.

## 2. Taste is a structure, not a mood

Taste is the ability to make coherent choices under constraint. It is built from:

- **Reference literacy** — knowing why a thing works, not just that it looks good.
- **Material honesty** — a digital surface should exploit what screens do well (light, motion, precision, real-time data), and show real material when it shows material at all. A blurred orb is not light; a gradient is not a photograph.
- **Restraint under pressure** — the confidence to remove the second-best idea.
- **Specificity** — the refusal of generic nouns, generic images, generic layouts.
- **Repair** — the willingness to rebuild when the concept is wrong.

The opposite of taste is not ugliness. It is **indifference**: defaults accepted without a reason.

## 3. The four axes of a visual world

Every direction is defined by four choices. Make them explicit and write them down.

| Axis | Question | Examples |
|---|---|---|
| **Ground** | What does the page sit on? | bone paper, black glass, raw concrete, deep forest, CRT phosphor |
| **Voice** | What does the type sound like? | whispered editorial serif, shouted condensed grotesk, technical mono, hand-set display |
| **Light** | How is the surface lit? | hard studio key, soft overcast, neon rim, no light (flat ink) |
| **Motion** | How does the world behave? | precise and fast, viscous and slow, mechanical, organic, none until touched |

A world is coherent when these four axes tell the same story. A "luxury" page with a playful bounce easing is incoherent. A "technical" page with a soft pastel gradient is incoherent.

## 4. The Signature Move

A Signature Move is the one thing a visitor will describe to a friend. It must be:

- **Legible** — understood without explanation.
- **Ownable** — tied to the brand's subject, not a generic effect.
- **Repeatable** — works on the second visit and at other viewports.
- **Performant** — does not cost the page its speed.
- **Accessible** — has a reduced-motion and no-JS state.

Examples of the *kind* of move (never copy literally):

- A product that assembles itself as you scroll, with each part labeled in the brand's voice.
- A typographic hero that behaves like a printing press: lines lock, ink bleeds, registration marks align.
- A live data sculpture where the brand's core metric becomes the composition.
- A video portrait that transitions into the product UI at the exact moment the story needs it.
- A navigation that is a miniature map of the site's argument, not a list of pages.
- A color system that shifts with the time of day, but only within a designed range.

If the move could be dropped onto any other site unchanged, it is not a signature. It is decoration.

## 5. The Technological Proof

"Technological" does not mean "more libraries". It means the experience could only exist on the web, in this browser, now. It is optional: many excellent pages need no shader, and a photograph is often the stronger proof. When the subject does not need a technology, the photography or the film is the proof.

If a technological proof is chosen, it must be the one the subject needs:

| Proof | When it is right | Cost |
|---|---|---|
| **Scroll-driven choreography** (CSS `animation-timeline` + IntersectionObserver fallback) | Narrative pages, product stories | Low |
| **Photographic sequence** (art-directed stills, crops, reveals) | Any subject that exists in the world | Low–medium |
| **WebGL/shader atmosphere** | Immersive, generative, spatial brands | Medium–high |
| **Real-time 3D** (Three.js/R3F) | Products with form, configurators, spatial data | High |
| **Video as material** | Fashion, travel, motion brands, film | Medium |
| **Generative identity** (canvas/SVG, seeded) | Brands that change per visitor/session | Medium |
| **Live data** | Fintech, climate, sports, observability | Medium |
| **View Transitions / native app-like flow** | Multi-page product surfaces | Low |
| **Physical computing / device APIs** | Installations, experimental campaigns | Variable |

The proof must serve the argument. A shader on a bakery site is not ambitious; it is confused. A photograph of the bread, lit like the room it is sold in, is the proof.

## 6. The ambition floor

Every deliverable must include:

1. A written concept and a named signature move.
2. At least one proof chosen for the subject: photographic, cinematic or technological. A technology is not required.
3. A designed first viewport that is not a template.
4. A motion grammar with reduced-motion behavior.
5. A real content pass (no lorem ipsum, no fake credibility).
6. Evidence: screenshots at three viewports, an audit report, a media inspection when the page carries media, and a review verdict.

"Simple" is allowed only as a deliberate, high-precision restraint (see `minimal.gallery` for the difference between minimal and empty). "Default" is never allowed.

## 7. The hierarchy of attention

At any moment the eye should have one primary, one secondary, and one tertiary target. If everything is loud, nothing is.

Practical rules:

- One element per viewport may use the accent color at full strength.
- One element per viewport may move on its own (ambient motion).
- One type size may be extreme; the rest step down decisively.
- Whitespace is a material: budget it like ink.
- Borders, shadows, and textures are seasoning, not structure.

## 8. Composition heuristics

- **Asymmetry with tension**, not random offset. A 7/5 split reads as intentional; 51/49 reads as a mistake.
- **Optical alignment** beats mathematical alignment for type.
- **One crop, one scale, one focal point** per image.
- **Let a line cross the grid** at least once; perfect grids feel inert.
- **Break the rhythm once**, at the moment that matters.
- **Design the fold** as a complete thought, not a cut-off.
- **Design the end** — the footer is a closing argument, not a dump.

## 9. Critique language

Use precise language. Replace vague praise and vague criticism.

| Instead of | Say |
|---|---|
| "It looks premium" | "The 88 px display serif against 13 px mono labels creates a clear editorial hierarchy." |
| "It feels flat" | "The middle section has no focal point; three equal-weight cards compete." |
| "Make it pop" | "Increase the contrast between the hero statement and the supporting copy; the accent is currently used five times above the fold." |
| "It's too busy" | "Two ambient motions and a grain layer compete with the product; keep the scroll-linked reveal and remove the rest." |
| "It's not modern" | "The type pairing and card radius read as a 2021 SaaS template; the concept needs a different world." |

Critique the **decision**, not the person. Always propose the smallest fix that resolves the issue.

## 10. The three-second test

Render the first viewport at 1440×900. Show it for three seconds. Then hide it and ask:

1. What is being offered?
2. Who is it for?
3. What is the one thing I remember?
4. Would I trust this company with money/time/attention?

If any answer is "I don't know", the first viewport is not finished. This test matters more than any checklist.

## 11. Ethics

- Do not fabricate social proof.
- Do not use dark patterns: fake urgency, hidden costs, confirmshaming, roach motel.
- Do not optimize for engagement at the cost of the user's goal.
- Do not use generated people to imply real customers.
- Do not ship inaccessible motion because it "looks better".
- Credit references. Do not clone a living designer's portfolio composition and call it inspiration.

The bureau's reputation is built on work that survives scrutiny.
