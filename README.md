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

Then, in each repo that uses it:

```
/i-setup
```

`/i-setup` interviews the repo and writes `.claude/attest/project.md`
(commands, layout, guards) and `.claude/attest/security-model.md` (that
project's sensitive surfaces). Skills ship the method; the adapter supplies
the specifics. No skill ever guesses your test command.

## The Family

Two naming patterns: `i-<verb>` performs an action, `im-a-<role>` adopts a
reviewer stance.

| Phase | Skill | Status |
|---|---|---|
| Verify | `/i-attest` — the exit contract every skill ends in | ✅ |
| Setup | `/i-setup` — writes the project adapter | ✅ |
| Review | `/im-an-adversary` — clean-room reviewer on a model that wrote none of the code, primed to refute | ✅ |
| Build | `/i-code` — TDD at confirmed seams | ✅ |
| Review | `/im-a-code-reviewer` — two-axis: standards vs spec | ✅ |
| Review | `/im-a-security-reviewer` — reads the project's security model | ✅ |
| Review | `/im-a-security-auditor` — codebase-wide deep security review; findings survive refutation or die | ✅ |
| Review | `/i-simplify` — hunts over-engineering; every finding names its replacement | ✅ |
| Build | `/i-debug` — root cause before hypothesis; 3 failed fixes ⇒ question the architecture | ✅ |
| Build | `/i-migrate` — schema changes with guards, dry-runs, rollback notes | ✅ |
| Decide | `/i-interrogate` — one question at a time, recommendation attached | ✅ |
| Decide | `/i-plan` — mini-plan, or a decision-ticket map for work bigger than one session | ✅ |
| Build | `/i-execute` — runs a plan: live roadmap, fresh subagent per task, review between tasks | ✅ |
| Understand | `/i-explore` — locations with evidence; absence claims name the searches that failed | ✅ |
| Understand | `/i-research` — primary sources, version-pinned, captured in the repo | ✅ |
| Decide | `/i-design` — two designs minimum, judged at the interface, deletion test | ✅ |
| Build | `/i-refactor` — behavior pinned first, green at every step, never mixed | ✅ |
| Review | `/im-a-design-reviewer` — rendered in every state; findings cite rules or call themselves taste | ✅ |
| Review | `/im-a-dx-engineer` — audits by performing the journey, timed, from clean | ✅ |
| Verify | `/im-a-qa-engineer` — objective signals decide; every bug becomes a spec | ✅ |
| Ship | `/i-ship` — the PR as a verifiable claim package; CI watched to green | ✅ |
| Ship | `/i-document` — every claim enforced, verified, or cut; no hedges | ✅ |
| Intake | `/im-a-tpm` — problem, metric, why now, smallest version — before any ticket | ✅ |

The full family is live. See [TEMPLATE.md](TEMPLATE.md) for the skeleton and
family rules; new skills follow it, spine byte-identical.

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
