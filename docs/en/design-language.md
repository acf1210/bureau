# Visual language

For a practical vocabulary of visual styles and their trade-offs, use `skill/references/32-visual-style-vocabulary.md`. Select a lens from the brief and test it with real content; a style label does not establish usability or conversion.

For each concept, record UI, UX and innovation decisions and an evidence plan using `skill/references/16-review-circuit.md`. These are BUREAU interpretations of the [CSS Design Awards definitions](https://www.cssdesignawards.com/sites/guidance/43364/), not official subcriteria or an award prediction.

BUREAU has no fixed style. It has a **method** for building a style that belongs to the subject.

## 1. Pantone as an anchor, not a palette

Pantone is a standardized color language for print, textiles, and brand. It is not a CSS color space.

- **PMS / Solid** — print inks.
- **TCX / TPG** — textiles.
- **Pantone Connect** — licensed libraries.
- **Hex/sRGB** — screen approximations.

Use Pantone to **name and anchor** the palette in the brief; implement in OKLCH and verify contrast. Never claim a screen color *is* Pantone. For print, use licensed libraries and a physical proof.

### Color of the Year — reference

| Year | Code | Name | Approx. hex | Character |
|---|---|---|---|---|
| 2026 | 11-4201 | Cloud Dancer | `#F0EEE9` | airy off-white, quiet |
| 2025 | 17-1230 | Mocha Mousse | `#A47864` | edible brown, comfort |
| 2024 | 13-1023 | Peach Fuzz | `#FFBE98` | tactile peach |
| 2023 | 18-1750 | Viva Magenta | `#BE3455` | assertive carmine |
| 2022 | 17-3938 | Very Peri | `#6667AB` | optimistic periwinkle |
| 2021 | 17-5104 | Ultimate Gray | `#939597` | stable gray |
| 2021 | 13-0647 | Illuminating | `#F5DF4D` | solar yellow |
| 2020 | 19-4052 | Classic Blue | `#0F4C81` | dependable blue |
| 2019 | 16-1546 | Living Coral | `#FF6F61` | social coral |
| 2018 | 18-3838 | Ultra Violet | `#5F4B8B` | cosmic violet |
| 2017 | 15-0343 | Greenery | `#88B04B` | botanical green |
| 2016 | 13-1520 / 15-3919 | Rose Quartz / Serenity | `#F7CAC9` / `#92A8D1` | soft calm |

Full 2000–2026 table in `skill/references/05-color-pantone.md`. Values are BUREAU approximations, not official conversions.

### 2026 direction: Cloud Dancer as ground

```css
:root{
  --ground: oklch(95.2% 0.008 85);
  --surface: oklch(97.5% 0.006 85);
  --ink: oklch(18% 0.012 70);
  --muted: oklch(52% 0.014 70);
  --line: oklch(30% 0.01 70 / .14);
  --accent: oklch(56% 0.19 32);      /* terracotta */
  --accent-ink: oklch(97% 0.01 80);
  --signal: oklch(78% 0.16 92);
}
```

Cloud Dancer is not "white". It is material: paper, plaster, linen, diffused light. Pair it with one hard dark section and one saturated accent to avoid monotony.

---

## 2. Color as a system

- **60/30/10** with intent: ground, ink/surfaces, accent/signal.
- **5–7 semantic roles**, not 30 loose hex values.
- **OKLCH** for perceptually even scales.
- **Contrast** AA in every state.
- **Dark mode** recomputed, not inverted.
- **Gradient** only when it represents light, heat, depth, or material. Never on text.
- **Data** with a colorblind-safe palette and labels; color never alone.

Starting palettes:

| Name | Ground | Ink | Accent | Use |
|---|---|---|---|---|
| Quiet Precision | `#F0EEE9` | `#161616` | `#C8402A` | editorial, culture |
| Night Archive | `#0C0D0C` | `#EDE7DA` | `#B7791F` | archive, cinema |
| Cold Signal | `#E7E9E6` | `#1B2226` | `#C6F04A` | engineering, data |
| Warm Instrument | `#E9DFD0` | `#2A1F1A` | `#B4553A` | product, craft |
| Botanical Modern | `#10251C` | `#E8E5D8` | `#89A85C` | science, climate |
| Chrome Bloom | `#111214` | `#D9D9D6` | `#B98BC4` | fashion, music |

---

## 3. Typography

- Max 2 families + 1 mono.
- Display with voice; body with legibility.
- Fluid scale with `clamp`, tested 320–2560.
- Display: leading 0.9–0.98, tracking -0.02 to -0.04em.
- Body: 55–75ch, leading 1.55–1.7.
- Tabular figures in data.
- PT/ES accents tested: ã, ç, é, ñ, ü.
- Self-hosted, subset, `font-display: swap`.

Pairings that work:

1. Bodoni Moda + Archivo + JetBrains Mono
2. Instrument Serif + Libre Franklin + IBM Plex Mono
3. Fraunces + Public Sans + Space Mono
4. Newsreader + Archivo + IBM Plex Mono
5. Syne + Archivo + Space Mono
6. Cormorant Garamond + Work Sans + JetBrains Mono

Avoid Inter + Space Grotesk as the entire identity.

---

## 4. Motion

One character per project:

| Character | Time | Easing | Use |
|---|---|---|---|
| Precise | 120–220 ms | `.2 .7 .2 1` | product, data |
| Viscous | 600–1200 ms | `.22 1 .36 1` | editorial, luxury |
| Mechanical | stepped/linear | linear | instrument, terminal |
| Organic | irregular | noise | nature, health |
| Cinematic | 800–1600 ms | long in-out | experience |

Rules:

- one entrance sequence;
- one scroll narrative;
- one interaction signature;
- `transform` and `opacity`;
- reduced motion designed;
- 60 fps at 4× CPU throttle;
- no scroll hijack.

---

## 5. Technological proof

Choose **one** per project:

| Proof | When | Cost |
|---|---|---|
| Scroll-driven choreography | narrative, product | low |
| WebGL/shader | atmosphere, generative, spatial | medium–high |
| Real 3D | product, configurator | high |
| Video as material | fashion, place, film | medium |
| Generative identity | variable brand | medium |
| Live data | fintech, climate, sport | medium |
| View Transitions | multi-page flow | low |
| Interactive instrument | audio, config | medium |

The proof serves the argument. A shader on a bakery site is not ambition; it is confusion.

---

## 6. Signature

A signature move is the one thing someone would describe to a friend. It must be:

- legible without explanation;
- ownable by the brand;
- repeatable at other viewports;
- performant;
- accessible.

Types of move (never copy literally):

- a product that assembles on scroll with labeled parts;
- a typographic hero that behaves like a printing press;
- live data as a sculpture;
- video that becomes UI at the moment the story needs it;
- navigation as a map of the argument;
- a color system that shifts with the time of day, within a designed range.

---

## 7. Reference library

Calibrate, do not assemble:

- **land-book.com** — landing structure;
- **minimal.gallery** — restraint;
- **godly.website** — ambition;
- **mobbin.com** — real app flows;
- **refero.design** — product patterns;
- **60fps.design** — motion timing;
- **vibrant.design** — UI and interaction;
- **recent.design** — daily radar;
- **backgrounds.supply** — material;
- **footer.design** — closing;
- **promptmotionsite.com** — motion vocabulary;
- **april-zhu.com/colorfigures** — isometric objects with cutaways;
- **Font Awesome** — icon fallback;
- **Impeccable** — detection and artifact discipline.

Extraction protocol: impression → structure → craft → behavior → transferable principle. Never open a reference and code immediately.

Full list and ethics in `skill/references/20-reference-library.md`.

---

## 8. Lineage and blend

BUREAU never copies a single source. Every direction is a **blend** of three documented lineages, each owning a different axis, pushed through the subject until no single source can be named.

| Designer | Documented work | Principle | Axis |
|---|---|---|---|
| Josef Müller-Brockmann | *Grid Systems in Graphic Design* (1981) | the modular grid as objective order | grid |
| Jan Tschichold | *Die neue Typographie* (1928) | asymmetric, functional hierarchy | composition |
| Massimo Vignelli | NYC subway diagram (1972) | few typefaces, the diagram over the picture | type, navigation |
| Otl Aicher | Munich 1972 | restricted palette, pictograms on one grid | colour, icons |
| Edward Tufte | *The Visual Display of Quantitative Information* (1983) | data-ink, small multiples, direct labels | data |
| Herb Lubalin | *Avant Garde* (1968–71) | letters set tight until words become images | voice |
| Saul Bass | *Vertigo* (1958), *Anatomy of a Murder* (1959) | motion that cuts instead of fading | motion |
| Muriel Cooper | *Information Landscapes* (1994) | type in space; depth as navigation | depth |
| László Moholy-Nagy | *Light Prop for an Electric Stage* (1930) | light is the medium | light |
| Charles and Ray Eames | *Powers of Ten* (1977) | one move through scale by a constant factor | scroll |

Recipe: **dominant** 50–60% (structure) × **counter** 25–35% (expression, pulling against it) × **accent** 10–20% (one behaviour), plus one ingredient only the subject has. Write it in `.bureau/comps/blend.md` (Gate 1).

The thirteen templates are worked examples, each with a `LINEAGE.md`. They count as sources too:

| Template | Dominant | Counter | Accent |
|---|---|---|---|
| `kinetic-editorial` | Tschichold | Lubalin | Bass |
| `product-surface` | Tufte | Vignelli | Aicher |
| `immersive-experience` | Moholy-Nagy | Cooper | Eames |
| `legal-practice` | Sutnar | Rand | Ruder |
| `architecture-studio` | Ando | Mies | Scarpa |
| `restaurant-table` | Barragán | Wyman | J. Albers |
| `private-bank` | Müller-Brockmann | Crouwel | Tufte |
| `clinic-care` | Hara | Kare | Tanaka |
| `developer-api` | Gerstner | Weingart | Greiman |
| `fashion-atelier` | Brodovitch | A. Albers | B. Thompson |
| `record-label` | Reid Miles | Saville | Brody |
| `museum-archive` | Bo Bardi | Lustig | Munari |
| `hardware-store` | Rams | Sottsass | Castiglioni |

A project scaffolded from a template starts as a copy. Before Gate 2 it must be at or below 0.35 against every template:

```bash
node skill/scripts/divergence.mjs index.html --templates --out .bureau/evidence/divergence.json
```

Canon, rules and originality tests in `skill/references/23-lineage-and-blend.md`.

---

## 9. Refinement passes

Between the first build and QA, seven passes from structure to detail. One at a time; re-shoot after each.

| Pass | Looks at |
|---|---|
| P1 | structure: spine, density, fold, one grid break |
| P2 | type: optical size, tracking per size, glyphs at display size, rag |
| P3 | colour and light: roles, accent count, every state |
| P4 | space: one scale, proximity, targets |
| P5 | motion: one character, one entrance, designed reduced mode |
| P6 | states and edges: focus, errors, empty, media controls |
| P7 | distinctness: lineage tests and divergence |

Thresholds and evidence in `skill/references/24-refinement-passes.md`.
