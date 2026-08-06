---
name: i-code
description: Use when implementing any feature or bug fix, before writing implementation code. Test-first at confirmed seams — red, then green, one vertical slice at a time.
---

# I Code

**Core principle:** If you never watched the test fail, you don't know what it tests. A test born green proves nothing about the code — only about itself.

## The Iron Law

```
NO IMPLEMENTATION CODE BEFORE A FAILING TEST AT A CONFIRMED SEAM
```

Wrote implementation first anyway? It doesn't get to stay as "reference." Delete it and implement fresh from the test — code kept nearby steers the test toward what was written instead of what was asked.

## The Pass

1. **Confirm the seams.** A seam is the public boundary where behavior is observed — the interface a caller uses, not the internals behind it. Name the seams under test and confirm them against the plan or with your human before the first test exists. Testing effort is finite; agreeing the seams up front is how it lands on critical paths instead of everywhere. No test at an unconfirmed seam.
2. **Red.** Write one test for one behavior. Run it. Watch it fail — and read *why* it failed: a failing assertion is red; an import error, typo, or missing fixture is just a broken test. The failure message is the specification talking. If the seam carries a performance budget in the adapter, a failing performance assertion is a legitimate red — budgets are behavior too.
3. **Green.** Write the minimum that makes it pass — climb `/i-simplify`'s ladder before writing it: reuse what this codebase has, then stdlib, then platform, then an installed dependency, and only then new code. Run the covering tests and read the count yourself. Resist implementing the next three tests' worth while you're in there — speculative code is untested code with good posture.
4. **Slice vertically.** One test → one implementation → repeat, each cycle informed by what the last one taught. Never write the whole test file up front: batch-written tests verify imagined behavior and commit you to a shape you haven't earned yet.
5. **Keep the test honest.** Expected values come from an independent source — the spec, a worked example, a known-good literal — never recomputed the way the implementation computes them, or the test passes by construction. Mock only at system boundaries (network, clock, external services); mocking your own internals welds the test to the implementation, and it will break on the next refactor while the behavior stands still.
6. **Bug fixes start at red.** Reproduce the bug as a failing test *before* touching the fix. After it goes green, prove the linkage when the change is cheap to toggle: revert the fix, watch the test fail, restore. A regression test that never went red is a decoration.

Refactoring is not step 7. Structure changes ride a separate pass with its own proof obligation (`/i-refactor`) — mixing them into the red-green loop is how "minimal code to pass" becomes a rewrite.

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

- Implementation code exists and no test for it does
- A new test passed on its first run — you never saw red, so you don't know what green means
- The assertion mirrors the implementation's arithmetic instead of citing an independent expected value
- A mock standing in for your own module rather than a system boundary
- A test file written top-to-bottom before any implementation ran
- "I'll add the regression test after the fix" — after green, red is unreachable

## Rationalizations

| Excuse | Reality |
|---|---|
| "This change is too small for a test" | Small changes break callers too. Small change, small test, same law. |
| "I know it fails, no need to run it" | Half of first-run failures are broken tests, not failing ones. Watch it, read the reason. |
| "I'll write the tests right after" | After is when the tests get shaped to pass. The order is the mechanism. |
| "Mocking the DB layer makes it a unit test" | If the DB is yours, you just tested the mock. Boundaries only. |
| "The prototype code is good, I'll keep it and backfill tests" | Then it's a prototype that shipped. Delete, test, reimplement — or declare it a prototype and say so. |
| "Exploring first, TDD after" | Exploration is fine — in a branch or scratch file that dies. It never graduates into the diff. |

## Project Specifics

Read `.claude/attest/project.md` for this project's test commands (all and per-path), frameworks per package, and any guards that must run before tests touch a database. If it is missing, run `/i-setup` — do not guess.
