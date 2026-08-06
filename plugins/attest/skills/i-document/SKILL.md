---
name: i-document
description: Use when a change demands documentation — new behavior, changed commands, invalidated instructions — or when writing any doc, README, or guide. Every claim enforced, verified, or cut; no hedges.
---

# I Document

**Core principle:** A document is a claim about the system that strangers will act on without you in the room. A stale or hedged doc is worse than none — none sends the reader to the code, which is at least true.

## The Iron Law

```
EVERY CLAIM IN A DOC IS ENFORCED, VERIFIED, OR CUT — A HEDGE IS A CLAIM NOBODY CHECKED
```

"Should work", "in most cases", "you may need to" — each hedge marks the exact spot where the author stopped verifying and started hoping. Verify it and state it plainly, or cut it. There is no third option where the caveat stays.

## The Pass

1. **Find what the change invalidated.** Grep the docs for every command, path, name, and value the diff touched. Documentation rots from the edges of other people's changes — the doc your diff just falsified is one nobody will suspect until it burns them.
2. **Update or delete — never append a caveat.** A falsified doc gets corrected or removed. Adding "note: this may differ in newer versions" turns one stale doc into one stale doc with a disclaimer. Deletion is a legitimate documentation act; a doc that no longer earns its claims has stopped being one.
3. **Run every command the doc states.** Doc commands rot fastest of all doc content, and readers paste them verbatim. Each command block was executed this turn or it carries no right to sit in a fence. Same for every path: it exists, spelled exactly so.
4. **Write for the stranger.** The reader wasn't in the session, doesn't know the codenames, and can't ask follow-ups. No "simply" or "just" — those words hide the step the author no longer notices doing. If a step has a failure mode, say what failure looks like and what to do about it.
5. **Put it where it will be found.** The adapter names the docs layout; nearer is better — the code comment beats the adjacent README beats the docs site nobody greps. Never write a new doc where updating an existing one covers it: two docs on one topic is a fork, and one of them is already wrong.
6. **Stamp the perishables.** Claims that decay — versions, limits, external URLs, pricing, anything about a dependency — carry the version or date they were true for. An undated perishable claim is a future lie with no expiry marked.

**Boundary:** the PR body belongs to `/i-ship`; research write-ups to `/i-research`. This skill owns the durable docs — READMEs, guides, runbooks, architecture notes — and the discipline that they say only what's verified.

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

- "Should", "may", "in most cases", "usually" appearing in an instruction
- A command block that was never executed this turn
- A caveat being appended where a correction belongs
- A new doc starting where an existing doc already covers the topic
- "Simply" or "just" in front of a step you haven't watched a stranger attempt
- A doc describing the intended behavior while the code does something else — document what is, file an issue for what should be

## Rationalizations

| Excuse | Reality |
|---|---|
| "The hedge makes it more honest" | The hedge makes it unverified. Verifying it is what makes it honest. |
| "Docs are always a little stale, everyone knows" | Everyone knows, so nobody trusts, so nobody reads, so why did you write it? |
| "I'll document it properly later" | Later has no context. Four verified lines now beat a promised page never. |
| "The command worked last month" | The doc doesn't say "as of last month." Run it or date it. |
| "More documentation is always better" | Every doc is a maintenance liability. One findable, verified doc beats three forks. |
| "It's obvious what failure looks like" | To you, this turn. The stranger meets the failure alone at midnight. |

## Project Specifics

Read `.claude/attest/project.md` for the docs layout, where each kind of doc belongs, and any doc-adjacent CI checks. If it is missing, run `/i-setup` — do not guess.
