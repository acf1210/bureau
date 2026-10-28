# 29 — Jury and Laws of UX

The former percentage-improvement target is replaced by a jury decision. This is an evidence-based review, not proof that every possible defect has been found. Never invent people, agents, independence, evidence or votes. If 10 genuinely independent reviewers are unavailable, the verdict remains pending; simulated personas in one context are not independent jurors.

**When a jury is required.** Only **Signature** mode convenes a jury. **Standard** runs all ten gates with a single named Tribunal and no jury; **Fast** runs six gates with no jury. The panel below applies when the project is Signature, or when a Standard project chooses to convene one voluntarily. A Standard project that wants an Award judgement must switch to Signature with `review.mjs --mode signature` and complete the panel.

## Composition

Use 10–15 distinct reviewers, each with a different documented specialty. A 10-member panel can cover creative direction, visual systems, typography, information architecture, interaction, motion, accessibility, frontend engineering, content and research. Add product strategy, responsive design, performance, security or editorial review where relevant. Record the actual reviewer identity, specialty, independence and conflicts. Reviewers must not have built the work they judge. Every member reviews every gate and every principle, not only their specialty.

## Ten-minute loop

The jury loop is time-boxed. It runs for at most **10 minutes** from `--jury-start`; rounds recorded after that are refused, and the decision is the **best-scoring round recorded inside the window**. A round's score is the share of applicable votes that pass (`na` excluded), 0–100. A tie goes to the later round. Preparation happens before the clock starts; only voting and correction run inside it.

1. **Prepare the evidence pack (clock not running).** Freeze the brief, the revision, device states and content. Run every capture once: `audit.mjs --json`, `visual-audit.mjs --full`, the divergence report, the Delivery Gate and the gate scorecards. Jurors read this pack; they do not re-run tools. Assign each reviewer all 10 gate categories and all 30 principles in `scripts/lib/jury.mjs`, a snapshot of [Laws of UX](https://lawsofux.com/) checked 2026-10-26; compare the source index before a new review and update the snapshot when it changes.
2. **Start the clock.** `review.mjs --jury-start` records the start and the deadline.
3. **Vote in parallel.** Dispatch every juror at once, each in its own context, each writing its own file in `.bureau/review/jurors/<id>.json` (same shape as one entry of `members`). Separate files let jurors write concurrently without a merge; when the folder has files, they replace `members` in `jury.json`. Each juror records `pass`, `fail` or `na` for every category and principle with a rationale, evidence from the pack and, on a `fail`, the smallest fix. Read the pack for the whole page first, then vote by principle; do not reopen tools for a vote the pack already answers.
4. **Score the round.** `review.mjs --jury-round` validates the votes, scores them against the current source hash and stores the round with its duration. Unanimous: stop and finalize.
5. **Correct once per round.** Fix the most-failed votes together in one revision, record each finding in `issues`, refresh only the parts of the pack the fix changed, replay the gates with `review.mjs --regate` (the fix changed the source hash; update a gate's score file first if the fix touched its judgment), and have every juror re-vote on the new revision (a source change invalidates earlier votes by hash). Do not merely flip a failed vote.
6. **Stop on time.** `--jury-round` reports the time left; when the last round took longer than the time remaining, do not start another. `--jury-status` shows the time left and the best round.

If 10 genuinely independent reviewers are not available inside the window, there is no round and the verdict remains pending; never fill the panel with simulated personas.

### Decision

`--final` reads the best round inside the time box. The delivered source must be that round's revision: if a later fix scored lower, restore the best revision or record a better round before the deadline. A unanimous best round, with every finding resolved, lets the verdict stand. A best round with dissent is still the decision, but it caps the verdict at **conditional** and lists the dissenting votes; release then needs written acceptance. A rejected or late round never wins.

## Machine record

Run `node "$BUREAU_DIR/scripts/review.mjs" --jury-init` to create `.bureau/review/jury.json` with ten empty reviewer slots, every vote pending, `loop: null` and no rounds. It refuses to overwrite an existing record. Add up to five slots if needed. Each member has a unique `id`, unique `specialty`, an `independent` explanation, and two objects: `categories` and `laws`. Each object must have every required identifier and no unknown identifiers. Each vote is `{ "result": "pass", "reason": "specific observation", "evidence": "path/to/evidence" }`; `result` may be `fail`, and for a law only `na` with an explanation. `issues` lists findings, each with a `description`; a resolved one adds `status: "resolved"`, `fix` and `evidence`. Actual evidence must exist on disk. Each round stores `n`, `sourceHash`, `closedAt`, `seconds`, `score`, `passes`, `applicable`, `unanimous`, `fails`, `issues` and a snapshot of the members. The script validates structure, existence, timing and the score against the votes, not the honesty or quality of judgment.

The 10 category identifiers are the gate IDs in `GATE_ORDER` from `scripts/lib/gates.mjs`; the 30 law identifiers are `UX_LAWS` from `scripts/lib/jury.mjs`. Read the current source hash from a completed gate's `sourceHash` in `.bureau/review/state.json`. It is a SHA-256 content hash over the declared source files, not a git commit, so it identifies a revision of the working tree even when nothing is committed. A source change requires rerunning all gates and a new jury round before `--final`.

```bash
node "$BUREAU_DIR/scripts/review.mjs" --final --tribunal .bureau/review/tribunal.json
```

The validator refuses a jury with no loop, no round, late rounds, incomplete votes or a best round from another revision; dissent in the best round caps the verdict at conditional. It cannot verify that reviewers are genuinely independent, inspect the substance of an evidence file, detect an unreported defect or guarantee legal/accessibility conformance; a human must do so.
