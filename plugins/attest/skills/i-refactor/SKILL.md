---
name: i-refactor
description: Use when changing code structure while behavior must stay identical — extracting, inlining, moving, renaming, applying /i-simplify's cuts — before touching anything. Behavior pinned first, green at every step, never mixed with behavior change.
---

# I Refactor

**Core principle:** A refactor is a proof obligation, not a cleanup: everything observable stays exactly as it was, and only the structure moves. Without the proof, "refactor" is just "rewrite" said reassuringly.

## The Iron Law

```
BEHAVIOR PINNED BEFORE ANYTHING MOVES. GREEN AFTER EVERY STEP. NEVER MIXED WITH BEHAVIOR CHANGE.
```

The mixed diff is the cardinal sin: a structure change and a behavior change in one commit means neither can be verified, reviewed, or reverted alone.

## The Pass

Publish these steps as a live checklist before you start (the harness todo tool); mark each done only when its evidence lands.

1. **Pin the behavior.** The code being reshaped has covering tests, and they pass — run them, read the count. No coverage? Write **characterization tests** first: assert what the code *actually does*, warts included. A characterization test that documents a bug is correct — the bug is current behavior, and fixing it is a separate, later diff.
2. **Declare the target shape and its source.** What the structure becomes and why — an `/i-simplify` finding, an `/i-design` decision, a duplication to collapse. A refactor without a stated destination wanders, and wandering refactors are where behavior changes sneak in.
3. **Move in small reversible steps, green after each.** Extract, run; rename, run; inline, run. A red mid-step means the step was too big — revert it and take a smaller one, never "fix it forward" while red, because forward-fixing while red is behavior change under cover of noise.
4. **Sweep for stragglers the compiler can't see.** Renames and moves update static references; grep for the rest — string references, dynamic access, reflection, serialized names, config keys, docs. The compiler's silence covers only what the compiler can see.
5. **Audit your own diff for smuggled behavior.** Read the final diff hunk by hunk asking one question: does anything observable change? Reordered side effects, a tightened condition, a default that shifted, an error message reworded — each is behavior wearing a refactor's clothes. Found one? Pull it out into its own diff.
6. **Prove parity.** Full covering suite green, and any golden outputs — snapshots, fixtures, generated artifacts — byte-identical. **Test edits are the tell:** a refactor that had to change test *assertions* changed behavior; only mechanical updates (imports, names, paths) are legitimate.

**Boundary:** finding what to cut is `/i-simplify`'s job; deciding the new shape is `/i-design`'s. This skill is the move itself. New behavior mid-refactor stops the refactor — finish it, land it, then `/i-code` the new behavior on the clean base.

## Verdict

<!-- SPINE: this section is the family contract. Copy it byte-identical
     into every attest skill. Do not paraphrase it per-skill. -->

Every claim gets exactly one of three verdicts:

- **PROVEN** — a command ran this turn and its output confirms the claim. Cite the command and the decisive line.
- **NOT YET** — evidence exists and it says the work is not done. State what is missing. This is a finding, not a failure of the pass.
- **CAN'T PROVE** — no way to verify from this environment (needs staging, another account, a device you don't have, data that doesn't exist here). Goes on the **Unverified List**.

Render the verdict as a table:

```
| # | Claim | Verdict | Evidence (this turn) |
|---|-------|---------|----------------------|
```

**The Unverified List.** Every CAN'T PROVE item must be individually acknowledged by whoever accepts the work — a human reviewer or a gate that records it. A blanket "confirmed" covering multiple unverified items is void. If nothing is unverified, say "Unverified: none" explicitly; silence is not a clean bill.

## Red Flags — Stop

- Moving code that has no covering tests and no characterization tests
- "While I'm here" — a bug fix, a rename, an improvement folding itself into the refactor diff
- Continuing to edit while the suite is red
- Test assertions changing to make the refactor pass
- A characterization test "corrected" to assert what the code *should* do
- The diff described as a refactor while the changelog describes new behavior

## Rationalizations

| Excuse | Reality |
|---|---|
| "The change is obviously equivalent" | Obvious equivalences are where reordered side effects live. The suite decides, not the adjective. |
| "Writing characterization tests doubles the work" | It's the half of the work that makes the other half a refactor instead of a gamble. |
| "I'll fix that bug while everything's open" | Then the diff proves neither the fix nor the refactor. Two diffs, two proofs. |
| "The tests were wrong anyway" | Maybe — as a separate finding, in a separate diff, decided on its own evidence. |
| "Small repo, I'll just do it in one go" | One go is one giant step. Steps are what make a red revertible. |
| "The compiler will catch anything I miss" | The compiler catches what it compiles. Strings, reflection, and configs are on you. |

## Project Specifics

Read `.claude/attest/project.md` for test commands per path, snapshot/golden locations, and generated files that must be regenerated rather than edited. If it is missing, run `/i-setup` — do not guess.
