# 24 — Refinement Passes

Between the first build and QA. The first build proves the idea; refinement makes it exact. Most of what reads as "expensive" is decided here, at 200% zoom, one property at a time.

**The rule:** one pass at a time, from structure to detail. Re-shoot after each pass. Never polish a detail inside a structure that is about to change.

## 1. Order

| Pass | Looks at | Zoom | Stops when |
|---|---|---|---|
| P1 Structure | spine, density, fold, grid break | 25% and grayscale | the thumbnail is recognizable |
| P2 Type | sizes, optical size, tracking, leading, rag | 200% | every line break is chosen |
| P3 Colour and light | roles, accent count, states, contrast | 100% | each colour has one job |
| P4 Space | scale, rhythm, proximity, targets | 100% with outlines | no value is off the scale |
| P5 Motion | character, timing, sequence, reduced mode | recording at 0.25× | one entrance, one narrative, one signature |
| P6 States and edges | hover, focus, error, empty, loading, 404 | keyboard only | nothing is left at browser default |
| P7 Distinctness | lineage, divergence, attribution | side by side | no single source can be named |

Record each pass in `.bureau/evidence/refinement.md`: what you looked at, the defects, the fix, the before/after crop.

## 2. P1 — Structure

- Squint at a 25% grayscale screenshot of the full page. You should see one spine and a density rhythm (`03-art-direction.md` §5).
- The fold is a complete thought: offer, proof, action, or the threshold.
- The grid breaks once, at the signature moment. Count the breaks; remove the others.
- Each band has one job. If two bands do the same job, merge them.
- Mobile recomposes: the margin column becomes an inline aside, not a list dumped at the end.

## 3. P2 — Type

| Check | Threshold | How to fix |
|---|---|---|
| Optical size | display uses the display cut or `opsz` ≥ 48 | set `font-optical-sizing:auto` or `font-variation-settings` |
| Hairlines at size | thin strokes survive at the largest size and weight | lower `opsz` or weight for that line |
| Small glyphs at display size | hyphens, periods, quotes visible at 1440 and 390 | loosen tracking around them, or lower `opsz` |
| Display tracking | −0.02 to −0.06 em, tighter as size grows | tune per size step, not once |
| Small caps and labels | +0.05 to +0.08 em | `font-variant-caps` before `text-transform` |
| Leading | display 0.78–0.98; body 1.5–1.7 | descenders must clear the next block |
| Measure | 55–75 ch for prose | `max-width` in `ch` or a grid column |
| Rag and widows | no single-word last lines in heads | `text-wrap:balance` for heads, `pretty` for prose |
| Numerals | tabular in data, lining in UI | `font-variant-numeric` |
| Punctuation | real quotes, dashes, `→` aligned to the baseline | replace typed approximations |
| Locales | ã ç é ñ ü at display size | render the specimen in PT and ES |

Look at the display line at 200%. If a glyph collides, disappears, or reads as another letter, the line is not finished.

## 4. P3 — Colour and light

Verify with the post-production checks in `34-color-tooling.md` §3.

- List every colour on the page and its role. A colour without a role is removed.
- Accent at full strength: at most three uses above the fold.
- Focus, selection, and form states use the world's colours, not browser blue.
- Check contrast in every state, including hover, visited, disabled, and text over media at its brightest frame.
- Dark grounds are tinted towards the world (asphalt blue, warm umbra), not neutral `#000`.
- A section that changes ground changes the line and muted colours too.

## 5. P4 — Space

- Every margin, padding and gap comes from one scale. Outline the page (`* { outline: 1px solid }`) and look for odd values.
- Proximity: space inside a group is smaller than space between groups.
- Optical alignment: hang punctuation and drop caps outside the text edge; align type by its x-height, not its box.
- Targets: 44 × 44 px for primary controls, 24 × 24 px minimum anywhere.
- At 320 px nothing touches the viewport edge and nothing scrolls sideways.

## 6. P5 — Motion

- One character for the whole page (`03-art-direction.md` §9). Check every `transition` and `animation` for a curve that does not belong.
- Duration follows distance: small moves 120–220 ms, large moves 600–1200 ms.
- One entrance sequence; after it, the page is quiet until touched.
- No reveal on every section. If more than two sections animate on entry, cut all but the signature.
- Reduced motion is designed: the final state, not a broken one.
- Record at 0.25× and watch for overlap, jank, and layout shift.

## 7. P6 — States and edges

Walk the page with the keyboard only. Then check:

- Skip link, visible focus, logical order.
- Hover, focus, active, disabled for every control; focus is never weaker than hover.
- Form messages: human, specific, next to the field, announced (`role="status"`).
- Empty, loading and error states for every live element.
- Media: poster, pause control, captions when speech matters.
- 404 and offline: designed in the world, not default.

## 8. P7 — Distinctness

The last pass checks that refinement did not slide back towards the average or towards the scaffold.

- Re-run the lineage tests (`23-lineage-and-blend.md` §6).
- Check the house-style tells: favicon, easing curve, label style, section separators, footer. If any of them is still the scaffold's, change it.
- Compare against the three directional comps: the build should be closer to the chosen comp than to any template.

```bash
node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates --out .bureau/evidence/divergence.json
```

## 9. Anti-patterns

- Polishing the hero for a day while the page has no density map.
- Fixing contrast with opacity instead of a colour.
- One global `letter-spacing` for every size.
- Adding a reveal to a section because it "felt static".
- Treating the scaffold's details as already refined.

## 10. Output

- `.bureau/evidence/refinement.md` with one entry per pass.
- Before/after crops at 200% for P2 and P4.
- A 0.25× recording for P5.
- `.bureau/evidence/divergence.json` from P7.
