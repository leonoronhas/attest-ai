---
name: i-attest
description: Use when about to say anything works, is fixed, is done, or passes — before committing, opening a PR, or handing work back. Blocks every success claim until evidence for it exists in this turn.
---

# I Attest

**Core principle:** A claim is a debt. Only evidence produced this turn pays it. Everything else is a promise wearing a claim's clothes.

## The Iron Law

```
NO CLAIM WITHOUT A VERDICT. NO VERDICT WITHOUT EVIDENCE FROM THIS TURN.
```

"This turn" is literal: if the command whose output proves the claim did not run since you last changed anything, the claim is unpaid. A test run from before your last edit proves nothing about the code as it exists now.

## The Pass

Run all six. Each item is an action that produces output — an item you can satisfy by thinking about it is not an item. Each ends in a verdict.

1. **Re-read the full diff.** All of it, not the hunks you remember writing. You are looking for the change you don't remember making — leftover debug output, a file saved mid-thought, an edit that landed in the wrong place.
2. **Run the checks.** Build, type-check, lint, and the test suite covering the changed paths — on the tree as it stands right now. Read the output to the end; count the failures yourself instead of trusting the exit banner.
3. **Exercise the real behavior.** Invoke the actual feature — the endpoint, the CLI command, the screen — not only the tests that model it. Tests encode your assumptions; the running system doesn't.
4. **Hunt collateral damage.** Find what else depends on the files and symbols you touched, and run *their* checks. The bug you shipped is usually in the caller you never opened.
5. **Walk the edges you skipped.** Empty input, error paths, permissions, concurrency, the second call. Name each edge you are consciously not testing — an unnamed skip is a silent one.
6. **Re-read the original request.** Line by line against what you built. Requirements drift during implementation; this is where you catch that you solved a nearby problem instead of the stated one.

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

## Second-Hand Evidence

A result you were *told* — by a subagent, a summarizer, a tool's rolled-up status line, a previous session — is **PLAUSIBLE**, never PROVEN. Subagents are directionally right and specifically wrong often enough that adopting their claims verbatim ships false statements.

PLAUSIBLE upgrades to PROVEN only when you re-run the decisive command yourself, this turn, and read its output. Until then, report it as what it is: "the subagent reports X; not independently verified."

## Red Flags — Stop and Run the Pass

- The words "should", "probably", "seems to", or "I'm confident" heading toward a status report
- Satisfaction arriving before evidence — reaching for "Done!" with no command output above it
- About to commit, push, or open a PR on the strength of an earlier run
- Accepting a subagent's "success" without a diff or output you inspected yourself
- Declaring a bug fixed because the code changed, not because the original symptom was re-tested
- Being tired of the task and wanting it to be over — exhaustion is a reason to verify, not an excuse to skip

## Rationalizations

| Excuse | Reality |
|---|---|
| "It passed before my last change" | The claim is about the code as it is now. Re-run. |
| "The change is too small to break anything" | Small diffs ship bugs precisely because nobody re-checks them. |
| "The subagent said it's green" | That's a PLAUSIBLE report. Run the decisive command yourself. |
| "The linter passed" | The linter proves lint. It doesn't compile, run, or satisfy the spec. |
| "I'll verify after I commit" | The commit *is* the claim. Evidence comes first. |
| "I can't verify it here, so I'll assume it's fine" | That's a CAN'T PROVE. Put it on the Unverified List and say so. |
| "Rewording the claim so it's not technically a success statement" | The law binds meaning, not phrasing. An implied claim carries the same debt. |

## Scope

This skill is the exit contract of every other attest skill — each one ends by rendering this verdict block over its own claims. For trivial work (docs, copy, comments), running this pass alone *is* the entire ceremony — and proportionally: on a change that executes nothing, items 1, 2, and 6 are the pass; the full six bind anything that runs. Matched effort is what keeps the ceremony honored instead of skipped.

## Project Specifics

Read `.claude/attest/project.md` for this project's build, test, lint, and run commands, and any destructive-operation guards that must run first. If the file is missing, run `/i-setup` — do not guess commands.
