# Lineage — Mesa Corrida (`restaurant-table`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Luis Barragán, Casa Barragán (1948) | Saturated planes of colour, lit, are the room | Colour, composition | Rosa, ocre and jacaranda planes as grounds; the footer is three walls | His walls and courtyards |
| Counter 30% | Lance Wyman, Mexico 68 Olympics identity | Lines radiate from the name until the name is the pattern | Identity | Concentric rings around the word mesa | The 68 logotype |
| Accent 15% | Josef Albers, *Interaction of Color* (1963) | A colour changes with what surrounds it | Content logic | Each course drawn as nested squares set on the colour of the course before | The Homage to the Square paintings |

- **Tension:** Barragán's flat calm against Wyman's vibration.
- **Subject-only ingredient:** twelve seats around one stove, and a menu that changes every Thursday.
- **Signature move:** choose your seats on the counter arc; availability is seeded per night and sitting.
- **Dials:** ENERGY 3 / RHYTHM 3 / MOTION 1. Loud colour, varied bands, almost no motion.
- **Technological proof:** a seat map in SVG driven by native radio and checkbox inputs, readable as a list without the drawing.

## Mobile composition

The ringed name goes first, then the headline; the menu becomes two columns; a fixed bar keeps the price and the booking link at thumb reach.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Ultra + Karla |
| Palette | cal `#F4ECE2`, rosa `#E2507F`, ocre `#E9A43B`, jacaranda `#8F7BC8`, mole `#2A1220` |
| Easing | `cubic-bezier(.22,.9,.32,1)` |
| Footer | three coloured walls: where, when, ask |
| Favicon | nested squares in rosa, ocre and mole |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The dishes, prices and address: all fictional.
3. Availability must come from a real reservation book before launch.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
