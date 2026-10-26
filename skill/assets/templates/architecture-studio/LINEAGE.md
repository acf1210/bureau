# Lineage — Oficina Sal (`architecture-studio`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Tadao Ando, Church of the Light, Ibaraki (1989) | Light cut into mass is the architecture | Light | A slit of daylight in a dark board-marked wall that opens as you scroll | The cross-shaped opening |
| Counter 30% | Ludwig Mies van der Rohe, Barcelona Pavilion (1929) | Planes slide past each other; the plan is the idea | Composition | Projects shown as plans, not renders; walls stop short and rooms slide | The pavilion plan |
| Accent 15% | Carlo Scarpa, Brion tomb, San Vito d'Altivole (1968–78) | The joint is where the building speaks | Detail | One window-head section with four parts you can find from the list | His drawings |

- **Tension:** Ando's closed mass against Mies's open plan.
- **Subject-only ingredient:** where the sun falls at nine, at noon and at five on a Porto site.
- **Signature move:** the opening widens with the scroll, one transform on a pre-sized element.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 2. Heavy and slow; one scroll scene.
- **Technological proof:** CSS scroll-driven animation (`animation-timeline: scroll()`) with a static fallback.

## Mobile composition

The slit turns horizontal and opens downwards above the headline; projects become a swipeable row of cards; the detail list follows its drawing.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Antonio + Hanken Grotesk |
| Palette | concrete `#D6D2CA`, formwork `#26241F`, daylight `#FFF1D2`, bronze `#6E4F24` |
| Easing | `cubic-bezier(.45,.05,.2,1)` |
| Footer | the studio address in three columns |
| Favicon | a vertical slit in a dark square |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The projects, plans and studio: all fictional.
3. The slit belongs to a practice about light; find your own opening.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
