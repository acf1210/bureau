# 30 — Five-source reference survey

The design engine sets its pattern and its departure from a survey of three to five verified references (three in Standard and Fast, five in Signature), drawn from the 25 requested sources in `scripts/lib/sources.mjs`. The survey comes before the blend (`23-lineage-and-blend.md`): the canon gives the design its lineage; the survey shows what the category does now, so the concept can use the convention where it helps and depart from it where the brand needs its own move. Gate 1 refuses to open without a complete survey.

## 1. Queue

```bash
node "$BUREAU_DIR/scripts/survey.mjs" --init --need <need> --probe
```

`--need` orders the queue: sources that fit the brief come first, then every other source, so a failed source always has a successor. Needs: `general`, `landing`, `saas`, `interactive`, `product`, `editorial`, `minimal`, `dark`, `experimental`, `portfolio`. `--probe` checks each queued source's `robots.txt` in order, skips one that is unreachable or redirects to another host, and stops once seven reachable sources are queued; it reads no project content. Without `--probe` nothing is fetched.

The queue is pre-filled with skips that do not depend on the network: Canvas is unidentified, and Goodbrief generates fictional briefs, which show no shipped work. "Pintura / Hover Statues" is Hover States (hoverstat.es), as confirmed by the requester. UX Archive (uxarchive.com) is a probable match only and returned a Cloudflare error page on 2026-10-27; confirm a probable identity before you verify it.

## 2. Verify in order; on failure, move on

Work the queue from the top. For each source, open one project page that fits the brief, not the gallery home, and record it:

| Field | Content |
|---|---|
| `status` | `verified`, or `skipped` with `reason` (20+ characters: what failed and when) |
| `url` | the project page itself (the live site where possible) |
| `accessedAt` | ISO date of the visit |
| `lens` | `visual`, `interaction`, `structure` or `flow` |
| `observation` | what the project does, observed at a named viewport and state |
| `principle` | the transferable rule behind it, in your own words |
| `avoid` | what must not be taken: identity, code, imagery, copy, exact layout |

A source that cannot be verified (login wall, paywall, redirect to another service, no relevant project, terms that forbid the use, a dead page) is marked `skipped` with the reason, and the next source in the queue is taken. Continue until the target is verified: three in Standard and Fast, five in Signature. A pending source ahead of the last verified one is a validation error: skip it with a reason or verify it. That rule turns "move to the next one" into a record and stops quiet cherry-picking.

The verified entries come from different sources and cover at least three of the four lenses.

## 3. Synthesis: pattern and departure

| Field | Content |
|---|---|
| `pattern` | the convention at least three verified references share, named precisely ("fixed index column beside one reading measure", not "clean layout") |
| `patternSources` | the ids of the three or more sources that show it |
| `creative` | the constructive departure: which part of the pattern this project keeps because users rely on it, and which part it replaces with a move only this brand can own |
| `avoid` | what no reference may lend |

The pattern is a baseline of expectations (Jakob's law), not a template. The departure must be traceable to the brief and must survive the attribution test in `23-lineage-and-blend.md`: if a reviewer can name the gallery entry it came from, it is a copy. Write the blend next; one blend ingredient may answer the survey's pattern, never repeat it.

```bash
node "$BUREAU_DIR/scripts/survey.mjs" --check
```

`--check` exits 1 until the survey is complete. It validates structure, order, distinct sources, project URLs, dates, lenses and synthesis; it cannot verify that a page was really visited or that an observation is accurate. A reviewer at Gate 1 opens at least two of the verified URLs.

## Limits

A gallery listing is evidence of a design choice, not of its performance (`27-design-intelligence.md`). Respect each source's terms, account limits and rate limits; never crawl a gallery, bypass access controls or reproduce protected work. Tools for capturing the one page per source are in `33-reference-acquisition.md`. If fewer than the target can be verified, the survey stays incomplete and Gate 1 stays closed; do not invent entries or reuse one source twice.
