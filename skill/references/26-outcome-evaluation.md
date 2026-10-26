# 26 — Evaluate outcomes on real briefs

Use this protocol to compare BUREAU versions. Automated audits establish a floor; they cannot prove design quality or a higher rate of accepted work. Choose the outcome measure before the comparison; quality scores and client approval rates are different measures.

## Design quality comparison

When the objective is to improve design quality using Awwwards as a reference, evaluate matched outputs independently across design, usability, creativity and content. As a reproducible **BUREAU research rubric**, score each dimension 0–10 using evidence, then calculate `quality = 0.40 × design + 0.30 × usability + 0.20 × creativity + 0.10 × content`. These proportions are displayed on [an Awwwards project scorecard](https://www.awwwards.com/sites/peden-munk); this internal score is not an official Awwwards jury score, award or endorsement. Check the award's current criteria separately before any submission.

| Dimension | Evaluate | Evidence |
|---|---|---|
| Design | Hierarchy, typography, composition, visual direction and consistency across viewports. | Screenshots, type specimen and decision rationale. |
| Usability | Task completion, navigation, responsiveness, keyboard and accessibility. | Task observations, screenshots and accessibility checks. |
| Creativity | Concept specificity, originality and meaningful interaction. | Brief, competing directions, working interaction and lineage. |
| Content | Clarity, relevance, structure and truthful, sourced claims. | Real content and claim ledger. |

Predefine scoring anchors and pass/fail rules before reviewing. Use the same briefs, model, inputs, time, tools and reviewers for baseline and candidate; randomize order and blind reviewers to version when possible. Record each dimension, reviewer, score, evidence, disagreement and limitations. BUREAU hard failures and accessibility requirements remain independent vetoes; do not average them away.

For a relative 50% quality-score increase, require `new quality ≥ 1.5 × baseline quality`, calculated from the mean of matched briefs. Report both scores, absolute point change, relative change, per-brief results and uncertainty. On a 0–10 scale, this target is impossible if baseline exceeds 6.67; if baseline is zero, relative change is undefined. Do not replace this target with a 50% reduction in the remaining gap to 10 without explicitly agreeing to that different metric. A small sample or unavailable independent review must be reported as inconclusive. Never report the goal as achieved before collecting the paired results.

## Define the comparison before running it

1. Select real, permissioned briefs and freeze their inputs, acceptance criteria and evaluation date. Preserve the range of surfaces, languages and constraints; record excluded briefs and why.
2. Run both versions on each brief with the same model, tools, budget, time limit and input access. Record versions and deviations. Randomize run order where possible; avoid carrying artifacts from one run into the other.
3. Have reviewers who did not build the work evaluate anonymized outputs against the same predeclared criteria. Record each independent verdict and evidence, and resolve disagreements by a documented method. Never call a self-review independent.
4. Count every eligible brief, including failures, incomplete work and timeouts. A pass requires the brief's agreed criteria and the BUREAU hard-failure floor. Store verdicts, evidence paths, limitations and the raw counts.

## Optional: report the client approval rate honestly

For each version, approval rate = approved briefs / eligible briefs. The relative change is `(new rate - baseline rate) / baseline rate`; report percentage points separately. A 50% relative increase means the new rate is at least 1.5 times the baseline, not 50 percentage points higher. If baseline is zero, relative change is undefined. If baseline is above two thirds, a 50% relative increase is mathematically impossible.

Report paired outcomes (both pass, old only, new only, neither), counts, rates and uncertainty. Small samples may be inconclusive even when the point estimate reaches the target. Do not treat generated demos, audit scores, simulated briefs or screenshots as evidence of customer approval. Do not cherry-pick successful runs or claim the target was met without the underlying evaluations.

## Evidence record

| Field | Record |
|---|---|
| Brief | Identifier, source, permission, frozen inputs and acceptance criteria |
| Run | Skill version, model, tools, limits, order, timestamps and artifact paths |
| Review | Reviewer independence, rubric, verdict, evidence and disagreement resolution |
| Result | Pass/fail, failure reason, eligible denominator and deviations |

Keep confidential briefs and evaluation records in an approved location. Redact sensitive information from public reports. If no suitable baseline or reviewers exist, report the evaluation as pending and identify the missing evidence.
