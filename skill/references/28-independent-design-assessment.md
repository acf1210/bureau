# 28 — Independent design assessment

This assessment measures the quality of a design against its brief using a BUREAU research rubric. It is independent of award scoring and of the BUREAU review circuit: use separate reviewers and a separate scorecard. It does not replace the circuit's accessibility, truth, performance or release gates, and it is not a validated prediction of business success.

## 1. Prepare a fair comparison

Freeze the brief, content, target tasks, devices, locale, constraints and acceptance criteria. For a version comparison, produce one baseline and one candidate for every brief under the same model, tools, time and resources. Preserve failures and unfinished outputs. Assign anonymous labels, randomize presentation order, and give reviewers identical materials. Reviewers must not have built either output or know its version; if that is impossible, label the assessment non-independent and do not claim independent results.

Recruit at least two independent reviewers with relevant design and accessibility experience. Score individually before discussing differences. If possible, include representative users in task observations; do not count the reviewers' opinion as user-test evidence. Record reviewer roles, conflicts, brief identifiers, version hashes, dates, devices, task scenarios, and exact evidence paths. Resolve a disagreement of two or more points on any criterion by recording the disagreement and a third independent review or a documented joint adjudication; retain the original scores.

## 2. Collect evidence

- Inspect the actual working output at mobile and desktop, including core tasks, keyboard and reduced-motion states. Capture screenshots and interaction notes at matched states.
- Test the primary task with representative participants when available; record task instructions, success, errors and limitations. If unavailable, mark user-task evidence missing rather than inventing it.
- Record relevant contrast, accessibility, responsive and performance checks with their environment and limitations. Automated checks support, but cannot replace, manual inspection.
- Review the brief, actual content, sources and permissions. Judge the work before seeing detector scores, and record uncertainty where the evidence is insufficient.

## 3. Score five dimensions

Each reviewer assigns one integer from 0 to 4 per dimension. Each dimension has equal weight: `score = 5 × sum(dimension scores)`, yielding 0–100. Use the same anchors for every brief. Score only what can be inspected; missing evidence means **unassessed**, never zero. A missing dimension makes the total unassessed.

| Dimension | What to assess | Required evidence |
|---|---|---|
| Clarity | The purpose, hierarchy and next action are understandable for the intended audience. | Brief, first viewport and primary task. |
| Visual craft | Typography, composition, color, imagery and responsive states form a coherent system. | Matched mobile and desktop views, type and contrast checks. |
| Originality and fit | The concept has a specific relationship to the subject and avoids recognizably copying a reference. | Brief, lineage and working output. |
| Interaction and inclusion | Tasks, feedback, keyboard operation and reduced-motion alternatives work for the intended audience. | Task observations, keyboard and reduced-motion checks. |
| Content and integrity | Copy is useful and accurate; claims and media rights are evidenced. | Content, claim ledger and source or license record. |

| Score | Anchor |
|---:|---|
| 0 | The dimension fails its essential purpose or is contradicted by evidence. |
| 1 | Major defects prevent the dimension from consistently serving the brief. |
| 2 | The basic purpose is met, with material defects or generic execution. |
| 3 | The dimension works consistently with minor, documented defects. |
| 4 | The dimension is distinctive, well resolved and supported by evidence across relevant states. |

Each score needs an observation, evidence path and smallest actionable improvement. Average completed reviewer totals for the output; do not infer a reviewer score from automated findings. Report each dimension and reviewer separately, the average, spread and unresolved disagreement. Hard failures remain separate: a high average never waives a P0, inaccessible task or fabricated claim.

## 4. Compare versions and interpret the target

For each brief, compute candidate total minus baseline total, then report the mean paired change, each paired result, number of briefs, number of reviewers and exclusions. Calculate relative improvement as `(candidate mean − baseline mean) / baseline mean × 100`; it is undefined when the baseline is zero. A relative gain of 50% requires `candidate mean ≥ 1.5 × baseline mean` and cannot be reached on a 0–100 scale when the baseline exceeds 66.67. Do not silently substitute percentage points or a reduction of the remaining gap.

Before the experiment, specify the sample and analysis. For a small or convenience sample, describe it as exploratory; do not generalize to all projects. When feasible, report uncertainty using a paired bootstrap over briefs and explain its limitations. Do not claim a 50% improvement unless the documented results support it; if reviewers, briefs, access or evidence are missing, the result is pending or inconclusive.

## 5. Deliverable

Use `assets/studio-templates/independent-assessment.md` for each reviewer and output. Deliver the scorecards, evidence, anonymization and sampling method, paired comparison, unresolved risks and hard-failure results. Keep private client material in an approved location.
