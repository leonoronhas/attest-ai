# Project Adapter — attest

<!-- Filled by /i-setup. Every attest skill reads this file instead of
     guessing commands. A wrong entry here poisons every skill that reads
     it — keep it current, and prefer `UNKNOWN — ask the team` to a guess. -->

## Identity

- **Project:**
- **Stack:**
- **Package manager & version:**
- **Monorepo:** yes/no — orchestrator if any:
- **attest version installed:** <!-- stamped by /i-setup and /i-upgrade; the installed manifest is the truth, this line is the note -->

## Commands

| Purpose | Command | Notes |
|---|---|---|
| Install deps | | |
| Build | | |
| Type-check | | |
| Lint | | |
| Format check | | |
| Test (all) | | |
| Test (single package/path) | | |
| Run locally | | fixed ports if any |
| The canonical "check everything" | | what CI actually enforces |

## Guards

<!-- Commands that MUST run before destructive operations, and what they
     protect against. Example: a not-prod assertion before any DB write. -->

| Before doing | Run first | Refuses when |
|---|---|---|
| | | |

## Layout

- **Source roots:**
- **Test locations & frameworks:**
- **Generated files (never hand-edit):**
- **Feature/module convention:**

## Performance

- **Hot paths** (routes/jobs/queries where latency matters):
- **Budgets** (path → target, e.g. `GET /api/orders → p95 < 300ms`):
- **Benchmark command:**
- **Profiler:**
- **Realistic data volume** (what the seed provides; N+1 is invisible at n=3):

## Issue Tracker

- **Tracker:**
- **How specs are referenced in commits/branches:**
- **How to fetch an issue:**
- **How to create an issue / draft** (the exact MCP tool or CLI command):
- **Draft convention** (label/state marking agent-created drafts pending human approval):

## Review Inputs

- **Documented standards files:**
- **What counts as customer-facing:**
- **Known pre-existing failures to exclude from review noise** (link the burndown issue, not a snapshot list):
- **Adversarial review roster** (models available to `/im-an-adversary`, strongest first):
- **Diff-package command** (writes commit list + stat + full diff to one file for clean-room reviewers):

## Toolbox

<!-- Detected by /i-setup; re-stamped by /i-upgrade and /i-setup re-runs.
     A skill reaching for a tool not listed here says the Toolbox may be
     stale and suggests re-running /i-setup — it does not guess. -->

- **Detected on:**
- **MCP servers available** (name → what it serves, e.g. browser automation → QA and design review; tracker → intake and planning):
- **CLIs available** (gh, db clients, deploy tools — and the guard each requires):

## Conventions

- **Commit format:**
- **Branch naming:**
- **PR template location:**
- **Side-chat command** for questions during long runs (`/btw` in Claude Code; blank if the harness has none):
