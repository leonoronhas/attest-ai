---
name: im-a-code-reviewer
description: Use when reviewing a branch, PR, or diff range against a fixed point. Two independent axes — does it follow this repo's standards, and does it do what the spec asked — reviewed apart so neither masks the other.
---

# I'm a Code Reviewer

**Core principle:** A change can follow every standard and build the wrong thing, or build exactly the right thing while breaking every convention. Those are different failures, found by different questions — so they are reviewed apart and reported apart.

## The Iron Law

```
TWO AXES, REVIEWED SEPARATELY, NEVER RERANKED INTO ONE LIST
```

The moment standards findings and spec findings compete in a single ranking, the louder axis buries the quieter one — and spec gaps are usually the quiet ones.

## The Pass

1. **Pin the range.** Resolve the base (merge-base against the target branch unless told otherwise) and confirm the diff is non-empty before anything else runs. A bad ref should fail here, in one line — not inside two dispatched reviewers.
2. **Package the diff as a file.** Commit list, stat summary, and the full diff with generous context, written to one file (the adapter's diff-package command). Reviewers read the file in one call. Never paste a diff into a prompt: pasted diffs stay resident in context forever, and big ones get silently truncated into a review of half the change.
3. **Locate the spec.** The issue, ticket, or spec document the work claims to satisfy — found via the adapter's tracker workflow, commit references, or by asking. No spec found? The Spec axis reports "no spec available" explicitly. It never silently reviews against imagination.
4. **Dispatch both axes in parallel,** as clean subagents that share nothing:
   - **Standards axis** — every place the diff breaks a documented repo standard (cite the rule), plus judgment-call design smells (name the smell, quote the hunk). Documented standards are hard findings; smells are always judgment calls, and a documented standard overrides a smell. Skip anything a linter or compiler already enforces — tooling's job is not worth reviewer tokens.
   - **Spec axis** — three questions only: what the spec asked for that is missing or partial, what the diff does that nobody asked for, and what looks implemented but wrong. Every finding quotes the spec line it hangs on.
5. **Never pre-judge.** No "don't flag X," "this was intentional," or "at most minor" in either prompt. If a finding will be a false positive, let it arrive and adjudicate it in the open — pre-judging is softening the review to spare yourself the loop.
6. **Verify, then report apart.** Each finding is second-hand until you reproduce its decisive claim — open the cited code, run the failing case. Label CONFIRMED or PLAUSIBLE. Report under separate `Standards` and `Spec` headings with a per-axis count; name the worst finding *within* each axis and no overall winner.

**Scope note:** reviewing your own implementation from the session that built it is self-confirmation, not review — that case belongs to `/im-an-adversary`, which exists to remove your context from the reviewer. Security and performance observations route to `/im-a-security-reviewer` and `/im-a-performance-reviewer` rather than diluting either axis here.

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

- Findings from both axes merged into one ranked list
- A diff pasted into a reviewer prompt instead of packaged as a file
- The Spec axis running without a spec and not saying so
- Pre-existing failures in untouched files reported as findings — review the change, link the burndown for the rest
- A reviewer prompt containing your prediction of what it should conclude
- Findings relayed to the author without CONFIRMED/PLAUSIBLE labels

## Rationalizations

| Excuse | Reality |
|---|---|
| "One combined list is easier to read" | Easier to read, and the spec gap is item 14 under twelve style nits. Separation is the feature. |
| "The spec is obvious from the code" | The code is what was built; the spec is what was asked. Judging one by the other finds nothing. |
| "I'll note the base ref later" | An unpinned range reviews a moving target. Pin first, dispatch second. |
| "Flagging lint issues shows thoroughness" | It shows the reviewer doing a linter's job slower. Skip what tooling enforces. |
| "The finding sounds credible, pass it through" | Credible is how wrong findings ship. Reproduce or label PLAUSIBLE. |
| "It's my code, I know where the bodies are" | Knowing where you buried them is why you can't find the ones you don't remember. Adversary for that. |

## Project Specifics

Read `.claude/attest/project.md` for the diff-package command, documented standards files, the tracker workflow for fetching specs, and the pre-existing-failure burndown link. If it is missing, run `/i-setup` — do not guess.
