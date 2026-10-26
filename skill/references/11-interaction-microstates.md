# 11 — Interaction and Microstates

The difference between a designed site and a styled page is what happens after the first click.

## 1. State inventory

Every interactive element needs these states designed, not defaulted:

| State | Visual | Motion | Access |
|---|---|---|---|
| Default | base | none | — |
| Hover | shift/lift/underline | 120–200 ms | not sole signal |
| Focus | high-contrast ring | instant | keyboard |
| Active/press | scale 0.98 / darker | 100 ms | — |
| Selected | accent + structure | 150 ms | `aria-selected` |
| Disabled | muted + reason | none | `aria-disabled` |
| Loading | skeleton/progress | loop ≤ 1 | `aria-busy` |
| Success | check + settle | 300 ms | live region |
| Error | border + message | 150 ms | `aria-invalid` + focus |
| Empty | explanation + action | none | — |

If a state is missing, the component is unfinished.

## 2. Focus is a design element

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  border-radius: 2px;
}
:focus:not(:focus-visible) { outline: none; }
```

- Never remove outlines without a visible replacement.
- Focus ring contrast ≥ 3:1 against adjacent colors.
- Focus must follow DOM order and remain visible on dark, light, and image backgrounds.
- Skip link: first focusable element, visible on focus.

## 3. Hover and pointer

- Hover is an enhancement; touch users must get the same information.
- Do not hide essential content behind hover.
- Card hover: lift 2 px + edge light; not a 1.05 scale that blurs text.
- Link hover: underline draw (120–200 ms) or color shift; not a rainbow.
- Image hover: 1.02–1.04 scale over 600 ms, no layout shift.
- Cursor changes: `pointer` for clickable, `grab` for draggable, `text` for selectable.

## 4. Custom cursor

Only if it adds meaning:

- A label ("View", "Drag", "Play") over a media field.
- A small lens over a specimen/diagram.
- A crosshair over a technical canvas.

Rules:

- Keep the native cursor visible unless the replacement is precise and the loss is acceptable.
- Never lag more than ~80 ms; use `transform` with a lerp of 0.15–0.25.
- Hide on touch and reduced-motion.
- Do not block clicks (`pointer-events: none`).
- Provide keyboard equivalents for every action.
- Do not use a giant circle that obscures content.

```js
const dot = document.querySelector(".cursor");
let x = 0, y = 0, tx = 0, ty = 0;
addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
function loop() {
  x += (tx - x) * 0.2; y += (ty - y) * 0.2;
  dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  requestAnimationFrame(loop);
}
if (matchMedia("(pointer: fine)").matches) loop();
```

## 5. Page transitions

### View Transitions API (progressive enhancement)

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: fade-out 180ms ease both; }
::view-transition-new(root) { animation: fade-in 260ms ease both; }
```

```js
document.startViewTransition?.(() => updateDOM());
```

Rules:

- Keep transitions ≤ 400 ms.
- Shared elements must be stable (same aspect ratio / position).
- Respect reduced motion (instant).
- Never block navigation on the animation.
- Provide a normal fallback for browsers without support.

### Multi-page sites

- Cross-document view transitions where supported.
- Otherwise a 150–250 ms fade or no transition.
- Preserve scroll position on back navigation.
- Do not re-run the full entrance animation on every page.

## 6. Forms

A form is a conversation. Design the whole conversation.

- Labels above inputs; placeholders are examples, not labels.
- One column; do not put related fields side by side on mobile.
- Validate on blur, not on every keystroke; re-validate on submit.
- Error message: what is wrong + how to fix + where.
- Success: confirm what happened and what happens next.
- Autofill: correct `autocomplete`, `inputmode`, `type`.
- Password: allow paste and reveal.
- Never use a CAPTCHA unless necessary; offer an accessible alternative.
- Preserve input on error; never clear the form.

```html
<label for="email">Work email</label>
<input id="email" name="email" type="email" autocomplete="email"
       aria-describedby="email-hint email-error" required>
<p id="email-hint">We reply within one business day.</p>
<p id="email-error" role="alert" hidden>Enter a valid email, e.g. name@company.com.</p>
```

## 7. Loading, empty, error

### Loading

- < 300 ms: no indicator.
- 300 ms–1 s: skeleton or subtle progress.
- > 1 s: progress + what is happening.
- Never a full-page spinner for a partial update.
- Animate only opacity/shine; respect reduced motion.

### Empty

- Explain why it is empty.
- Show one primary action.
- Keep the layout stable (no giant blank page).
- Do not use a sad illustration unless it is the brand's voice.

### Error

- Plain language, no codes alone.
- Preserve the user's work.
- Offer retry + a way out.
- Log the correlation ID for support.

## 8. Navigation

- Current location is visible (`aria-current="page"`).
- Mobile menu: focus trap, Escape to close, restore focus.
- Sticky nav: hide on scroll down, reveal on scroll up, but never hide the only way back.
- Anchor links: correct offset for sticky headers; smooth scroll only with reduced-motion off.
- Mega menus: keyboard operable, not hover-only.
- Breadcrumbs for depth ≥ 3.

## 9. Sound

- Opt-in only. Never autoplay.
- A visible mute control with persistent state.
- Use sound for feedback, atmosphere, or narrative—not decoration.
- Provide captions/transcript when sound carries meaning.
- Duck music under speech.

## 10. Scroll behavior

- Never hijack the wheel/touch scroll for a narrative.
- `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`.
- Sticky scenes: always allow scroll to continue; provide an exit.
- Scroll progress indicators must not be the only navigation.
- Preserve position on back/forward.

## 11. Delight moments

Choose **one** place for delight, usually:

- first load (the entrance),
- completion (success),
- recovery (error handled gracefully),
- discovery (a hidden detail in the signature move).

Delight is not confetti. It is a precise, surprising response that proves someone thought about this moment.

## 12. Interaction checklist

- [ ] Every state designed (hover, focus, active, disabled, loading, error, empty, success).
- [ ] Focus visible and ordered; no traps.
- [ ] All pointer interactions have keyboard equivalents.
- [ ] Custom cursor is optional, precise, and hidden on touch.
- [ ] Page transitions ≤ 400 ms and reduced-motion safe.
- [ ] Forms validate helpfully, preserve input, and announce errors.
- [ ] Loading/empty/error states are designed.
- [ ] Sound is opt-in with a control.
- [ ] No scroll hijack.
- [ ] Delight appears once, at a moment that earns it.
