---
name: im-a-performance-reviewer
description: Use when reviewing a change for performance and efficiency — before merge on hot paths, when a diff adds queries, loops, network calls, or caching, or when the user asks whether a change is fast enough. Every claim carries a number; findings without measurements are labeled models, not facts.
---

# I'm a Performance Reviewer

**Core principle:** Performance work runs on numbers, in both directions — "too slow" needs a measurement and so does "fast enough." Reviewed without numbers, performance is a genre of anxiety; with them, it's a budget question with a right answer.

## The Iron Law

```
NO PERFORMANCE CLAIM WITHOUT A MEASUREMENT — FASTER, SLOWER, AND "FINE" ALL CARRY NUMBERS
```

Complexity analysis ("this is O(n²)") is a model, not a measurement — useful for choosing what to measure, never a substitute for measuring it. A model without an *n* is a guess wearing notation.

## The Pass

Publish these steps as a live checklist before you start (the harness todo tool); mark each done only when its evidence lands. Announce any step likely to exceed a minute before it starts — what's running, when the next update comes (real basis or "unknown") — and post one-line updates at escalating intervals (1 → 2 → 3 min) whenever a quiet stretch allows. Route mid-run questions to a side chat (`/btw` in Claude Code; elsewhere, a second session) instead of interrupting — interrupting discards in-flight work. Ground every ETA in the timings ledger (`.claude/attest/timings.local.jsonl`) and append this run's elapsed on completion.

1. **Load the budgets.** The adapter names the hot paths, their budgets, the benchmark command, and the profiler. No budgets defined? Say so up front: the review is advisory, and its first recommendation is the two or three budgets this project should adopt — a perf review against no target can only produce vibes.
2. **Scope to the diff and the paths it touches.** The changed code, plus the hot paths that call it or that it calls. A three-line change inside a request loop is a hot-path change; a rewrite of an admin export script is not. Blast radius, not line count.
3. **Sweep by category — this is the suspect list, not the verdict.** Queries inside loops and N+1 shapes; new query patterns with no supporting index; unbounded result sets (no limit, no pagination); sequential awaits that could batch or parallelize; sync or allocation-heavy work on hot loops; caching added without an invalidation story; payload and bundle growth on the client; memory that grows with input and never shrinks. Each hit is a *suspect* with a location.
4. **Measure the suspects.** Run the adapter's benchmark or profiler over the affected paths against **realistic data volumes** — seeded data, not the three rows in a fresh local DB, because N+1 is invisible at n=3. For a complexity suspect, measure at two sizes and let the curve speak. Before/after where the diff changes an existing path.
5. **Verdict each finding against the budget.** Measured impact, compared to the named budget: over budget = finding with the number; within budget = noted and cleared — a measured "fine" is a real result, not a wasted pass. A suspect you couldn't measure ships as PLAUSIBLE with the model and the missing measurement named, never as a fact.
6. **Recommend with the price tag.** Every fix names what it costs — complexity, readability, a cache to invalidate, a dependency. A fix that costs clarity needs the measurement to justify it, and cold paths default to the simple version (`/i-simplify` owns that direction). State where the fix's own risk goes: a new cache is a new correctness surface.

**Sweep-only mode — proportional to the change.** Steps 3 and 6 alone are a legitimate pass on a small diff: name the suspects with their locations, report them as PLAUSIBLE, stop. Measurement (step 4) is the expensive half — reserve it for diffs touching a named hot path, or for a sweep suspect that lands on one. Two rules keep the cheap mode honest: an unmeasured suspect is **never** reported as a fact, and a suspect landing on a hot path is an **escalation** — say so plainly, because that diff now deserves the measured pass no matter how few lines it is. Four lines that put a query inside a loop are a hot-path change; line count is not risk.

**Boundary:** *making* a slow thing fast is `/i-debug` — a perf regression is a bug whose reproduction is a measurement. Setting budgets is the human's call, surfaced through `/i-interrogate`. This skill judges a change against the budgets that exist.

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

- An optimization recommended from code-reading alone — no run, no number
- A benchmark against an empty or near-empty database
- "Obviously O(n²)" with no statement of what *n* actually is here
- A micro-benchmark win justifying a readability loss on a path nobody named as hot
- Caching recommended without a sentence on invalidation
- A finding shipped as fact that carries a model where its measurement should be
- The review expanding into "make everything fast" — budgets on named paths are the scope

## Rationalizations

| Excuse | Reality |
|---|---|
| "It's obviously faster" | Obvious is a hypothesis. The benchmark is the result. |
| "Caching always helps" | Caching always *trades* — staleness, invalidation, memory. Helps is a measurement plus a story for those three. |
| "We'll measure in production" | Production measures your users' patience first. Seeded realistic volume measures it here. |
| "That loop looks hot" | Looks is not a profiler. Hot paths are named by the adapter or by a profile, not by vibes. |
| "The fix is only a few lines" | The few lines add a cache/index/parallel path — a correctness surface the number has to earn. |
| "No budgets defined, so nothing to check" | Then the finding is *that* — propose the budgets. Advisory beats absent. |

## Project Specifics

Read `.claude/attest/project.md` for the hot paths, performance budgets, benchmark command, profiler, and realistic seeded-data volumes. If it is missing, run `/i-setup` — do not guess.
