---
name: i-simplify
description: Use when hunting over-engineering — in a diff before merge, or across a repo — or when the user says "simplify", "what can we delete", "find bloat", or complains about over-building. Finds what to cut and what replaces it; complexity only, never correctness.
---

# I Simplify

**Core principle:** The best diff gets shorter. Every line is a liability someone maintains, reads at 3am, and works around — code that was never written has no bugs.

## The Iron Law

```
EVERY FINDING NAMES ITS REPLACEMENT, AND EVERY DELIBERATE SHORTCUT NAMES ITS TRIGGER
```

"This looks over-engineered" is not a finding. `L88: yagni: interface with one implementation — inline until a second exists` is a finding. And a simplification that cuts a real corner without naming when to revisit it is a silent debt.

## The Ladder

The rubric for both building and reviewing. Stop at the first rung that holds:

1. **Does this need to exist at all?** Speculative need = cut it, one line saying so.
2. **Already in this codebase?** A helper, type, or pattern a few files over — reuse beats reimplementation, and reimplementation is the most common slop in a monorepo.
3. **Stdlib does it?** Use it.
4. **Native platform covers it?** A built-in input over a picker library, CSS over JS, a database constraint over app code.
5. **An already-installed dependency solves it?** Use it. Never add a new dependency for what a few lines cover.
6. **Can it be one line?** One line.
7. **Only then:** the minimum that works.

The ladder shortens the solution, never the reading. Understand the change end to end first — the smallest edit in the wrong place isn't lean, it's a second bug.

## The Pass

1. **Fix the scope.** A diff range (default) or the whole tree (audit mode). For a diff, pin the base ref first; for a tree, skip generated files, lockfiles, and vendored code.
2. **Hunt by category.** Dependencies duplicating stdlib or platform features; single-implementation interfaces; factories with one product; wrappers that only delegate; config nobody sets; flags nobody flips; layers with one caller; hand-rolled versions of shipped functions; the same logic shape pasted twice.
3. **Write findings in the compressed form.** One line each:
   `<file>:<line>: <tag>: <what to cut>. <what replaces it>.`
   Tags: `delete:` (replacement: nothing) · `stdlib:` (name the function) · `native:` (name the feature) · `yagni:` (abstraction ahead of need) · `shrink:` (same logic, fewer lines — show the shorter form). Rank biggest cut first.
4. **Verify each cut is safe to name.** Before claiming a replacement works, check it: the stdlib function actually covers the edge the custom code handled, the "unused" flexibility really has no caller (grep, don't assume). A wrong cut recommendation is worse than bloat.
5. **Mark surviving shortcuts.** Any simplification that keeps a real ceiling (global lock, O(n²) scan, naive heuristic) carries a marker comment naming the ceiling and its upgrade trigger: `// attest: <ceiling> — <trigger to revisit>`. In audit mode, also harvest existing markers into a ledger and tag any with no trigger as rot risk.
6. **Score it.** End with `net: -<N> lines, -<M> deps possible.` If there's nothing to cut: `Lean already. Ship.` — and stop. Zero findings is a valid, reportable result, not a failure to try hard enough.

## Scope — What This Skill Never Touches

Correctness bugs, security holes, and performance route to `/im-a-code-reviewer` and `/im-a-security-reviewer` — hunting them here dilutes both reviews. And never flag for deletion: validation at trust boundaries, error handling that prevents data loss, accessibility basics, the one runnable check that proves non-trivial logic, or anything explicitly requested. If the user insists on the full version after hearing the lean one, build it — no re-arguing.

This skill lists cuts; it does not apply them. Applying is `/i-refactor`'s job, with its own proof that behavior held. Performance findings route to `/im-a-performance-reviewer` — and the tension resolves by measurement: a cut that would slow a *named hot path* needs the number before it ships, while cold paths default to the simple version.

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

- A finding with no named replacement — that's an opinion, not a cut
- Recommending a stdlib swap you didn't check against the custom code's edge cases
- Flagging the smoke test, the boundary validation, or the requested feature as bloat
- Correctness or security observations leaking into the findings list instead of being routed
- A simplification with a real ceiling and no marker comment naming its trigger
- Padding the report when the diff is already lean — "Lean already. Ship." is the win condition, not an anticlimax

## Rationalizations

| Excuse | Reality |
|---|---|
| "The abstraction will pay off later" | Later can build it, informed by a real second use. Today it's a layer with one caller. |
| "It's only 30 extra lines" | Times every reader, forever. The line count is the interest rate. |
| "A new dependency is faster than writing it" | The dependency is code too — you just can't review it. Rung 5 is *installed* deps only. |
| "Deleting feels risky" | Ungrepped 'risky' is a feeling. Grep the callers; zero callers is a fact. |
| "The clever version shows skill" | Clever is what someone decodes during an incident. Boring is the senior move. |
| "I'll simplify and fix that bug while I'm here" | Two changes, one diff, zero clean reviews. Route the bug, cut the bloat. |

## Project Specifics

Read `.claude/attest/project.md` for the diff-package command, generated files to skip, and the stdlib/platform baseline of this stack. If it is missing, run `/i-setup` — do not guess.
