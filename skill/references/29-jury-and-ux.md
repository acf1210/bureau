# 29 — Jury and Laws of UX

The former percentage-improvement target is replaced by a jury decision. This is an evidence-based review, not proof that every possible defect has been found. Never invent people, agents, independence, evidence or votes. If 10 genuinely independent reviewers are unavailable, the verdict remains pending; simulated personas in one context are not independent jurors.

## Composition

Use 10–15 distinct reviewers, each with a different documented specialty. A 10-member panel can cover creative direction, visual systems, typography, information architecture, interaction, motion, accessibility, frontend engineering, content and research. Add product strategy, responsive design, performance, security or editorial review where relevant. Record the actual reviewer identity, specialty, independence and conflicts. Reviewers must not have built the work they judge. Every member reviews every gate and every principle, not only their specialty.

## Review and correction loop

1. Freeze the brief, project revision, device states, content and evidence. Assign each reviewer all 10 gate categories and all 30 principles in `scripts/lib/jury.mjs`, a snapshot of [Laws of UX](https://lawsofux.com/) checked 2026-10-26. Before a new review, compare the current source index and update the snapshot when it changes; do not silently omit new principles.
2. Each reviewer independently records a `pass` or `fail` for each category and principle, rationale, evidence and an actionable criticism. A principle may be `na` only with a specific reason and evidence; gate categories cannot be `na`. A hypothesis is not a universal law or a substitute for usability testing. Do not impose arbitrary numbers such as seven menu items as accessibility rules.
3. Any `fail`, missing vote, unresolved finding, missing evidence or incompatible design blocks closure. Record the defect, owner and fix; correct the source, capture fresh evidence and restart every gate and every juror's complete review against the new revision. Do not merely change the failed vote. A change to source invalidates the jury record by hash.
4. Close only when all applicable checks pass unanimously, all non-applicability decisions are justified, all findings are resolved, evidence exists, the Delivery Gate is clean and the existing Tribunal accepts. When blocked by unavailable reviewers, data or an unfixable conflict, preserve the findings and report pending; do not claim completion.

## Machine record

Run `node "$BUREAU_DIR/scripts/review.mjs" --jury-init` to create `.bureau/review/jury.json` with ten empty reviewer slots and every vote pending. It refuses to overwrite an existing record. Add up to five slots if needed. Each member has a unique `id`, unique `specialty`, an `independent` explanation, and two objects: `categories` and `laws`. Each object must have every required identifier and no unknown identifiers. Each vote is `{ "result": "pass", "reason": "specific observation", "evidence": "path/to/evidence" }`; for a non-applicable law only, `result` may be `na` with an explanation. Use `fail` during work to record dissent; final validation rejects it. `issues` is an array of findings, each with `status: "resolved"`, `description`, `fix` and `evidence` only after a verified fix. Actual evidence must exist on disk. The script validates structure and existence, not the honesty or quality of judgment.

The 10 category identifiers are the gate IDs in `GATE_ORDER` from `scripts/lib/gates.mjs`; the 30 law identifiers are `UX_LAWS` from `scripts/lib/jury.mjs`. Read the current source hash from a completed gate's `sourceHash` in `.bureau/review/state.json`. It is a SHA-256 content hash over the declared source files, not a git commit, so it identifies a revision of the working tree even when nothing is committed. A source change requires rerunning all gates and the complete jury before `--final`.

```bash
node "$BUREAU_DIR/scripts/review.mjs" --final --tribunal .bureau/review/tribunal.json
```

The validator refuses a missing, incomplete, dissenting or stale jury. It cannot verify that reviewers are genuinely independent, inspect the substance of an evidence file, detect an unreported defect or guarantee legal/accessibility conformance; a human must do so.
