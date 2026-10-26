# Motion study — replace with interaction

## Intent

- User action and meaning of feedback: TODO
- Start, intermediate, end and interrupted states: TODO
- Duration, easing and animated properties: TODO
- Reduced-motion and no-JavaScript states: TODO

## Production

- Implementation and dependency rationale: TODO
- CPU, GPU and asset budgets: TODO
- Pause, cleanup and context-loss behavior when applicable: TODO
- Evidence paths for recording, screenshots and measured performance: TODO

## Review

Render at the same viewport and state after each change. Verify input can interrupt the transition, focus remains visible and the final state communicates without motion. Record device, browser, observed results and unresolved limits; do not infer frame rate from a screenshot.
