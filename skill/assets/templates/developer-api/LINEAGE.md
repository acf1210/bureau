# Lineage — tessera (`developer-api`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Karl Gerstner, *Designing Programmes* (1964) | Design the rules, not one solution | System | The matching rules are shown as a programme; each result's colour comes from a formula | His programme diagrams |
| Counter 30% | Wolfgang Weingart, teaching at the Basel School of Design (from 1968) | Layered, broken type | Voice | Outlined coordinates layered behind an indented headline | His posters |
| Accent 15% | April Greiman, *Design Quarterly* #133 (1986) | Hybrid digital surfaces | Material | A light console that mixes code, a swatch and measured time | Her collage |

- **Tension:** Gerstner's order against Weingart's disorder.
- **Subject-only ingredient:** addresses typed the way people type them: no accents, one letter wrong.
- **Signature move:** a playground that really matches typos on a ten-city index and measures its own time.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 1. A tool that answers fast.
- **Technological proof:** accent folding and Dice similarity in the page; latency from `performance.now()`; hue from longitude.

## Mobile composition

The console goes full bleed under the headline; the swatch becomes a band; endpoints become stacked records.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Spline Sans + Spline Sans Mono |
| Palette | sheet `#E8F0EA`, type `#161616`, ok `#0B7A4B`, warn `#A8501A` |
| Easing | `cubic-bezier(.5,0,.1,1)` |
| Footer | a mono line: fictional API |
| Favicon | three squares, one green |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The API, prices and index: fictional.
3. Light ground on purpose: dark by category is BS-K13.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
