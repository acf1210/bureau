# 34 — Colour tooling for pre- and post-production

`05-color-pantone.md` decides what the colour means. This file chooses the library that computes it: before the build (pre-production, G1–G3) to explore, extract and generate a system; after the build (post-production, G3, G6, G7) to verify gamut, contrast, themes and data scales. A library gives you numbers; the palette still needs a story, five roles and one unexpected colour (`05` §4).

## 1. The libraries

None is a BUREAU dependency. Install one in a scratch folder or the user's project only when used, announce it first (`SKILL.md` §2), and write the version used in `.bureau/evidence/color.md`. Licences were read from the GitHub repositories on 2026-10-27.

| Library | npm | Licence | Strength | Limit |
|---|---|---|---|---|
| **Color.js** ([color-js/color.js](https://github.com/color-js/color.js), from LeaVerou/color.js) | `colorjs.io` | MIT | Reference implementation by CSS Color spec editors: OKLCH, LCH, Display P3, Rec. 2020, gamut mapping, WCAG 2.1 and APCA contrast, ΔE | Pre-1.0 API; pin the version |
| **Chroma.js** ([gka/chroma.js](https://github.com/gka/chroma.js)) | `chroma-js` | BSD-style; ColorBrewer colours Apache-2.0 | Scales and interpolation (`mode('oklch')`, `bezier`, `correctLightness`), ColorBrewer palettes, classes for data | sRGB-centred; no P3 gamut mapping |
| **Leonardo** ([adobe/leonardo](https://github.com/adobe/leonardo)) | `@adobe/leonardo-contrast-colors` | Apache-2.0 | Generates colours from target contrast ratios against a background; one definition yields light, dark and high-contrast themes | Ratios are WCAG 2 by default; it does not judge the hue story |
| **ColorBox** (Lyft; repo [lyft/coloralgorithm](https://github.com/lyft/coloralgorithm), app colorbox.io) | — (source in repo) | Apache-2.0 | Steps of hue, saturation and luminosity along curves: a full ramp per hue with even progression | Last pushed 2023-10-02; curves are in saturation and luminosity, not OKLCH. Use it for ramp shape, then convert and check in Color.js |
| **Color Thief** ([lokesh/color-thief](https://github.com/lokesh/color-thief)) | `colorthief` | MIT | Dominant colour and palette from an image by clustering pixels; browser and Node | Dominant is not meaningful: it returns what covers most pixels, often the background |
| **Poline** ([meodai/poline](https://github.com/meodai/poline)) | `poline` | MIT | Palettes drawn along lines between anchor colours in a 3D colour model; non-linear position functions give unexpected harmonies | Exploratory; its output is a candidate, not a system. Pin the version (0.x) |

## 2. Pre-production (concept and direction)

| Step | Gate | Tool | Output |
|---|---|---|---|
| Extract the palette of each verified reference capture and of the client's own imagery | G1 | Color Thief on `.bureau/research/captures/<id>/*.png` (`33`) and brand photos | Swatches per source in `.bureau/research/color.json`. Evidence of what the category does, never a palette to copy (`30` §3, `avoid`) |
| Explore unexpected harmonies for the three directions | G1 | Poline, anchors taken from the brief's concept (material, place, light), not random | Two or three candidate palettes per comp, anchors recorded |
| Build the ramps: 9–11 steps per hue | G2–G3 | ColorBox for ramp shape, or Chroma.js `scale().mode('oklch').correctLightness()` | Ramps converted to OKLCH + hex in `DESIGN.md` |
| Fix the semantic roles by contrast, not by eye | G3 | Leonardo: ground as background, target ratios per role (body ≥ 4.5, large text and UI ≥ 3) | Light, dark and, if needed, high-contrast themes from one definition |
| Use wide gamut only where it carries meaning | G3 | Color.js: `toGamut` into sRGB for every P3 value | `@media (color-gamut: p3)` value plus its sRGB fallback (`05` §2) |

Rules: a generator never chooses the hue story; the anchors come from the concept. Pick the candidate that serves the world, and write in `decision.md` why the others lost. A palette taken whole from one reference or one image is a tribute act (BS-C12).

## 3. Post-production (QA and review)

| Check | Gate | Tool | Pass when |
|---|---|---|---|
| Contrast of every token pair and state (hover, focus, disabled, error, on-image) | G3, G7 | `tokens.mjs --check` (the gate); Color.js `contrast(…, "WCAG21")` for computed colours the script does not see | WCAG 2.2 AA met; APCA Lc recorded as a note, never instead of WCAG (`05` §2) |
| Dark theme is recomputed, not inverted | G3 | Leonardo regenerated against the dark ground; Color.js ΔE between theme pairs | Every role keeps its ratio in both themes |
| Gamut: no P3 value clips on sRGB screens | G6 | Color.js `inGamut("srgb")` on each P3 token | Each wide-gamut value has an sRGB fallback that keeps its role |
| Data palette is ordered and colourblind-safe | G3, G7 | Chroma.js scales in OKLCH; ColorBrewer for categorical sets; Chromium vision-deficiency emulation (CDP `Emulation.setEmulatedVisionDeficiency`) on the rendered chart | Lightness monotonic for sequential scales; labels never rely on colour alone |
| Images are graded into the palette | G3 | Color Thief on the shipped images, compared with the ground and accent | Dominant colours sit inside the world, or the deviation is intended and named |
| An image-driven UI stays legible (player, catalogue) | G7 | Color Thief at runtime, then Color.js or Leonardo to pick ink for the extracted ground | Text on every extracted ground ≥ 4.5:1; a fixed fallback exists |

Record results in `.bureau/evidence/color.md`: library and version, inputs, outputs and failures fixed. Read the rendered page as well: a passing ratio on tokens says nothing about text on a photo or a gradient.

## 4. Shipping a library

Pre- and post-production use stays out of the build. Ship a library only when the page computes colour at runtime (Color Thief for user images, Chroma.js for live data); import only the module used and count it against the 250 KB JS budget (`13-performance.md`). Static tokens never need a colour library in the browser: CSS `oklch()`, `color-mix()` and `in oklch` gradients cover them.

## Limits

These libraries compute and check colour; they do not decide whether it fits the brand, and a generated palette is not a concept (`17-anti-ai-slop.md`). Color Thief's dominant colour describes pixel area, not meaning. APCA is not a WCAG 2.2 conformance method. If a library is unavailable, use CSS colour functions and `tokens.mjs --check` alone and record the limitation.
