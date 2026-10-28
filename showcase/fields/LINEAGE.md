# Lineage — Quarter (`showcase/fields`)

A showcase model: design first, performance last. It is a worked example of a blend (`skill/references/23-lineage-and-blend.md`), not a template to copy.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Edward Tufte, *The Visual Display of Quantitative Information* (1983) | Put the evidence where the decision is made; maximise data-ink | Content logic | Every reading is pinned to the field it describes, every sourced fact is cited in the footer, and every derived figure (48 ha, under 2%, about 5,000 pixels, four pixels long) is arithmetic shown in `.bureau/evidence/copy-review.md` | His book page layouts |
| Counter 30% | Muriel Cooper, *Information Landscapes* (1994) | Type and image live in depth; transparency makes layers legible | Depth | The analysis sheets lift off the ground and settle back; labels are projected by the same camera as the render | Her MIT Media Lab identity |
| Accent 15% | Otl Aicher, *Munich 1972* | A small sign and colour system, applied without exception | Colour and signs | Six crop colours, one survey amber and one detection cyan on a single grid | The Munich pictograms |

- **Tension:** Tufte's still, flat evidence against Cooper's moving depth. The page keeps the readings legible while the ground moves.
- **Subject-only ingredient:** the quarter section, 160 acres, and the sensor's resolution decide what can be seen. The same steer is invisible at 10 m and four pixels long at 50 cm.
- **Signature move:** one descent through the sensor's own resolution, from 786 km to 70 m: survey lattice, 10 m NDVI pixels, crop classes, red-edge stress, then 50 cm pixels in which the feedyard resolves and is counted.
- **Dials:** ENERGY 3 / RHYTHM 2 / MOTION 4. The camera moves only with scroll; the render breathes with one slow drift.
- **Technological proof:** raw WebGL 2 fragment renderer, no library, shaded for realism: linear-light albedo, sun and sky lighting, analytic shadows (crop canopy, pivot spans, grain bins, shelterbelts, cattle), aerial perspective by altitude and ACES tone mapping. An analytic Earth with a thin blue limb and lit cumulus (no stars, as in a sunlit exposure); a procedural section grid with centre pivots, wheel tracks, wheat at harvest, dryland strips, farmsteads, a braided sand river with cottonwoods and a feedyard of 30,979 head; sensor quantisation at 10 m and 50 cm; lifted analysis planes; labels projected from the same camera in JavaScript.
- **Realism rule:** every image and motion reads as real imagery and a real camera; only the data layers (lattice, NDVI, classes, stress, detections) are graphic.

## Mobile composition

The render fills the screen and the plates become full-width sheets that rise from the bottom, leaving the upper half to the scene; each camera move waits until 60% of its chapter so the subject stays in the narrow frame while the plate is read. The station rail becomes a horizontal strip under the wordmark, the HUD keeps view height and data pixel, the fiction note stays as a strip beside Pause, and the scene labels are limited to three.

## Fingerprint

| Dimension | This model |
|---|---|
| Faces | Newsreader (display and prose) + Geist Mono (HUD) |
| Palette | orbit `#06090C`, surface `#0E1418`, ink `#ECEFE8`, survey amber `#F2B544`, detection cyan `#5BD3E6` |
| Easing | quadratic ease-in-out on a smoothstep window per chapter |
| Favicon | a quarter-section grid with four pivots |

## Priorities

Design leads every decision here. The page spends GPU time and large type freely on the descent, and still keeps the floor: AA contrast on every plate, a keyboard path with visible focus, reduced motion designed as stations, all copy readable without JavaScript or WebGL, and no number that the scene or a source cannot support.
