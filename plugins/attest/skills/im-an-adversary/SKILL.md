---
name: im-an-adversary
description: Use when completed work needs review by a mind that did not build it — before merge, after implementation and self-review are done. Dispatches a clean-room reviewer, on a different model than the implementer, primed to refute rather than approve.
---

# I'm an Adversary

**Core principle:** You cannot refute your own argument while it is still in your context. Independence is a context property first and a model property second — the reviewer must hold none of the reasoning that produced the code.

## The Iron Law

```
THE REVIEWER WROTE NONE OF THE CODE AND SEES NONE OF THE SESSION
```

Both halves bind. A different model fed your session summary is not independent — it inherits your framing. The same model in a fresh session with only the artifacts is more independent than that.

## The Pass

1. **Identify the implementers.** Read the commit trailers and authors over the review range (`Co-Authored-By:` lines name which models wrote code). Every model or person with an implementation commit on the branch is disqualified from reviewing it.
2. **Pick the reviewer.** The strongest model available that implemented nothing. Name it explicitly in the dispatch — an omitted model silently inherits the session's model, which is usually the implementer, which silently defeats this skill.
3. **Build the clean room.** The reviewer receives exactly three things: the diff as a file (commit list + stat + full diff, generated fresh), the spec or issue the work claims to satisfy, and the project's documented standards from the adapter. Nothing from your session — no summaries, no design rationale, no "helpful context." Your explanation of the code is the contamination.
4. **Prime for refutation.** The brief is to attack, not to assess: assume the work is wrong somewhere and build the strongest case against it — spec gaps, scope creep, correctness, safety. Never pre-judge findings in the prompt: no "don't flag X," no "the plan chose this," no "at most minor." If you are writing those phrases, you are softening the adversary to spare yourself a fix loop.
5. **Verify every finding before adopting it.** The adversary's findings are second-hand evidence — directionally right and specifically wrong often enough to ship false statements. Reproduce the decisive check yourself: run the failing case, read the cited code. Only then does a finding enter the fix loop.
6. **Record the pairing.** `implemented-by` and `reviewed-by` go in the work's report, next to the verdict table. If the escalation clause below was used, say so.

**Escalation clause.** When the strongest available model is itself an implementer and the change is high-risk, reviewing with the *same* model in a separate clean session is a legitimate upward override — independence comes from the fresh context. Record the override in the pairing; never let it become the silent default.

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

- About to review the branch yourself "carefully" — you argued yourself into every line of it; that is the exact failure this skill exists to prevent
- Pasting session history, design notes, or your own summary into the reviewer's prompt
- The dispatch has no explicit model named
- A reviewer prompt containing "do not flag," "this was intentional," or any pre-judgment
- Adopting a finding into the fix loop without reproducing it first
- Treating a clean adversarial pass as proof of correctness — it is one more piece of evidence; the verdict table still gets rendered

## Rationalizations

| Excuse | Reality |
|---|---|
| "I'll review it myself, dispatching is overhead" | Self-review with full context is confirmation, not review. The overhead is the mechanism. |
| "The reviewer needs my session to understand the change" | The reviewer needs the diff, the spec, and the standards. Your narrative is the bias being excluded. |
| "Any different model will do" | Strength scales with risk. A weak adversary rubber-stamps with extra steps. |
| "The adversary found it, so it's true" | Second-hand until you reproduce it. Adversaries are confidently wrong too. |
| "It found nothing, so we're done" | A clean pass is evidence for the table, not a substitute for it. |
| "This diff is too small to need an adversary" | Then the review is cheap. Small diffs with payment, auth, or migration paths still get one. |

## Project Specifics

Read `.claude/attest/project.md` for the diff-package command, documented standards, spec source, and the adversarial review roster (which models are available, strongest first). If it is missing, run `/i-setup` — do not guess.
