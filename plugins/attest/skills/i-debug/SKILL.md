---
name: i-debug
description: Use when anything is broken, failing, or behaving unexpectedly — before proposing any fix. Reproduction first, root cause before hypothesis, and a hard stop after three failed fixes.
---

# I Debug

**Core principle:** A fix without a diagnosis is a guess with a commit message. Guessing occasionally works, which is exactly what makes it expensive — the wins teach you to keep doing it.

## The Iron Law

```
NO FIX WITHOUT A REPRODUCTION. NO HYPOTHESIS WITHOUT EVIDENCE. NO FOURTH ATTEMPT.
```

The pull to skip this is strongest exactly when it matters most: under time pressure, when the fix "seems obvious," and after a failed attempt. All three are signals to slow down, not speed up.

## The Pass

1. **Reproduce it.** A command that fails now and will pass when the bug is dead — run it, watch it fail, keep it. Can't reproduce? Then the job is gathering data (logs, inputs, environment diffs), not fixing. A bug you can't trigger is a bug you can't verify dead.
2. **Read the error to the bottom.** The full message, the full stack, the actual line. Error messages routinely contain the answer, and get skimmed because they're long. Note what it says *and* what it conspicuously doesn't.
3. **Check what changed.** Recent commits, dependency bumps, config edits, environment differences between where it works and where it doesn't. Most bugs are young — the diff since "it worked" is the smallest haystack.
4. **Instrument the boundaries.** When the system has layers (request → service → database, build → sign → deploy), log what enters and exits each one and run the repro once. Evidence shows *which* layer breaks; then you investigate one layer instead of theorizing about five.
5. **One hypothesis, tested minimally.** State it: "X causes this because Y." Make the smallest change that tests it — one variable. Wrong? Form a new hypothesis from what you learned. Never stack a second fix on top of an unverified first.
6. **Fix at the origin, prove it dead.** Trace the bad value to where it enters, and fix where all callers route through — patching the one path the ticket names leaves every sibling caller broken. Then the `/i-code` bug-fix step: the repro from step 1 becomes the regression test, red before the fix, green after, revert-check when cheap.

**The three-strike rule.** Three failed fixes is not bad luck — it's evidence the problem isn't where you think it is. Each fix revealing a new problem somewhere else, or requiring "just a bit of refactoring" that keeps growing, means the architecture under the bug is the bug. Stop. Say so. Question the pattern with your human before attempt four — attempt four is how a wrong design gets a fifth workaround.

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

- "Let me just try changing X" — a change with no hypothesis is a coin flip that dirties the evidence
- Proposing fixes before the repro exists
- Two changes in one attempt — whichever works, you won't know which
- "Should be fixed now" — the repro command decides, not the adjective
- A timeout bumped or a retry added where a race should have been found
- Attempt four forming while attempts one through three lie unexplained

## Rationalizations

| Excuse | Reality |
|---|---|
| "It's obvious what's wrong" | Obvious symptoms have non-obvious causes. The pass is fast when you're right — run it. |
| "No time for process, production is down" | Systematic is faster than thrashing. Guess-loops are how outages get long. |
| "I'll reproduce it after I fix it" | Then you'll never know the fix worked. Repro is the measuring stick — it comes first. |
| "The test is flaky, rerun it" | Flaky means nondeterministic bug, not innocent test. Rerunning until green is data destruction. |
| "This fix didn't work, but combined with the next one…" | Unverified fixes don't stack, they compound confusion. Revert, rethink, one at a time. |
| "The architecture question is above this ticket" | Three failed fixes made it this ticket. Surfacing it is the fix. |

## Project Specifics

Read `.claude/attest/project.md` for repro commands per surface, log locations, and any guards required before running anything against a database. If it is missing, run `/i-setup` — do not guess.
