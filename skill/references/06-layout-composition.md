# 06 — Layout and Composition

Layout is the order in which the eye is allowed to move.

## 1. Structural vocabulary

- **Grid**: the underlying column system. 12 columns desktop, 6 tablet, 4 mobile.
- **Baseline**: the vertical rhythm. 8 px base, 4 px half-step for optical corrections.
- **Measure**: line length for reading. 55–75 characters.
- **Margin**: the breathing room between content and the viewport edge. Varies by breakpoint.
- **Gutter**: space between columns.
- **Band**: a horizontal section. Each band gets one job.
- **Anchor**: the element that holds the composition together (a number, an image, a line, a word).
- **Break**: a deliberate violation of the grid at the signature moment.

## 2. Tokens

```css
:root {
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.5rem;   /* 24 */
  --space-6: 2rem;     /* 32 */
  --space-7: 3rem;     /* 48 */
  --space-8: 4rem;     /* 64 */
  --space-9: 6rem;     /* 96 */
  --space-10: 8rem;    /* 128 */
  --space-11: 12rem;   /* 192 */

  --container: 1440px;
  --gutter: clamp(1rem, 4vw, 3rem);
  --page-margin: clamp(1.25rem, 5vw, 6rem);
  --grid-columns: 12;
  --grid-gap: clamp(0.75rem, 1.5vw, 1.5rem);

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --radius-pill: 999px;
}
```

**Radius discipline:** pick a family (0 / 2 / 6 / 12 or 0 / 8 / 24) and never mix in a third system. If everything is 24 px, nothing is.

## 3. Grids

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--grid-gap);
  padding-inline: var(--page-margin);
}
.grid > .col-7 { grid-column: span 7; }
.grid > .col-5 { grid-column: span 5; }
.grid > .bleed { grid-column: 1 / -1; }
```

- **7/5** or **8/4** splits create hierarchy. 6/6 is a stalemate unless the content is genuinely equal.
- Use `minmax(0, 1fr)` to prevent overflow from long words.
- Let images bleed to the viewport edge; let text respect the margin.
- Use `grid-template-areas` for page-level composition when the layout is unusual.

### The dominant column

Pick one column band as the **spine** (e.g., columns 4–10). All reading content lives there. Asides, captions, and metadata live in the margins. The spine is what makes an editorial page feel designed rather than poured.

## 4. Responsive composition

Do not stack; recompose.

| Viewport | Behavior |
|---|---|
| 320–479 | Single column, display type ≤ 15vw, no horizontal scroll, 44 px targets |
| 480–767 | 4-column grid, images full-bleed, 2-up cards |
| 768–1023 | 6-column grid, reintroduce asymmetry, nav condenses |
| 1024–1439 | 12-column grid, full composition |
| 1440–1919 | Max container, more margin, not more content width |
| 1920+ | Cap measure; use the extra space for atmosphere, not line length |

Rules:

- Fluid type with `clamp`, not jumpy breakpoints.
- Container queries for components in different contexts.
- Test at 320, 360, 390, 414, 768, 1024, 1280, 1440, 1920, 2560.
- Test with 200% zoom and 400% zoom (reflow).
- Test long Portuguese/Spanish strings and German compounds.
- No horizontal scroll at any width; `overflow-x: clip` is a bandage, not a fix.

```css
.card {
  container-type: inline-size;
}
@container (min-width: 28rem) {
  .card { grid-template-columns: 1fr 1.4fr; }
}
```

## 5. Vertical rhythm

- Sections get `padding-block: clamp(4rem, 10vw, 10rem)`.
- Related elements: 8–24 px. Distinct groups: 32–64 px. New sections: 96–192 px.
- Use `gap` instead of margins for layout; margins for prose rhythm.
- Headings need more space above than below (proximity).
- The first viewport must fit in `100svh` without clipping the primary action.

```css
.prose > * + * { margin-block-start: 1em; }
.prose h2 { margin-block-start: 2.5em; margin-block-end: 0.5em; }
```

## 6. Page architectures

### Narrative (PERSUADE / EXPERIENCE)
```
HOOK → TENSION → PROOF → MECHANISM → OBJECTION → CLOSE
```
Each band has one job. The signature move appears between tension and proof.

### Product (OPERATE)
```
ORIENT → PRIMARY TASK → DETAIL → RECOVERY → EXIT
```
Density rises in the task area; navigation stays stable.

### Editorial (READ)
```
MASTHEAD → LEDE → BODY (spine + margins) → APPARATUS → NEXT
```
The reading column never competes with the frame.

### Index / Archive (READ / EXPERIENCE)
```
PREMISE → FILTER / MAP → ITEMS → DETAIL → RETURN
```
The index itself is the signature: a map, a table, a specimen board.

## 7. The fold

The fold is a complete thought. At 1440×900 the first viewport should contain:

1. What this is (brand + offer or thesis).
2. Why it matters (one line of tension).
3. What to do (one action) or what to watch (one focal element).
4. A hint of what comes next (a crop, a line, a number, a scroll cue).

At 390×844, prioritize 1–3 and let 4 be a partial crop. Never hide the primary action below a full-screen decorative image.

## 8. Asymmetry without chaos

- Offset an element by a **meaningful unit** (one column, one type size, one image crop), not by a random 13 px.
- Balance an asymmetric layout with **visual weight**, not equal area.
- Use a strong diagonal or a single vertical rule to stabilize the tension.
- Keep the reading order linear in the DOM even when the visual order is asymmetric.

## 9. Motion and layout

- Animate `transform` and `opacity`; never animate `top`, `left`, `width`, or `height` for continuous effects.
- Reserve space for media to avoid CLS (`aspect-ratio`).
- Sticky elements need a defined scroll range and a release.
- Scroll-driven animations must have a static fallback.

## 10. Layout tells

- Everything centered, every section the same height.
- 3 equal cards as the default content model.
- Bento grid because it is trendy, not because the content is modular.
- Hero occupying 100vh with the CTA below the fold.
- Inconsistent max-widths (1200, 1280, 1100) across sections.
- Cards nested in cards.
- 24 px radius on every surface.
- Icon + title + paragraph repeated six times.
- Footer as a link dump with a giant wordmark.
- 100ch paragraphs.

## 11. Layout checklist

- [ ] One dominant column / spine.
- [ ] Grid break at the signature moment.
- [ ] Density map is intentional.
- [ ] Fold is a complete thought at 1440 and 390.
- [ ] No horizontal scroll at 320.
- [ ] 200% zoom reflows without loss.
- [ ] Spacing uses the token scale.
- [ ] Radius family is consistent.
- [ ] DOM order matches reading order.
- [ ] Media reserves space (no CLS).
