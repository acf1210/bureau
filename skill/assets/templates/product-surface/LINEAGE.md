# Lineage — TIDE (`product-surface`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Edward Tufte, *The Visual Display of Quantitative Information* (1983) | Every mark carries data; compare by repeating the frame; label directly | Content logic | A chart with direct labels and no legend; three futures as small multiples of one section | His book layouts |
| Counter 30% | Massimo Vignelli, NYC subway diagram (1972); *The Vignelli Canon* | One family, a strict grid, the diagram over the picture | Type, navigation | IBM Plex Sans and Mono only, four sizes; the nav is a transit line with stations | The subway map styling |
| Accent 15% | Otl Aicher, Munich 1972 identity | A restricted palette; pictograms on one grid | Colour, icons | Survey paper, chart ink, sea blue, one waterline orange; five asset pictograms on a 24-unit grid | The 1972 pictograms |

- **Tension:** Tufte's austerity against Vignelli's bold diagrammatic line.
- **Subject-only ingredient:** the waterline, which the visitor moves and the whole page reads.
- **Signature move:** raise the waterline; the order of failure below updates with it.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 1. A confident tool, a strict grid with one dark band, motion only when the model moves.
- **Technological proof:** a live model on an SVG chart; the summary, the list and the hero line share one state.

## Mobile composition

The transit-line navigation keeps its stations as dots under the brand; the instrument follows the headline; the three futures stack as full-width multiples so the waterlines stay comparable.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | IBM Plex Sans + IBM Plex Mono |
| Palette | survey `#F1F2EE`, chart ink `#0F2A33`, sea `#1D6A86`, waterline `#D9581A` / `#A33F0C` |
| Easing | `cubic-bezier(.2,.7,.2,1)`, 160 ms |
| Labels | Plex Mono only for measurements and data; headings open each band without a label |
| Separators | one ink rule per band; a 3 px rule on the instrument and the ledger |
| Footer | an assumptions ledger: dataset, datum, exclusions |
| Favicon | a wave under an orange waterline |

## What a project must change

1. The lineage: three new rows for your subject.
2. The dataset: replace the illustrative model before any claim; keep the "illustrative" flag until then.
3. The signature move: the waterline belongs to coastal planning.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
