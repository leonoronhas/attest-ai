---
name: i-research
description: Use when establishing facts from outside the codebase — library behavior, API contracts, platform limits, version differences — before designing or building on them. Primary sources, version-pinned, captured as markdown in the repo.
---

# I Research

**Core principle:** Facts from outside the repo decay — versions move, docs describe the version they were written for, and blog posts describe the version their author had. Training-data memory is the fastest-decaying source of all.

## The Iron Law

```
PRIMARY SOURCE OR LABELED HEARSAY — AND EVERY FINDING PINNED TO THE VERSION ACTUALLY INSTALLED
```

The most common research failure isn't a wrong source; it's a right source for the wrong version.

## The Pass

1. **Phrase the question falsifiably.** "How does the cache work" produces reading; "does the client retry on 429, and with what backoff, in the version we ship" produces an answer that can be wrong — which is what makes it usable.
2. **Establish the installed version first.** Read the lockfile or manifest before opening any docs. Every subsequent source gets checked against that pin — a doc for the wrong major version is a wrong doc with a familiar layout.
3. **Rank the sources and go primary.** The dependency's own source code and changelog outrank its official docs; official docs outrank maintainer issue replies; those outrank blogs and answers; and everything outranks memory. Note which tier each finding came from.
4. **Reproduce what's cheap to reproduce.** A claim you can test in a scratch file in two minutes gets tested — run the snippet, hit the endpoint, trigger the limit. Reproduction converts hearsay into first-hand evidence, and it's how docs get caught lying.
5. **Capture findings as markdown in the repo.** Question, answer, source links, source tier, the version pin, and the date. Research that lives in chat history gets re-done next quarter by someone who trusts a worse source. Put the file where the adapter says research lives.
6. **Mark the boundary of what you established.** What was verified, what was reproduced, and what remains vendor-claimed. A finding table where everything reads PROVEN is a sign the questions were too easy.

**Boundary:** facts *inside* the codebase belong to `/i-explore`. Research that turns into "which design should we pick" hands off to `/i-design` — this skill establishes what is true, not what to do about it.

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

- Stating how an API behaves without a source open this turn — that's memory, the bottom tier
- A doc page cited with no check that it matches the installed major version
- "The docs say so" for a claim that a two-minute scratch file would settle
- Findings delivered in chat with nothing written to the repo
- A blog post outvoting the dependency's own changelog
- Research concluding with a recommendation nobody asked for — establish the facts, route the decision

## Rationalizations

| Excuse | Reality |
|---|---|
| "I know this library" | You know a version of it. The lockfile says which one matters. |
| "Official docs are always right" | Docs are written by humans about a moving target. The source and changelog are the target. |
| "Reproducing is overkill for a doc lookup" | Two minutes of scratch file beats two hours of debugging the doc's optimism. |
| "I'll write it up if it turns out important" | Importance is discovered later, by someone else, who will re-research it. Capture now. |
| "Stack Overflow had the exact answer" | For their version, their platform, their year. Tier it and verify it. |
| "The question is simple" | Simple questions with wrong answers are how foundations get poured wrong. Pin the version anyway. |

## Project Specifics

Read `.claude/attest/project.md` for where research documents live and the manifest/lockfile locations per package. If it is missing, run `/i-setup` — do not guess.
