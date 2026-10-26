# Lineage — Arquivo Vivo (`museum-archive`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Lina Bo Bardi, São Paulo Museum of Art (MASP, 1968) | Works stand on glass in one open room; the label is on the back | Composition, content logic | Prints on glass easels with the catalogue record on the reverse | The glass-and-concrete easels |
| Counter 30% | Alvin Lustig, New Directions book covers (1940s) | An abstract sign stands for the contents | Imagery | Each photograph drawn as a sign: circle for the port, triangle for feasts, square for streets | His covers |
| Accent 15% | Bruno Munari, *Design as Art* (1966) | Reading made playful | Interaction | Filter the room by sign; turn any easel around | His books |

- **Tension:** Bo Bardi's open room against Lustig's closed signs.
- **Subject-only ingredient:** the red beams of the building, and the pencil notes on the back of each print.
- **Signature move:** turn an easel to read its back; the front and back swap focus with `inert`.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 1. One turn at a time.
- **Technological proof:** 3D flip with `backface-visibility`, `inert` on the hidden face, reduced motion as an instant swap.

## Mobile composition

The room becomes a row of easels you swipe through with scroll snapping; filters wrap above it.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Epilogue + Libre Caslon Text |
| Palette | floor `#E7E6E1`, glass `#DDE4E2`, ink `#1C1B19`, pillar `#B3261E` |
| Easing | `cubic-bezier(.7,0,.2,1)` |
| Footer | archive, address, write |
| Favicon | a glass pane on a block under a red beam |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The archive, prints and photographers: fictional.
3. Use real records; the back of the print is the point.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
