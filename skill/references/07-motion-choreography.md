# 07 — Motion Choreography

Motion is not garnish. It is the grammar that explains cause, hierarchy, and spatial relationships.

## 1. Motion principles

1. **Purpose** — every motion answers what changed, what matters, or where to look.
2. **Hierarchy** — one entrance sequence, one scroll narrative, one interaction signature. Everything else is quiet.
3. **Physics with intent** — easing carries character: precise, viscous, mechanical, organic, cinematic.
4. **Continuity** — elements move from somewhere to somewhere; nothing teleports without a reason.
5. **Interruptibility** — user input always wins. Hover out, reverse scroll, cancel drag.
6. **Performance** — 60 fps on mid-tier hardware, or cut the effect.
7. **Access** — `prefers-reduced-motion` is a designed mode, not a broken page.
8. **Restraint** — if removing the animation loses nothing, remove it.

## 2. Motion tokens

```css
:root {
  --dur-1: 120ms;   /* micro: press, toggle */
  --dur-2: 200ms;   /* UI: hover, focus */
  --dur-3: 320ms;   /* component: open, reveal */
  --dur-4: 600ms;   /* narrative: section entrance */
  --dur-5: 1200ms;  /* cinematic: hero, scene */

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-precise: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-viscous: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-mechanical: linear;

  --distance-sm: 8px;
  --distance-md: 24px;
  --distance-lg: 64px;

  --stagger-1: 40ms;
  --stagger-2: 80ms;
  --stagger-3: 160ms;
}
```

Use the smallest number of tokens that covers the work. A page with 11 durations has no rhythm.

## 3. The choreography sheet (`MOTION.md`)

Choose implementation after defining the behavior: CSS or the Web Animations API for simple transitions; Motion for richer component, gesture or layout choreography; GSAP for complex timelines; a transition library as a reference for consistent UI states. These are optional project choices, not BUREAU dependencies. Check current license, bundle cost and framework compatibility. Capture start, intermediate, end, interrupted and reduced-motion states; inspect the rendered result and repeat after corrections.

```markdown
# Motion — <project>

## Character
<precise | viscous | mechanical | organic | cinematic> — one paragraph.

## Primitives
| Name | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| reveal | in-view | opacity + translateY(24px) | 600 | out | opacity only, 150ms |
| mask | in-view | clip-path inset | 900 | viscous | instant |
| parallax | scroll | translateY(-12%) | scrub | linear | disabled |
| hover-lift | hover | translateY(-2px) | 200 | precise | none |
| press | active | scale(.98) | 120 | precise | none |
| page | navigation | view-transition | 450 | in-out | instant |

## Scroll narrative
1. Hero: <what happens>
2. Section 2: <what happens>
3. Signature: <what happens>
4. Release: <when motion stops>

## Sound
<opt-in only; never autoplay>

## Budgets
- Max concurrent animations: 6
- Max ambient loops: 1
- Max scroll-linked effects: 3
- Target: 60fps at 4× CPU throttle
```

## 4. Entrance choreography

A good first load has a **sequence**, not a uniform fade:

```
0 ms     ground + chrome appear (opacity 1)
80 ms    nav labels settle (stagger 30ms)
160 ms   display line 1 masks up
240 ms   display line 2 masks up
320 ms   proof / image reveals (scale 1.02 → 1)
480 ms   primary action settles
700 ms   ambient motion begins (if any)
```

Rules:

- Total entrance ≤ 1.2 s; the user must be able to act before it ends.
- Never block interaction during an intro animation.
- Respect `prefers-reduced-motion`: show the final state, no sequence.
- The entrance sets the character; do not use a different character later.

## 5. Scroll-driven motion

### Native CSS (preferred when supported)

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal {
  animation: rise linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 35%;
}

@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
}
```

Parallax:

```css
.parallax {
  animation: parallax linear both;
  animation-timeline: scroll(root);
}
@keyframes parallax {
  from { transform: translate3d(0, -6%, 0) scale(1.06); }
  to   { transform: translate3d(0, 6%, 0) scale(1.06); }
}
```

- Use `transform` only.
- Cap range: ±6–12% is usually enough; ±30% looks like a broken elevator.
- Disable on mobile if it causes jank; provide a static crop.
- Pair with `will-change: transform` only while active.

### IntersectionObserver fallback

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.dataset.inview = "";
    io.unobserve(e.target);
  }
}, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
```

```css
[data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
[data-reveal][data-inview] { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

### Stagger

```css
[data-reveal] > * { transition-delay: calc(var(--i, 0) * 60ms); }
```

Set `--i` in markup or JS. Cap the stagger at 5 items; beyond that, reveal the group.

## 6. Scroll narrative and pinning

For a pinned scene (signature move), use CSS `position: sticky` rather than hijacking scroll:

```css
.scene { min-height: 300vh; }
.scene__stage { position: sticky; top: 0; height: 100svh; overflow: clip; }
```

Then drive the scene with `animation-timeline: scroll()` or a rAF loop reading `scrollY`. Never prevent default scrolling. Never require a wheel gesture to advance.

If you must use a library, prefer:
- **GSAP + ScrollTrigger** — precise timelines, robust pinning, good performance; check current license terms for plugins.
- **Lenis** — smooth scroll; use sparingly, it can fight accessibility and native scroll. Never hide scrollbars.
- **Motion (Framer Motion)** — React component motion and layout transitions.
- **Rive** — state-machine animation for interactive characters/objects.
- **View Transitions API** — cross-document/page transitions in Chromium; progressive enhancement.

## 7. Interaction signatures

- **Magnetic element**: moves 4–12 px toward the cursor, returns with a spring. Never on touch.
- **Cursor label**: a small text label follows the cursor over a project ("View", "Drag"). Hide native cursor only if the replacement is precise and the target remains keyboard-operable. Otherwise keep both.
- **Marquee**: pauses on hover/focus, respects reduced motion, duplicates content with `aria-hidden`.
- **Text mask**: lines reveal via `clip-path` or a wrapper with `overflow: hidden`; do not animate `height`.
- **Image zoom**: scale 1 → 1.04 over 600 ms; no layout shift.
- **Magnetic grid**: subtle displacement near the cursor; cap radius and intensity.
- **Page transition**: shared element via View Transitions; fallback to a 200 ms fade.

## 8. Micro-interactions

| Event | Response | Duration |
|---|---|---|
| Hover (link) | underline draw / color shift | 120–200 ms |
| Hover (card) | lift 2 px + shadow/edge light | 200 ms |
| Press | scale 0.98 | 100–120 ms |
| Focus | ring appears instantly, no fade | 0 ms |
| Toggle | knob slides, state color changes | 200 ms |
| Copy | label changes to "Copied" + check | 150 ms |
| Form error | shake? no. Border + message + focus | 150 ms |
| Loading | skeleton or progress, never a spinner alone | — |
| Success | one confident check + settle | 300 ms |
| Empty | illustration + one action | — |

Never animate focus rings. Never animate error text in a way that delays reading.

## 9. Reduced motion

`prefers-reduced-motion: reduce` is not "no design". It is a calmer mode:

- Remove parallax, pinning, autoplay video, ambient loops, and large transforms.
- Keep opacity changes ≤ 150 ms or remove them.
- Keep state changes instant and legible.
- Provide a manual pause for any motion that lasts > 5 s.
- Never rely on motion alone to convey information.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  video[autoplay] { display: none; }
}
```

Use the global reset as a safety net, then design the specific fallback per component.

## 10. Performance

- Animate `transform`, `opacity`, `filter` (sparingly), `clip-path` (test).
- Avoid animating `width`, `height`, `top`, `left`, `box-shadow`, `blur` in loops.
- Use `requestAnimationFrame` for canvas/WebGL; pause when `document.hidden` or off-screen.
- Batch reads/writes; avoid layout thrash.
- Cap device pixel ratio at 2 for heavy canvases.
- Use `content-visibility: auto` for long pages, with `contain-intrinsic-size`.
- Test with 4× CPU throttle and a mid-tier Android profile.
- Count concurrent animations; if > 6, simplify.

## 11. Motion audit

- Does every animation have a purpose sentence?
- Is there one entrance sequence, one scroll narrative, one interaction signature?
- Does it hold 60fps at 4× throttle?
- Does reduced motion preserve meaning and hierarchy?
- Can the user interrupt or escape?
- Is any motion triggered by hover only?
- Is there autoplay audio? (P0)
- Is there a loading, empty, error, and success state?

Run `node scripts/visual-audit.mjs <url> --motion` to capture normal and reduced-motion states.
