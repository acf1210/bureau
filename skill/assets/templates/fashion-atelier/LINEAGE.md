# Lineage — Linha (`fashion-atelier`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Alexey Brodovitch, art director of *Harper's Bazaar* (1934–58) | Scale, crop and white space as rhythm | Composition | A giant name cropped by the page edge; one column of words | His spreads |
| Counter 30% | Anni Albers, *On Weaving* (1965) | The thread is the structure | Grid | A single warp line down the page; fittings cross it like weft | Her weavings |
| Accent 15% | Bradbury Thompson, *Westvaco Inspirations* (1939–62) | Overprinted process colour | Colour | Three cloths as multiplied inks | His spreads |

- **Tension:** Brodovitch's drama against Albers's patience.
- **Subject-only ingredient:** your own chest, waist, back and shoulder, in centimetres.
- **Signature move:** the front bodice block is redrawn from your measurements on a 1 cm cutting mat.
- **Dials:** ENERGY 2 / RHYTHM 3 / MOTION 1. Theatrical scale, alternating rows, still.
- **Technological proof:** a parametric SVG pattern with ease and dart computed from the inputs; the mat's grid is scaled to true centimetres.

## Mobile composition

The cropped name is dropped so it never sits behind text; the warp line moves to the left edge; measurements use 48 px steppers.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Italiana + Jost |
| Palette | calico `#ECE7DE`, thread `#18171A`, chalk `#34507A` |
| Easing | `cubic-bezier(.6,.04,.28,1)` |
| Footer | label, atelier, write |
| Favicon | a tailor's square and a chalk dot |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The atelier, cloths and prices: fictional.
3. The block is simplified; a real cutter's draft has more steps.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
