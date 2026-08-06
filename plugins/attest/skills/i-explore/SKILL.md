---
name: i-explore
description: Use when locating anything inside the codebase — where something is defined, what calls it, how a flow works, whether a capability exists — before designing or changing it. Read-only; produces locations with evidence, never fixes.
---

# I Explore

**Core principle:** Exploration answers "where does this live and how does it connect" — its product is locations with evidence, not opinions. The moment it starts proposing fixes, it stops being reconnaissance and starts being a guess with a head start.

## The Iron Law

```
EVERY LOCATION CITED WAS OPENED. EVERY ABSENCE CLAIM NAMES THE SEARCHES THAT FAILED.
```

"X doesn't exist in this codebase" is one of the most load-bearing claims exploration makes — features get built on it. It is only as good as the search breadth behind it.

## The Pass

1. **Sharpen the question.** "How does auth work" is not searchable; "where is the request credential checked, and what happens on failure" is. A question you can't phrase precisely yet means the first search is for vocabulary — find what this codebase *calls* the thing.
2. **Search wide, then narrow.** Multiple spellings, synonyms, and conventions: the concept, the class name, the snake_case and camelCase variants, the abbreviation someone chose in 2023. One search term is one guess about naming; codebases outlive their naming discipline.
3. **Open every hit you report.** A grep match is a candidate, not a finding — read enough surrounding code to confirm it's the real definition or a live caller, not a lookalike, a test double, or dead code. Distinguish generated files and vendored code from source, and say which is which.
4. **Map the connections.** For the confirmed locations: who calls this, who imports it, where does its config come from, where do its values go. A definition without its callers is half an answer — the callers are where a change will actually land.
5. **Report as a location table.** `file:line` per finding, what it is (definition / caller / config / test), and one line of what it does. Confidence stated where it's less than certain: "appears unused — no static callers found; dynamic access not ruled out."
6. **Name what you didn't find.** Absences reported with the searches that failed to find them — terms, paths, and any territory not covered (generated code, other repos, runtime config). That's what lets the reader judge whether "not found" means "not there."

**Boundary:** this skill locates; it does not evaluate or fix. Findings that beg for action route onward — bugs to `/i-debug`, bloat to `/i-simplify`, design questions to `/i-design`. Facts *outside* the repo (library behavior, API contracts, platform limits) belong to `/i-research`. Wide sweeps are subagent work where the harness allows: dispatch the sweep and take back the location table, not the file dumps — the coordinator's context is for steering, not storage.

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

- Citing a path or line number from memory without opening the file this turn
- Satisfaction with the first hit — the second definition is the one that bites
- "Doesn't exist" backed by a single search term
- A fix proposal appearing mid-exploration
- Generated or vendored code reported as if it were source
- The report describing what the code *should* do instead of what the opened files show it does

## Rationalizations

| Excuse | Reality |
|---|---|
| "I remember where this lives" | The codebase changed since that memory formed. Open it. |
| "One good grep is enough" | One grep tests one naming guess. The thing you're looking for was named by someone else. |
| "The function name says what it does" | Names describe intentions at time of writing. The body describes now. |
| "While I'm here, I'll just fix it" | Then the exploration report is now a diff nobody asked for. Note it, route it. |
| "Nothing came up, so it's not there" | Nothing came up *for those terms, in those paths*. Say that instead — it's a different claim. |
| "The map is obvious from the structure" | Directory structure is where code sleeps, not how it flows. Trace the callers. |

## Project Specifics

Read `.claude/attest/project.md` for source roots, generated files to treat as non-source, and naming conventions per layer. If it is missing, run `/i-setup` — do not guess.
