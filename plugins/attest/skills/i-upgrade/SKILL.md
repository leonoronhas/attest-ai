---
name: i-upgrade
description: Use when checking whether the installed attest suite is current, or when the user asks to update or upgrade it — and at the top of any session that finds the adapter's version stamp older than the suite's docs assume. Compares the installed manifest against the marketplace's, reads the changelog delta, runs the host's upgrade path, and re-runs setup so the adapter matches the new suite.
---

# I Upgrade

**Core principle:** An upgrade is two claims — "a newer version exists" and "you are now running it" — and each has exactly one source of truth: the marketplace's manifest for the first, the installed manifest re-read after the fact for the second. Everything else, including the installer's exit code, is optimism.

## The Iron Law

```
NO UPGRADE WITHOUT THE DELTA READ — AND NO "UPGRADED" UNTIL THE NEW VERSION IS READ BACK FROM THE INSTALLED MANIFEST
```

Upgrading blind is how a behavior change nobody reviewed becomes the suite's behavior. Claiming "upgraded" off the install command's exit code is the exact second-hand-evidence failure this suite exists to prevent.

## The Pass

1. **Establish the installed version.** Read it from the installed plugin's manifest for this host — the adapter's version stamp in `.claude/attest/project.md` is a note, not the truth. A host that consumes attest at the instruction tier (`AGENTS.md` copy, Cursor rule copy) has no installed manifest: use the stamp, and say that's what you're using.
2. **Fetch the marketplace version.** One HTTP GET of the plugin manifest on the default branch of the repository the installed manifest names (its `repository` field). Network unavailable or the fetch fails → the whole comparison is CAN'T PROVE; report that and stop rather than guessing from memory.
3. **Compare, and read the delta before touching anything.** Same version → verdict "current", stop. Newer remote → read the CHANGELOG entries between the two versions and surface behavior changes and new adapter slots to the user. A **major**-version jump never proceeds without the user's explicit go-ahead — major means a contract broke.
4. **Run the host's upgrade path.** The path the adapter or host defines: marketplace update-and-install for plugin hosts, pulling or re-copying the checkout for instruction-tier hosts. Present commands to the user where the host's convention is that they run them.
5. **Prove the new version is installed.** Re-read the installed manifest (or re-stat the copy) and confirm it now states the marketplace version. This line is the PROVEN evidence; without it the upgrade is NOT YET regardless of what the installer printed.
6. **Re-run `/i-setup` and re-stamp.** A new version usually brings new adapter slots, and the Toolbox and version stamp are now stale by definition. Setup's detect pass fills what's new; an upgrade that leaves the adapter serving the old suite has traded one kind of stale for another.

**Boundary:** deciding *what* goes into a release — versions, tags, changelog entries — belongs to the suite's maintainers, not this skill. This skill moves one installation forward and proves it moved.

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

- "Upgraded" claimed from the install command's exit code instead of the re-read manifest
- The changelog delta skipped — upgrading into behavior changes nobody reviewed
- A major-version jump proceeding without the user's explicit go-ahead
- `/i-setup` skipped after the upgrade — new slots stay empty until a skill trips over them
- The adapter's version stamp treated as the installed version on a host that has a manifest
- The remote version quoted from memory because the fetch failed

## Rationalizations

| Excuse | Reality |
|---|---|
| "The update command succeeded, we're done" | Exit 0 is the installer's claim. The re-read manifest is yours. |
| "Nobody reads changelogs" | The delta is where behavior changes announce themselves. One paragraph now beats a broken run discovered mid-review. |
| "Setup already ran once" | Against the old suite. New versions bring new slots; the adapter serves the suite you have now. |
| "It's just a patch, skip the ceremony" | A patch *claims* no behavior change — the delta read is how that claim gets checked, and it's the cheapest step in the pass. |
| "I'll upgrade all the hosts in one go" | Each host has its own installation and its own proof. Verify each, or list it CAN'T PROVE per host. |

## Project Specifics

Read `.claude/attest/project.md` for this host's install method, the version stamp, and the Toolbox section this skill re-stamps. If it is missing, run `/i-setup` — do not guess.
