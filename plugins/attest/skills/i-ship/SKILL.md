---
name: i-ship
description: Use when work is done and needs to become a PR — before pushing. Assembles a verifiable claim package: final checks run, diff self-reviewed cold, PR body a reviewer can act on, CI watched to green.
---

# I Ship

**Core principle:** A PR is a claim package — what changed, why, and how anyone can verify it. A reviewer shouldn't have to reverse-engineer the intent from the diff or take the green on faith.

## The Iron Law

```
NOTHING CLAIMED IN THE PR BODY THAT DIDN'T RUN THIS SESSION — AND THE TURN ISN'T OVER UNTIL CI RESOLVES
```

Pushing and walking away is making a claim and leaving before the evidence arrives.

## The Pass

1. **Sync the base.** Confirm the target branch (the adapter names the default), bring the branch current with it, and resolve what surfaces. A PR against a stale base reviews cleanly and merges broken.
2. **Run the canonical check.** The adapter's "check everything" command — the one CI actually enforces — on the synced branch, and read the output to the end. This is the run the PR body's claims cite; yesterday's green died with yesterday's tree.
3. **Self-review the final diff, cold.** The whole cumulative diff, top to bottom, as a reviewer would see it — not the increments as you remember writing them. This is where the forgotten debug line, the accidental file, and the half-reverted experiment get caught, because it's the first time anyone looks at the *sum*.
4. **Write the body for a stranger.** What changed and why (link the issue — the spec axis of review needs it); **how to test** as literal commands a reviewer can paste, not "run the app and check"; risk and rollback notes; and the verdict table with its Unverified List — the reviewer acknowledges CAN'T PROVE items per-item, so they go in the body, not the conversation.
5. **Make the history reviewable.** Title and commits per the adapter's convention; squash the fixup noise if that's the house style. The record `/im-an-adversary` needs — who implemented, who reviewed — rides the trailers; keep them intact.
6. **Push, then watch CI to resolution.** Green: done, say so with the run link. Red: the turn isn't over — read the failure, fix or report, never re-run it into submission. A flake re-run without a read is evidence deleted.

**Boundary:** this skill assembles and verifies the package. Review happens in `/im-a-code-reviewer` and `/im-an-adversary` before this; versioning and changelog policy belong to the adapter, not this skill.

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

- A PR body reading "minor fixes and improvements" — that's a shrug with a merge button
- "How to test" containing no command a reviewer can actually run
- The check-everything run predating the last commit
- The cumulative diff never read as a whole before push
- Leaving the session while CI is still running
- A red CI re-run without reading why it was red

## Rationalizations

| Excuse | Reality |
|---|---|
| "CI will catch anything I missed" | CI is the backstop, not the reviewer. The claims in the body are yours, made before CI votes. |
| "The diff speaks for itself" | The diff says what; only you know why. The why is what the reviewer is actually approving. |
| "I already reviewed each commit as I went" | Increments reviewed in warm context miss what the cold sum shows. Read it once as a stranger. |
| "It's a tiny PR, the body can be one line" | Tiny PR, tiny body — but *what/why/how-to-test* still fit in four lines. Write them. |
| "CI is slow, I'll check tomorrow" | Tomorrow the context is gone and the failure is archaeology. Watch it resolve. |
| "The flake failed again, re-running" | Twice is a pattern, not a flake. Read the failure before the third run. |

## Project Specifics

Read `.claude/attest/project.md` for the target branch, the canonical check command, commit/title conventions, and the PR template. If it is missing, run `/i-setup` — do not guess.
