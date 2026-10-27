# Lineage — Pólvora (`showcase/pyrotechnics`)

A showcase model: design first, performance last. It is a worked example of a blend (`skill/references/23-lineage-and-blend.md`), not a template to copy.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Josef Müller-Brockmann, Tonhalle concert posters and *Grid Systems in Graphic Design* (1981) | The modular grid as objective order; music drawn as structure | Grid | The show is a score: five shells by sixteen beats, one module for every metal card | His poster compositions |
| Counter 30% | Herb Lubalin, *Avant Garde* magazine (1968–71) | Letters set tight until the word becomes an image | Display voice | PÓLVORA set at −0.075 em over the film, loosening as the film scrolls away | The Avant Garde logotype |
| Accent 15% | Saul Bass, title sequences (1958–59) | Motion that cuts instead of fading | Motion | Letters cut in one beat apart; finale cues cut on the second; beats flash on the playhead | His cut-paper figures |

- **Tension:** Müller-Brockmann's cool grid against fire that has no edges.
- **Subject-only ingredient:** the colour of a star is chemistry: strontium, sodium, barium, copper, magnesium, each named with its emission.
- **Signature move:** the composer fires every rocket early by its climb time, so the shell breaks on the beat; the same engine rendered every film on the page.
- **Dials:** ENERGY 3 / RHYTHM 3 / MOTION 3. Loud everywhere; one switch pauses all of it.
- **Technological proof:** `pyro.js`, a deterministic fireworks engine (sphere-projected stars, crossette splits, drag and gravity, lit smoke, a quarter-resolution reflection); `scripts/render-showcase-video.mjs` renders it frame by frame to H.264 with a crossfaded seamless loop; the finale is fetched whole so scrubbing works on hosts that ignore range requests.

## Video and motion

| Film | Size | Use |
|---|---|---|
| `hero.mp4`, `hero-portrait.mp4` | 1600×900, 720×1280, 12 s loop | the opening, wide or tall by the screen's shape |
| `peony`, `willow`, `ring`, `crossette`, `chrysanthemum` | 640×640, 4.2 s | one card per metal, played only while on screen |
| `finale.mp4` | 960×540, 10 s, a keyframe every 4 frames | scrubbed by the scroll through a 420 vh section |

Every film is muted, inline, never autoplayed from markup, and stopped by **Pause motion** (and by reduced motion, which starts paused with posters showing).

## Mobile composition

The tall film replaces the wide one; each metal becomes a row with its film beside its numbers; the finale drops the cue list and keeps the timecode and cue title; the score folds to eight beats.

## Fingerprint

| Dimension | This model |
|---|---|
| Faces | Dela Gothic One + Onest |
| Palette | night `#0B0A10`, magnesium `#F4F1EA`, strontium `#FF464E`, sodium `#FFBA48`, barium `#68E88C`, copper `#7C9DFF` |
| Easing | `cubic-bezier(.12,.9,.24,1)` and `steps(1,end)` for cuts |
| Favicon | a six-colour star burst on night |

## Priorities

Design leads every decision here. The page spends bandwidth on video, GPU time on live rendering and large type freely; it still keeps the floor: real contrast, a keyboard path, a switch that pauses all motion, reduced motion designed as stills, all copy readable without JavaScript, and nothing that pretends to send.
