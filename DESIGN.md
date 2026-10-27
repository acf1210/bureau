# DESIGN — BUREAU site

> Visual contract for the landing and documentation. Tokens are normative; a deviation is a finding unless recorded under Decisions. Numbers here are the ones implemented in `site/assets/docs.css` and `site/index.html`.

## World

A dark reading room with an instrument panel. Paper-coloured ink on a near-black ground, one acid green for action, one ember for display accent, one cobalt for data. Type is the architecture: a neoclassical display face at building scale against a mono telemetry voice. Light is produced, not photographed — the hero ribbon is a fragment shader, and it is the only place the page admits to being a screen.

## Lineage

Recorded in `.bureau/comps/blend.md`. Three sources, one axis each:

- **Dominant, 55% — Massimo Vignelli.** Axis: structure. A fixed grid, few sizes, rules instead of cards, no decorative containers.
- **Counter, 30% — Giambattista Bodoni.** Axis: type voice. Extreme thick–thin contrast, hairline serifs, uppercase display, italic as emphasis.
- **Accent, 15% — light-and-code installation practice (Moholy-Nagy's light-space work; Reas and Fry's Processing).** Axis: material. A live field of light and a mono readout that states measurements.

The attribution test fails to name one source: the grid is Vignelli's, the voice is Bodoni's, the light is neither. That combination is the point.

## Dials

| Dial | Level | What it means here |
|---|---|---|
| **ENERGY** | 2 | Assertive, not maximal. One acid accent, one ember, one cobalt. No second accent system, no gradient brand. |
| **RHYTHM** | 3 | Varied section shapes: full-bleed hero, asymmetric 12-column heads, a two-column problem spread, a dark film band, a 13-item gallery, a ledger, a footer contact sheet. |
| **MOTION** | 2 | One entrance sequence, scroll-linked progress, section reveals, one continuous shader, one pausable film. No scroll hijacking, no scene per section. |

A page that claims these dials and ships uniform sections, or a scroll scene at MOTION 2, fails its own contract.

## Colour

Dark is the landing theme. The documentation pages carry a theme toggle that switches to the light palette and stores the choice in `localStorage`; no page ships light by default.

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#0B0B0C` | `#F0EEE9` | Ground |
| `--bg-2` | `#101012` | `#F7F5F0` | Raised ground |
| `--surface` | `#151518` | `#FCFAF6` | Panels and ledger |
| `--ink` | `#F1EDE6` | `#161513` | Primary text |
| `--muted` | `#A09A90` | `#5E5A54` | Secondary text |
| `--faint` | `#8A857C` | `#6E6960` | Labels, captions |
| `--line` | `#2A2A30` | `#D8D2C6` | Rules and borders |
| `--line-soft` | `#1D1D22` | `#E4DED2` | Internal dividers |
| `--acid` | `#D6FF3E` | `#4F6B00` | Action, current state |
| `--ember` | `#FF4A1C` | `#B23A2A` | Display accent, marker and progress rule |
| `--blue` | `#4D7CFE` | `#1F5F8B` | Reserved for data visualisation; on the landing it appears only inside the shader |
| `--code` | `#111114` | `#F7F5F0` | Code ground |

Rules: the accent appears at most three times above the fold (kicker dot, primary action, one link). Ember never colours body text. No gradient is used as a brand surface; the only gradient is the hero scrim and the shader output. Every measured token pair is in `.bureau/evidence/contrast.md`; the minimum is 4.5:1.

## Type

| Role | Family | Weight | Size and setting |
|---|---|---|---|
| Display | Bodoni Moda | 400 | `min(22cqw, 304px)`, line-height 0.86, tracking -0.05em, uppercase; 61.6 px at 320, 205 px at 1440 |
| Section head | Bodoni Moda | 400 | `clamp(2.4rem, 5.4vw, 5.6rem)`, line-height 0.92, tracking -0.04em |
| Lead | Bodoni Moda | 400 | `clamp(1.5rem, 3vw, 2.5rem)`, line-height 1.05 |
| Body | Archivo | 300–600 | 16–19 px, line-height 1.55–1.7, measure 44–60 characters |
| Supporting | Archivo | 400 | 12.5–14 px for captions, card notes, gallery descriptions and footer text; never for prose paragraphs |
| Label / mono | JetBrains Mono | 400–500 | 10–14 px, tracking 0.05–0.18em, uppercase for labels |
| Command | JetBrains Mono | 400 | 12–13 px on `--code` |

Three families, each with one job. Accented Latin (ã, ç, é, ñ, á) is covered by the latin-ext subsets. The landing preloads the normal display and text faces and swaps them in; the thirteen templates declare metric-matched fallback faces inline with `size-adjust`, `ascent-override` and `descent-override`.

## Space and structure

- Page maximum 1480 px; inline padding `clamp(1.25rem, 4vw, 4.5rem)`; section rhythm `clamp(4.5rem, 10vw, 9rem)`.
- Twelve-column grid for editorial sections, 2 rem gutters. Hero is two columns, `1fr 320px`, collapsing to one.
- Rules are 1 px `--line` and carry structure; cards are used only where an object needs a boundary (hero ledger, template plates, ledger rows).
- Radii: 0 except the kicker dot, the language pill and the 3 px-bordered phone frames in the gallery (14 px). No soft cards.
- Mobile is composed, not stacked: the header wraps, the nav becomes a wrapped row of full-height links, the hero card is removed, the gallery becomes a single column with captions under the plate, and the 1600 px circuit diagram is replaced by its weight table and a full-size link rather than shrunk to unreadable labels.

## States

- Hover: colour shifts to `--ink` or `--acid` and a 1 px underline appears; no scale on text.
- Focus-visible: 2 px `--acid` outline with offset; never removed.
- Active/current: `aria-current="true"` carries the acid border in the tabs; the landing language switch links to the three documentation roots, so it marks no current page.
- Disabled/empty: none shipped. No form on the landing.
- No-JS: all content visible; the `.js` class gates the entrance, a `noscript` block shows all four install panels and hides the inert tab strip, and the film does not autoplay.
- Reduced motion: transitions reduced to 0.01 ms, reveals at rest, shader drawn once, film never started.
- WebGL failure: `#gl` hidden, the static `--bg`-based gradient fallback remains, no console error escapes.

## Forbidden

- Purple-to-blue gradient as brand; gradient text on a headline; centred pill + H1 + subtitle + two buttons.
- More than one signature move; a second accent system; decorative blur or glass used as a surface.
- Emoji as UI; stock photography presented as product; fake dashboards, fake logos, fake metrics.
- Scroll hijacking; autoplaying audio; motion that continues under reduced motion.
- Type below 10 px for any label; body below 16 px; measure beyond 70 characters.

## Decisions

- **Bodoni at 19 rem on the landing** is a deliberate risk: it is the subject, not decoration. At 320 px it reduces to 6 rem and the wordmark remains one word per line at most.
- **The page ships without analytics.** Recorded in `BUREAU.md`; the cost is an unmeasured conversion, accepted for privacy.
- **Two P2s are accepted:** the 900 px window at 1440 px carries 204 words and the 1920 window carries 177 (VA-BUDGET). Both sit in the gate ledger, where the argument requires the numbers; splitting it would break the comparison. Recorded here rather than waived blindly.
- **Accepted P2s from the jury rounds:** the header is absolute, so there is no persistent navigation on a document of roughly 10,700 px; the gallery is one 3,069 px block with singleton chips; the thirteen demo pages link back only through the browser; the landing language switch opens the documentation roots while the docs switch keeps the current page; the 1600 px circuit diagram is shown whole as a thumbnail with its weights restated in text and a full-size link, rather than scaled to unreadable labels; the film band is an ambient wash rather than a subject; no motion recording or frame-rate measurement ships, so choreography is evidenced by draw counts and source; INP is unmeasured; the scroll layer is one 24 px fade-up applied per block, which the taxonomy names as a tell when it substitutes for an idea — here the hero entrance and the shader carry the identity and the reveal is a single quiet layer, recorded rather than waived silently.
