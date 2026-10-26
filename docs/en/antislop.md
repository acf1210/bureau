# Anti-AI-slop

Slop is not "made by AI". It is **the average of the internet reproduced without a decision**. The antidote is not more design; it is specificity.

![From signal to gate](../assets/diagrams/antislop.svg)

## The three-second test

Show the first viewport for three seconds. Ask:

1. Could this be any AI startup from 2023–2026?
2. Is the brand identifiable without the logo?
3. Is there one element that could only belong to this subject?
4. Does the copy say something falsifiable or specific?
5. Is the motion doing a job, or performing "premium"?

Three or more "no" answers → slop, regardless of polish.

---

## Taxonomy

| ID | Tell | Fix |
|---|---|---|
| **BS-C01** | centered hero: pill + H1 + gray subtitle + two buttons + gradient | commit to object, stage, split argument, index, or live proof |
| **BS-C02** | three equal icon cards | hierarchy, comparison, ledger, sequence, or one deep proof |
| **BS-C03** | 01/02/03 sections with no real sequence | number only when order matters |
| **BS-C04** | bento by fashion | only if content is modular and unequal |
| **BS-C05** | every section the same height | density map |
| **BS-C06** | cards inside cards | flatten; use lines, space, typography |
| **BS-C07** | 24px radius on everything | a radius family tied to the world |
| **BS-C08** | everything centered | dominant column + asymmetric weight |
| **BS-C09** | giant footer wordmark + four columns | footer as closing argument |
| **BS-C11** | template drift: scaffold favicon, easing and footer survive | new blend; `divergence.mjs` ≤ 0.35 |
| **BS-C12** | tribute act: one designer or site is recognizable | three sources on three axes |
| **BS-C13** | eyebrow: inert type above a heading that only announces it | delete it; keep only a fact (date, place, figure) |
| **BS-C14** | stock anatomy: hero, three features, steps, logo bar, email band | the sections real sites in the category have |
| **BS-C15** | stock close: email sign-up at the end when the job is not subscription | end on the job: booking, buy box, next date |
| **BS-C16** | echo: one fact repeated in four or more sections | say it once, where it works |
| **BS-T11** | accented word in the headline | the whole head one way |
| **BS-T12** | mono as costume on labels | body face, a step smaller |
| **BS-K11** | thick side stripe on cards | hairline, ground shift, weight |
| **BS-K12** | hard offset block shadow | offset and blur, or lightness steps |
| **BS-W13** | template punctuation `A · B · C` | line breaks, columns, a sentence |
| **BS-W14** | fake send: success with no request | wire it, or say nothing was sent |
| **BS-B11** | content hidden at rest without `.js` | visible by default |
| **BS-E10** | in-page link to a missing section | a real id, or no link |
| **BS-A13** | ARIA or label reference to a missing id | fix the reference |
| **BS-E11** | browser surfaces unthemed | selection, caret, focus from the palette |
| **BS-T01** | Space Grotesk + Inter | display with its own voice |
| **BS-T02** | display in the default UI font | own role and face |
| **BS-T03** | uppercase micro-label above every section | labels only when informative |
| **BS-T04** | body at 11–12px | 16px for prose |
| **BS-T05** | 8 sizes without a scale | use the scale |
| **BS-T06** | gradient text | never |
| **BS-T07** | 100ch paragraphs | 65–75ch |
| **BS-K01** | purple/indigo gradient as the brand | material and story first |
| **BS-K02** | gradient text | never |
| **BS-K03** | pure #000 and #fff | tint both |
| **BS-K04** | glass + glow + grain as a recipe | choose one material |
| **BS-K05** | six accents with no roles | 5–7 semantic roles |
| **BS-K06** | accent 10× above the fold | ≤ 3 intentional uses |
| **BS-M01** | fade-up everywhere | one entrance, then quiet |
| **BS-M02** | `transition: all` | named properties |
| **BS-M03** | hover scale 1.05 on every card | one interaction signature |
| **BS-M04** | infinite loops with no pause | one loop, pause, reduced motion |
| **BS-M05** | parallax on every layer | one depth story |
| **BS-M06** | scroll hijack | sticky with free scroll |
| **BS-M07** | reduced motion ignored | design the mode |
| **BS-M08** | video with autoplay audio | muted, inline, pausable |
| **BS-W01** | empower, seamless, elevate, unlock, supercharge | concrete outcome + number |
| **BS-W02** | lorem ipsum | never in production |
| **BS-W03** | "99.9% uptime" with no source | link proof or cut |
| **BS-W04** | logoipsum / placeholder | licensed, art-directed asset |
| **BS-W05** | testimonial with a stock face | real quote with consent |
| **BS-W06** | "we're excited to announce" | say what shipped and why |
| **BS-W07** | three adjectives in a row | one claim + proof |
| **BS-W08** | "Get started" everywhere | name the action |
| **BS-W09** | copy that describes the category | describe the mechanism and outcome |
| **BS-W10** | emoji as bullets | icon system |
| **BS-I01** | emoji as product icons | custom set |
| **BS-I02** | random Unsplash | directed, licensed asset |
| **BS-I03** | plastic skin, impossible hands, fake text | regenerate, crop, composite |
| **BS-I04** | fake dashboard with the same chart | real product or diagram |
| **BS-I05** | invented company logos | real customers with permission |
| **BS-B01** | native cursor hidden | keep the cursor |
| **BS-B02** | body scroll locked | only inside a modal with escape |
| **BS-B04** | `div onclick` as a button | `<button>` |
| **BS-B05** | marquee with no pause | pause + reduced motion |
| **BS-E01** | `console.log` in production | remove |
| **BS-E06** | no viewport meta | add it |
| **BS-E07** | no `lang` | add the locale |
| **BS-E08** | images without dimensions | reserve space |

Full taxonomy: `skill/references/17-anti-ai-slop.md`.

---

## P0 — blocks G8

- **BS-K02** gradient text.
- **BS-W02** lorem ipsum.
- **BS-M07** reduced motion ignored.
- **BS-M08 / BS-B08** autoplay audio.
- **BS-A01** image without alt.
- **BS-A02** focus removed without replacement.
- **BS-A03** zoom disabled.
- **BS-B04** div as a button.
- **BS-E06** no viewport.
- Any fabricated proof.

One P0 can define the page. No average saves it.

---

## Binding tiers

| Tier | Severity | Waiver |
|---|---|---|
| **Floor** | P0 | never; a line waiver on a P0 is rejected (BS-E12) |
| **Reflex** | P1 | rule ID + a reason of 20+ characters about this page |
| **Finish** | P2 | answered in `refinement.md`, never blocks |

```html
<!-- bureau-ignore BS-K11: the red stripe marks overdue rows in the ledger -->
```

More than three waivers of one rule is a house style (BS-E13): record it in `DESIGN.md`. The audit JSON lists every waiver in `waivers`.

**Purpose test:** would we choose it if no model had suggested it? If the reason needs more than one line, it is not a reason.

## Render tier

| Check | Tier | Threshold |
|---|---|---|
| VA-OVERFLOW | Floor | no horizontal scroll 320–1920 px |
| VA-CONTRAST | Floor | 4.5:1 body, 3:1 large |
| VA-FOLD | Reflex | at ≥ 1024 px the h1 and first action end above the fold |
| VA-BUDGET | Finish | about 80 words per 900 px window at ≥ 1280 px |
| VA-HEAD | Finish | a head sits closer to what it heads than to what precedes it |

## Liveliness

A clean page is not a good page. Declare three dials in `DESIGN.md` and match them:

| Dial | 1 | 2 | 3 |
|---|---|---|---|
| **ENERGY** | quiet | confident | experimental |
| **RHYTHM** | uniform | a few breaks | asymmetric |
| **MOTION** | state changes | one entrance | choreography |

RHYTHM 3 with uniform sections fails. A page with no direction is a *draft without direction* (1 / 1 / 1), not a deliverable.

## Detector

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

The detector covers the mechanical. It does not judge:

- composition;
- originality;
- truth;
- talent;
- whether the signature is memorable.

That is what the circuit is for.

### Suppression

Only suppress a proven false positive:

```html
<!-- bureau-ignore BS-K01: brand-mandated gradient, approved in DESIGN.md -->
```

`audit.mjs` respects the current and previous line, plus a `bureau-ignore-file` header.

---

## Copy: lexicon and replacements

| Slop | Write |
|---|---|
| Empower your team | Give your ops lead a 10-minute close |
| Seamless integration | Syncs with HubSpot in one OAuth step; no CSV |
| Elevate your brand | Rebuild the identity in 6 weeks, with a design system |
| Unlock insights | See which 3 accounts are about to churn, this morning |
| Supercharge workflows | Cut the invoice run from 4 hours to 12 minutes |
| Next-generation platform | Runs on Postgres 16; deploys in 90 seconds |
| Cutting-edge AI | A retrieval model that cites the source paragraph |
| Trusted by industry leaders | Real logos + one named case study |
| World-class support | 2-hour response, Mon–Fri, by a human engineer |

Rules:

- one claim per sentence;
- verb > adjective;
- numbers need sources;
- name the mechanism;
- read it aloud.

---

## The cure: specificity

Ask in every section:

1. What is the one idea?
2. Why this layout, not the default?
3. What is the evidence?
4. What would a competitor have to change to use this?
5. What would we cut if we had to remove 30%?

If the answers are weak, the section is not ready.

---

## Exceptions

A "tell" can be legitimate when it is the concept:

- purple gradient for a brand about synthetic light;
- three cards when there are genuinely three equal choices;
- a dark theme, if it is lit, not inverted;
- a custom cursor, if it is precise, optional, and accessible;
- a centered hero, if type and material earn it.

The rule is not "never use a pattern". It is **never use it without a reason you can defend in public**.

---

## G8 evidence

- `audit.json` with zero unresolved P0.
- `copy-review.md` with claims and sources.
- screenshots of every section.
- a list of exceptions with rationale.
- a final read as a stranger.

G8 passes at **≥ 3.5/5** and zero P0.
