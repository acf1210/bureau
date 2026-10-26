# Lineage — Kreis (`record-label`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Reid Miles, Blue Note Records sleeves (1956–67) | Type as rhythm; extreme scale contrast | Voice, composition | Sleeves made only of type, from 11 to 92 cqi | Any Blue Note sleeve |
| Counter 30% | Peter Saville, Joy Division *Unknown Pleasures* sleeve (1979) | The sound drawn as data | Imagery | Each sketch draws its own stacked lines on its sleeve as it plays | The pulsar plot |
| Accent 15% | Neville Brody, art director of *The Face* (1981–86) | Width and angle as voice | Type | The width axis of Anybody from 50 to 150, one tilted sleeve | His magazine pages |

- **Tension:** Miles's clean jazz grid against Saville's cold data.
- **Subject-only ingredient:** three hundred copies of each record, pressed in Saxony.
- **Signature move:** press a sleeve and hear a ten-second sketch synthesised from its tempo and key.
- **Dials:** ENERGY 3 / RHYTHM 2 / MOTION 2. Loud type; sound and lines only on request.
- **Technological proof:** Web Audio synthesis and an analyser drawing ridge lines; width-axis fallbacks measured per width so the page does not shift.

## Mobile composition

Sleeves go two up with full-width play and add buttons; a player bar appears only while a sketch plays; the order form is one column.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Anybody + Libre Franklin |
| Palette | sleeve `#EDEBE4`, vinyl `#121212`, blue `#1E4FD6`, yellow `#F2C230` |
| Easing | `cubic-bezier(.16,.84,.44,1)` |
| Footer | a run-out line: fictional label |
| Favicon | a record with a blue label on yellow |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The artists, records and prices: fictional; the sketches are not the music.
3. Audio never autoplays; keep it that way.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
