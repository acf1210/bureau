# Lineage — Fulcro (`hardware-store`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Dieter Rams, ten principles of good design (Braun) | As little design as possible; honest controls | Components | A grey housing, round controls, one orange switch colour | Braun product forms |
| Counter 30% | Ettore Sottsass, the Memphis group (1981) | Colour and pattern against functionalism | Colour | Shade colours and one patterned corner break the grey | Memphis furniture patterns |
| Accent 15% | Achille Castiglioni, Arco lamp (1962, with Pier Giacomo Castiglioni) | Ready-made parts, shown apart | Content logic | An exploded view with every part's price | The Arco lamp |

- **Tension:** Rams's restraint against Sottsass's play.
- **Subject-only ingredient:** four parts that unscrew, each sold for ten years.
- **Signature move:** configure the lamp, then show the parts apart; the price is the sum of the parts.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 2. A friendly tool with one mechanical gesture.
- **Technological proof:** an SVG configurator driven by native radio inputs; the total is plain arithmetic over the parts.

## Mobile composition

The lamp goes first; the price and the add button stick to the bottom of the form while you choose, as a real control.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Bricolage Grotesque + DM Mono |
| Palette | housing `#E4E4E0`, graphite `#222326`, switch `#D5531F`, Memphis yellow, blue and red |
| Easing | `cubic-bezier(.34,1.2,.64,1)` |
| Footer | a mono plate: fictional lamp |
| Favicon | a lamp arm with a yellow shade |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The lamp, parts and prices: fictional.
3. Specifications need a datasheet before any claim.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
