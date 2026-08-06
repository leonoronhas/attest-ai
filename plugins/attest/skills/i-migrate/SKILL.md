---
name: i-migrate
description: Use when changing a database schema — new tables, columns, constraints, indexes, or data backfills — before writing the migration. Guards before writes, dry-runs before applies, and a rollback note before merge.
---

# I Migrate

**Core principle:** A migration is an act performed on other people's data, wearing a costume of reversibility. Code rolls back; a dropped column does not.

## The Iron Law

```
GUARD BEFORE WRITE. DRY-RUN BEFORE APPLY. ROLLBACK NOTE BEFORE MERGE.
```

And one rule the type system cannot enforce, so this skill must: **constraints only fail on writes.** A tightened CHECK, a new unique index, or a NOT NULL column can pass every type-check and every test that never inserts a row.

## The Pass

Publish these steps as a live checklist before you start (the harness todo tool); mark each done only when its evidence lands.

1. **Run the guard.** The adapter's destructive-op guard before any command that writes to a database — and it must fail *closed*: if the target can't be determined, the answer is no. Local tooling resolves targets through config files that can silently point anywhere, including production.
2. **Name the downstream consumers.** A schema is an interface; the migration changes its contract. List every consumer before writing it: generated types, seed and fixture generators, caches, reports, other services reading the same tables. Each one is a task this migration creates — an unnamed consumer is a breakage scheduled for later.
3. **Dry-run, and read the plan.** Preview what will execute against a real copy (local instance or branch database) before anything applies. The dry-run output is evidence for the verdict table; "the file looks right" is not.
4. **Regenerate derived artifacts, then type-check.** Types, clients, schema snapshots — regenerate all of them and let the compiler name every consumer the change broke. This catches renames and drops; it structurally cannot catch constraints.
5. **Exercise a real write.** Because of that blind spot: after applying locally, run the seed, the fixture loader, or a representative insert against every touched table. This is the only test that fires a CHECK, a unique collision, or a NOT NULL default gap. A migration that has never accepted a row is unverified by definition.
6. **Write the rollback note.** How to undo it — the reverse migration, or the honest sentence "irreversible: drops data; recovery is restore-from-backup plus backfill." Irreversible is acceptable; undeclared is not. Then the deploy order when code and schema must move together: which ships first, and what breaks in the window between.

**Data backfills are migrations too** — same guard, same dry-run, plus: measure the row count first, batch anything large, and make it idempotent, because interrupted backfills get re-run.

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

- A database command about to run with no guard output above it this turn
- "The type-check passed, the migration is fine" — types cannot see constraints
- A rename implemented as drop-and-create — that's data loss with extra steps
- No row ever written to the changed table before calling it verified
- A migration reaching a shared tier through a side channel the checks don't cover
- The rollback section saying "revert the migration" for a change that destroyed information

## Rationalizations

| Excuse | Reality |
|---|---|
| "It's just an index / just a column" | Just-an-index locks the table; just-a-column has a default, a null story, and consumers. Small DDL, same pass. |
| "The guard is paranoid, I know my env points local" | The guard exists because someone knew that and was wrong. Its output costs one second. |
| "The seed can catch up later" | Later is the next teammate's broken reset, with your name on the migration. Name the consumers now. |
| "Dry-run and apply do the same thing" | The dry-run is where you *read* what will happen while it still hasn't. That's the entire point. |
| "We never roll back anyway" | The note isn't for rollback day, it's the proof you know what the change destroys. |
| "Staging data is too different to bother" | Different data is the feature — it fails in ways local fixtures are too clean to find. |

## Project Specifics

Read `.claude/attest/project.md` for the guard command, migration tooling, type-regeneration command, seed runner, and shared-tier push procedure. If it is missing, run `/i-setup` — do not guess. If the project requires per-migration annotations (seed impact, review tags), the adapter names them — every migration carries them.
