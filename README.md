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
close. The table runs in the order work tends to flow.

| Phase | Skill | What it does |
|---|---|---|
| **Intake** | `/im-a-tpm` | Recover the problem behind a pre-solutioned request; demand a metric and a why-now; steelman *not* building it; cut to the smallest version that tests the idea. |
| **Understand** | `/i-explore` | Locate things *inside* the codebase. Read-only; every cited location was opened, and "doesn't exist" names the searches that failed. |
| | `/i-research` | Establish facts from *outside* the codebase — library, API, platform limit. Primary sources, pinned to the installed version, written to the repo. |
| **Decide** | `/i-interrogate` | Open questions that are the human's to answer — one at a time, each with a recommendation; budget scales by risk, never by who's asking. |
| | `/i-design` | Shape a module before building. Write the call site first, design it *twice*, judge at the interface with the deletion test, record the rejected design. |
| | `/i-plan` | A five-line mini-plan for one session, or a decision-ticket map for bigger work. Every task independently rejectable, every unknown named, no placeholders. |
| **Build** | `/i-code` | TDD at confirmed seams. Watch the test fail first; expected values from an independent source; mocks only at system boundaries. |
| | `/i-execute` | Run a whole plan in one session: live roadmap checklist, a fresh subagent per task, review between tasks, a ledger that survives compaction. |
| | `/i-debug` | Reproduce before you fix; one hypothesis at a time; fix at the root all callers route through. Three failed fixes ⇒ the architecture is the bug. |
| | `/i-refactor` | Change structure while behavior stays identical. Behavior pinned first, green after every small step, never mixed with a behavior change. |
| | `/i-migrate` | Guard before write, dry-run before apply, rollback note before merge. Constraints only fail on writes — so no migration is done until it accepts a real row. |
| | `/i-simplify` | Hunt over-engineering, in a diff or repo-wide. Climb the ladder (reuse → stdlib → native → installed dep → new code); every finding names its replacement. |
| **Review** | `/im-a-code-reviewer` | Two axes kept apart: does it follow the repo's standards, and does it do what the spec asked — reported separately so neither buries the other. |
| | `/im-an-adversary` | A clean-room reviewer on a model that wrote none of the code, primed to refute. Independence is a context property first, a model property second. |
| | `/im-a-security-reviewer` | One diff against the project's own threat model. Trace the boundaries it touches; exercise the rejection path, don't just read it. |
| | `/im-a-security-auditor` | The codebase-wide deep sweep — untrusted input to dangerous sinks across nine scanner passes; every finding re-traced against the code or dropped. |
| | `/im-a-design-reviewer` | UI reviewed *rendered*, in every state that ships, both themes. Findings cite the design system's rules; taste is labeled taste, never a redesign. |
| | `/im-a-dx-engineer` | Audit the repo by *performing* the journey from a clean clone, timed. Broken / friction / missing — each with the stumble that proves it. |
| **Verify** | `/im-a-qa-engineer` | Drive the real app where users touch it. Objective signals decide pass/fail; judgment produces findings; every bug found becomes a permanent spec. |
| | `/i-attest` | The exit contract every skill ends in. No completion claim without evidence this turn; unprovable claims go on the Unverified List. Whole ceremony for trivial work. |
| **Ship** | `/i-ship` | The PR as a verifiable claim package: base synced, canonical check run, diff self-reviewed cold, a body a stranger can act on, CI watched to green. |
| | `/i-document` | The docs the change demands. Every claim enforced, verified, or cut — a hedge is a claim nobody checked. Run every command the doc states. |
| **Setup** | `/i-setup` | Interview the repo and write `.claude/attest/project.md` + `security-model.md`, so no skill ever guesses your commands. |

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
