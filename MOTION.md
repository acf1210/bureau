# MOTION — the BUREAU site (Proof)

> Research: `.bureau/research/motion.json` (five Awwwards Sites of the Day: FORMAT, Heron AI, A24, Signal-A, OFFF Forum). Shared pattern: one object carries the transition between two states. Departure: our one object is a page under review.

## Primitives

| Name | Duration | Easing | Use |
|---|---|---|---|
| `register` | 900 ms | `cubic-bezier(.22,.9,.18,1)` | the three plates slide from misregistration into register over the sheet |
| `stamp` | 0 ms, 180 ms apart | `steps(1)` | each mark appears at once, in severity order (a pencil does not fade) |
| `lead` | 320 ms | `cubic-bezier(.3,.7,.2,1)` | the leader line draws from the margin to the element (`stroke-dashoffset`) |
| `turn` | 520 ms | `cubic-bezier(.65,0,.35,1)` | marked ↔ reviewed: marks retract in reverse, plates misregister, the specimen swaps, plates register |
| `ink` | 700 ms, 50 ms stagger | `cubic-bezier(.22,.9,.18,1)` | gate bars fill once when the ledger enters |

Only `transform`, `opacity`, `clip-path` and `stroke-dashoffset` are animated.

## Choreography

1. **Entrance (hero):** headline set at load with no motion; plates `register` over the sheet; the specimen appears; the detector runs; marks `stamp` with `lead` lines. Total ≈ 3.4 s for 13 marks.
2. **Scroll narrative:** none beyond the ledger's single `ink`. The page reads as a document; the proof is the only performance.
3. **Interaction signature:** the sheet's toggle (`turn`) and "Proof this page", which runs the rules on the landing's own source and stamps its result (0 marks) on the sheet's slug.

## Reduced motion and no JavaScript

- `prefers-reduced-motion: reduce`: plates already in register, every mark present, leaders drawn, no `turn` animation (instant swap), ledger bars full.
- No JavaScript: the specimen shows in its iframe; the findings list (generated at build by `scripts/proof.mjs`) sits beside it; the toggle and the self-proof are hidden.

## Budgets

No WebGL and no video on the landing. Motion JS < 8 KB unminified beyond the rules file. Nothing animates off-screen; the entrance runs once.
