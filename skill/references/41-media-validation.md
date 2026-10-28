# Media validation

> The detector sees structure. A person sees the photograph. Both are required,
> and neither may pretend to be the other.

## 1. Two layers, one verdict

| Layer | What it checks | Tool |
|---|---|---|
| Mechanical | Media present, poster, provenance, licence attribute, vector-hero and gradient/blur habits | `scripts/realism.mjs`, `scripts/audit.mjs` |
| Human | Anatomy, geometry, material, light, optics, perspective, continuity, authenticity | Rendered screenshots and film frames, read at 100% |

A clean mechanical report is not a realism pass. A human pass without the
mechanical check is not a pass either: the provenance may be invented.

## 2. What to capture

For every page with media:

- The hero at 1440, 768 and 390, loaded and at rest.
- Every image at its rendered size, 100% crop of the subject.
- The film at 0%, 50% and 100% of its duration, plus the poster.
- The section with the densest media, to judge continuity.
- The page with images blocked, to see what the layout says without them.

Store under `.bureau/evidence/media/`. Name files by section and viewport.

## 3. The inspection pass

For each asset, answer in writing. One line per answer is enough.

1. **Subject** — what is it, and could it exist as shown?
2. **Anatomy** — hands, eyes, teeth, hair, fabric folds, joints.
3. **Geometry** — edges, intersections, parallels, contact points.
4. **Material** — skin, metal, glass, stone, textile: does the surface react to
   light like the material it claims to be?
5. **Light** — one direction, one temperature, shadows consistent.
6. **Optics** — depth of field matches the claimed lens and distance.
7. **Perspective** — horizon and vanishing points agree between elements.
8. **Imperfection** — is there any evidence of the physical world?
9. **Continuity** — does it belong with the assets beside it?
10. **Use** — is it doing an informational or emotional job, or decorating?

Any 1-2 is a replacement. A 3 is a fix with a named cause. A 4-5 ships.

## 4. Scoring and evidence

Record in `.bureau/evidence/media-review.md`:

| Section | Asset | Score | Weakest criterion | Action | Evidence |
|---|---|---|---|---|---|
| Hero | `media/atelier-hero.avif` | 4 | optics: background too sharp for 85 mm | reshoot at f/2 | `media/hero-100.png` |

The score is not added to the design score. It gates the asset: an asset below 3
cannot ship, and a section with no usable asset goes back to direction.

## 5. False positives to avoid

The mechanical checks must not fire on:

- A logo or wordmark in SVG.
- A functional icon set.
- A data graphic, map, plan or technical diagram.
- A chart rendered in SVG or canvas with a text alternative.
- A small decorative rule or geometric divider.
- A product interface (buttons, forms, dashboards) that is not a photograph.

The vector-hero check ignores `role="img"`, `role="graphics-document"` and
`aria-hidden` SVGs, and only fires when the page has no photograph or film at
all. The gradient check only fires on a hero background with no media anywhere
on the page.

## 6. When media cannot be validated

Say so. A missing browser, a missing codec, a film that cannot be decoded, an
asset the reviewer cannot open: record the limitation, mark the asset
unverified, and do not claim a realism pass. An unverified asset is not a fail
by itself, but it cannot carry the page.

## 7. Handoff

The review returns:

- the mechanical report path,
- the screenshot and frame set,
- the per-asset score table,
- the list of replacements and reshoots,
- the limitations.

That is enough for the next agent to continue without re-deciding the art
direction or re-litigating an asset that already failed.
