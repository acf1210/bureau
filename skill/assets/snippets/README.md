# Snippets

Small, dependency-free primitives. Copy what you need; do not import the whole folder.

| File | What it does | Accessibility |
|---|---|---|
| `reveal.js` | IntersectionObserver reveal | shows everything under reduced motion |
| `parallax.js` | transform-only, capped parallax | disabled under reduced motion |
| `magnetic.js` | subtle pointer attraction | pointer-fine only; off under reduced motion |
| `marquee.css` | infinite ticker | pauses on hover/focus; static under reduced motion |
| `view-transition.js` | progressive page transitions | instant fallback; off under reduced motion |

## Rules

- These are starting points, not a motion system. Choose one character and one signature.
- Do not apply `reveal` to every section; it is the most common AI-slop motion tell.
- Keep parallax off reading text.
- Never use a custom cursor to replace the native one without a keyboard path.
- Test on a real mid-tier phone and with `prefers-reduced-motion: reduce`.

## Markup

```html
<section data-reveal>…</section>
<div data-parallax data-speed="0.06">…</div>
<a class="button" data-magnetic data-strength="0.15">…</a>
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">… duplicate the content once …</div>
</div>
```
