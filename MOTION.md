# MOTION — BUREAU site

> Behaviour contract for the landing. Every number below is what `site/index.html` implements, not a target.

## Grammar

One entrance, then quiet. Motion has three jobs: admit the page is loaded (hero), report position (progress rule), and reveal evidence as it is reached (plates and ledger). Nothing moves to decorate. There is no scroll-linked scene, no parallax on text, no cursor follower, no animated gradient brand.

## Choreography

| Moment | Trigger | Behaviour | Timing |
|---|---|---|---|
| Hero entrance | first frame after load | `body.ready` added on the next frame; each `h1 span` travels from `translateY(.35em)`, opacity 0, to rest | 1.1 s transform, 0.9 s opacity, `cubic-bezier(.16,1,.3,1)` |
| Progress rule | scroll | 2 px ember rule at the top is scaled from 0 to 1 with `transform:scaleX()` over document progress, passive listener | continuous, no easing |
| Slogan band | none | a static row of seven phrases; it does not scroll, so there is nothing to pause | — |
| Section reveal | `IntersectionObserver`, threshold 0.15, rootMargin `0 0 -6%` | `.reveal` gains `.in` once and is unobserved | 0.6–0.9 s, translate 24 px + opacity |
| Shader | pointer move, visibility, resize | ember/cobalt ribbon over the hero, uniform time advances 0.045/s, pointer target lerped at 0.045 per frame; device pixel ratio capped at 1.5 | continuous while visible |
| Film | enters viewport at 0.2 | plays muted, inline, looped when motion is allowed; a visible button toggles play/pause and swaps its label between "Pause film" and "Play film" | user-controlled |
| Tabs | click, ArrowLeft/ArrowRight | roving `tabindex`, `aria-selected`, panel `hidden` | instant |
| Copy | click | writes the command; the visible label and a polite live region report success; on failure it selects the text and says "selected — copy manually" | 1.4 s label reset |

## Reduced motion

`prefers-reduced-motion: reduce` is honoured at three levels:

1. CSS: `animation-duration` and `transition-duration` reduced to 0.01 ms, iteration count 1; `scroll-behavior: auto`; hero and reveals at rest with no transform.
2. Shader: one static frame is drawn; no animation frame is requested. The state is re-evaluated on `change`.
3. Film: never started; the markup carries no `autoplay`, `preload` is `none`, and the button reads "Play film".

Verified by `tests/landing.test.mjs` and by `.bureau/qa/screenshots/*-reduced-motion.png`.

## Performance rules

- The shader runs only when the canvas is intersecting, the document is visible and reduced motion is off. It is cancelled on `visibilitychange` and resumed on return.
- Resolution is capped at 1.5× device pixel ratio; antialiasing is off; one full-screen triangle, no per-frame allocation.
- The film is never autoplayed with audio; `muted`, `playsinline` and a poster frame are required.
- No motion library. No animation dependency beyond the platform.
- Budgets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, JS ≤ 250 KB gzip. Measured in `.bureau/qa/report.json`.

## Failure and fallback

- WebGL unavailable or shader compile failure: the canvas is hidden and the CSS radial-gradient fallback remains. No error reaches the user.
- `IntersectionObserver` unavailable: reveals never fire and content stays at rest, because the hidden state is scoped under `.js` and `.ready`; the page remains readable.
- JavaScript disabled: no `.js` class, so no element is hidden; the film does not autoplay because the attribute is absent; a `noscript` block reveals all four install panels.
- Off-screen or hidden tab: zero frames drawn. Resizing redraws one static frame under reduced motion.
