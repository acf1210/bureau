# Lineage — HALFLIGHT (`immersive-experience`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | László Moholy-Nagy, *Light Prop for an Electric Stage* (1930) | Light is the medium, not an effect on a surface | Light | A shader of beams through a rotating slotted disc; the pointer moves the source | The kinetic sculpture |
| Counter 30% | Muriel Cooper, MIT VLW, *Information Landscapes* (1994) | Type in space; depth as navigation | Depth | The title on two planes that separate with the pointer; the studio note set on two depths | The VLW demos |
| Accent 15% | Charles and Ray Eames, *Powers of Ten* (1977) | One continuous move through scale by a constant factor | Scroll narrative | Three movements at 10 m, 1 m and 1 cm; a lens that zooms ×10 per movement as you scroll | The film's framing |

- **Tension:** Moholy-Nagy's dissolving light against Cooper's legible type planes.
- **Subject-only ingredient:** the room, the body, the eye, and the 90 seconds of dark in movement III.
- **Signature move:** shift the light between ember and cobalt; the shader, the title and the focus colour follow.
- **Dials:** ENERGY 3 / RHYTHM 2 / MOTION 3. Light that moves, a scroll scene, a quiet visit section.
- **Technological proof:** one WebGL pass (DPR ≤ 1.5, paused off-screen) and a CSS scroll-driven view timeline with a static fallback.

## Mobile composition

The two title planes tighten their offset; the powers-of-ten lens shrinks above the three movements; the visit facts become one column. The shader keeps one pass at DPR 1.5.

The second word of the title takes the light's colour on purpose: it is the signature (the phase shift recolours it), and it is set once, in the hero (BS-T11 waived on the record).

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Syne + Archivo; no mono |
| Palette | umbra `#0D0A08`, penumbra `#1A1410`, lit `#F3E9DC`, ember `#FF6B3D`, cobalt `#7C93FF` |
| Easing | `cubic-bezier(.65,0,.35,1)`, 400–1200 ms |
| Labels | scale and time in tabular Archivo |
| Separators | light fall-off between grounds; no rules |
| Footer | an afterimage: the name as an outline |
| Favicon | a half-lit circle |

## What a project must change

1. The lineage: three new rows for your subject.
2. The shader: the light-space modulator belongs to a light installation.
3. The film: replace the documentation loop and keep the pause control.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
