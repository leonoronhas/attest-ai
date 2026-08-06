# attest-ai

Agent skills that make every claim carry a verdict backed by evidence
produced this turn.

An AI agent will tell you the tests pass because they passed an hour ago,
call a bug fixed because the code changed, and relay a subagent's "success"
as fact. **attest** is a family of first-person skills — `/i-attest`,
`/i-code`, `/im-a-code-reviewer` — that all terminate in the same exit
contract:

> **PROVEN** — a command ran this turn and its output confirms the claim.
> **NOT YET** — evidence says it isn't done; here's what's missing.
> **CAN'T PROVE** — unverifiable from here; goes on the Unverified List
> for per-item human acknowledgment.

And one rule with no exceptions: a result reported by a subagent or a
summary is **PLAUSIBLE**, never PROVEN, until you re-ran the decisive
command yourself.

## Install

```bash
claude plugin marketplace add leonoronhas/attest-ai
claude plugin install attest@attest-ai
```

**Other agents.** attest isn't Claude-only. Any agent that reads an
`AGENTS.md` at the repo root — Codex, Cursor, opencode, Gemini CLI, Amp,
Jules, Zed, Junie, Copilot, Antigravity — picks up the always-on contract
and a dispatch table pointing at the skills, with zero setup. Codex and
Cursor also get dedicated adapters (`.codex-plugin/`, `.cursor/rules/`). See
[docs/agent-portability.md](docs/agent-portability.md).

**Pointing an AI agent at this repo?** [docs/for-llms.md](docs/for-llms.md)
is written for the agent — how to install attest for its host, run `/i-setup`,
and use the skills. If you pasted this link into an assistant, tell it to read
that file.

Then, in each repo that uses it:

```
/i-setup
```

`/i-setup` interviews the repo and writes `.claude/attest/project.md`
(commands, layout, guards) and `.claude/attest/security-model.md` (that
project's sensitive surfaces). Skills ship the method; the adapter supplies
the specifics. No skill ever guesses your test command.

## The Family

Two naming patterns: `i-<verb>` does the work, `im-a-<role>` puts on a
reviewer's hat. Every skill runs the same shape — an iron law it won't
break, a numbered pass that produces evidence, and the verdict contract to
close. They're grouped below in the order work tends to flow.

### Intake — is this worth building?

- **`/im-a-tpm`** — a request arrives pre-solutioned. Recover the problem
  behind it, demand a success metric and a why-now, steelman *not* building
  it, and cut to the smallest version that tests the idea. Nothing enters
  the backlog half-validated.

### Understand — learn before you touch

- **`/i-explore`** — locate things *inside* the codebase. Read-only; every
  cited location was opened, and "doesn't exist" names the searches that
  failed to find it.
- **`/i-research`** — establish facts from *outside* the codebase (a
  library, an API, a platform limit). Primary sources, pinned to the
  version actually installed, written down in the repo.

### Decide — choose on the record

- **`/i-interrogate`** — the open questions that are the human's to answer.
  One at a time, each with a recommendation attached; budget scales by
  risk, never by who's asking.
- **`/i-design`** — shape a module before building it. Write the call site
  first, design it *twice*, judge at the interface with the deletion test,
  and record the design you rejected.
- **`/i-plan`** — a five-line mini-plan for one session, or a
  decision-ticket map for work too big for one. Every task independently
  rejectable, every unknown named, no placeholders.

### Build — make the change

- **`/i-code`** — TDD at confirmed seams. Watch the test fail before you
  make it pass; expected values come from an independent source; mocks only
  at system boundaries.
- **`/i-execute`** — run a whole plan in one session: publish the task
  roadmap as a live checklist, dispatch a fresh subagent per task, review
  between tasks so drift is caught early, and keep a ledger that survives a
  compaction.
- **`/i-debug`** — reproduce before you fix, one hypothesis at a time, fix
  at the root where all callers route through. Three failed fixes means the
  architecture is the bug — stop and say so.
- **`/i-refactor`** — change structure while behavior stays identical.
  Behavior pinned first, green after every small step, never mixed into the
  same diff as a behavior change.
- **`/i-migrate`** — a schema change is an act on real data. Guard before
  write, dry-run before apply, rollback note before merge — and because
  constraints only fail on writes, no migration is done until it has
  accepted a real row.
- **`/i-simplify`** — hunt over-engineering, in a diff or across the repo.
  Climb the ladder (reuse → stdlib → native → installed dep → new code);
  every finding names what replaces it. Finds cuts; `/i-refactor` applies
  them.

### Review — a second mind before merge

- **`/im-a-code-reviewer`** — two axes kept deliberately apart: does it
  follow the repo's standards, and does it do what the spec asked. Reported
  separately so neither buries the other.
- **`/im-an-adversary`** — a clean-room reviewer on a model that wrote none
  of the code, primed to refute rather than approve. Independence is a
  context property first, a model property second.
- **`/im-a-security-reviewer`** — one diff against the project's own threat
  model. Trace the boundaries it touches; exercise the rejection path, don't
  just read it.
- **`/im-a-security-auditor`** — the codebase-wide deep sweep. Trace
  untrusted input to dangerous sinks across nine scanner passes; every
  finding is re-traced against the code, or it doesn't ship.
- **`/im-a-design-reviewer`** — UI reviewed *rendered*, in every state that
  ships, both themes. Findings cite the design system's own rules; taste is
  labeled as taste and never becomes a redesign.
- **`/im-a-dx-engineer`** — audit what it's like to work in the repo by
  *performing* the journey from a clean clone, timed. Broken, friction, or
  missing — each with the stumble that proves it.

### Verify — prove it works, then say so

- **`/im-a-qa-engineer`** — drive the real app where users touch it.
  Objective signals (console errors, 4xx/5xx, crashes, dead nav) decide
  pass/fail; judgment produces findings, not failures; every bug found
  becomes a permanent spec.
- **`/i-attest`** — the exit contract every other skill ends in. No
  completion claim without evidence produced this turn; unprovable claims
  go on the Unverified List for per-item acknowledgment. For trivial work,
  this pass alone is the whole ceremony.

### Ship — hand it off honestly

- **`/i-ship`** — assemble the PR as a verifiable claim package: base
  synced, canonical check run, the diff self-reviewed cold, a body a
  stranger can act on, CI watched to green. Nothing claimed that didn't run
  this session.
- **`/i-document`** — the docs the change demands. Every claim is enforced,
  verified, or cut — a hedge is a claim nobody checked. Run every command
  the doc states.

### Setup — teach the suite your repo

- **`/i-setup`** — interview the repo and write `.claude/attest/project.md`
  and `security-model.md`. Skills ship the method; this writes down the
  specifics so no skill ever guesses your commands.

See [TEMPLATE.md](TEMPLATE.md) for the skeleton every skill follows.

## Design Principles

1. **Evidence over confidence.** No success claim without command output
   from this turn. Confidence is not evidence; neither is a previous run.
2. **The verdict block is byte-identical everywhere.** One contract, one
   source of truth, changed everywhere in the same commit or nowhere.
3. **Trigger-shaped descriptions.** Skills fire because their description
   states *when*, not *what* — no orchestrator required.
4. **Adapters, not hardcoding.** Skill bodies name no stack. Your repo's
   commands live in your repo.
5. **Rationalization tables are code.** Each skill lists the excuses an
   agent actually generates and refutes them mechanically.

## Credits

See [CREDITS.md](CREDITS.md) — this suite reimplements ideas with long
histories, and says where they came from.

## License

[MIT](LICENSE)
