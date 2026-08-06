---
name: i-execute
description: Use when executing a multi-task plan in one session — after /i-plan, when the tasks are mostly independent. Publishes the task roadmap as a live checklist, dispatches a fresh subagent per task, and reviews between tasks so drift is caught before it compounds.
---

# I Execute

**Core principle:** A plan runs task by task, each in a fresh mind, each reviewed before the next begins. You are the coordinator, not the implementer — your context stays clean for steering, and every task's work and review live in a subagent's context, not yours. Drift caught between tasks is cheap; drift found at the end is a rewrite.

## The Iron Law

```
THE ROADMAP IS PUBLISHED BEFORE TASK ONE. EVERY TASK IS REVIEWED BEFORE THE NEXT IS DISPATCHED. THE LEDGER OUTLIVES YOUR CONTEXT.
```

Skipping the between-task review to "keep momentum" is how task 3 builds on task 2's undetected mistake. And a coordinator who tracks progress only in conversation memory has, after one compaction, re-dispatched entire completed tasks — the single most expensive failure this skill exists to prevent.

## The Pass

1. **Publish the roadmap.** Turn the plan's tasks into a live checklist the user can see (the harness todo list — `TodoWrite`, task tool, or equivalent), one item per task, before any work starts. Mark each `in_progress` when dispatched and `complete` only when its review is clean. The checklist is the user's map of where the run is; a silent coordinator reads as a hung one.
2. **Open the ledger.** A file the run writes to, not just the todo list: first line names the plan, one line per task recording its commits and review verdict. It is the recovery map — after a compaction, trust the ledger and `git log` over your own recollection. Scan the plan once for internal contradictions before task one and batch them to the human; a clean scan proceeds silently.
3. **Dispatch one implementer per task, fresh.** Hand it exactly what it needs: where the task fits in one line, the task's requirements as a file (not pasted history), interfaces from earlier tasks it must match, and the report-file path. Never paste the session's accumulated state into a dispatch — a fresh subagent needs its task, not your transcript. Never run two implementers in parallel; they collide. Record the base commit before dispatching — the review diff needs it.
4. **Review every task before moving on — two verdicts, both required.** When the implementer reports done, dispatch the task review over its diff (`/im-a-code-reviewer` — its two axes, standards and spec, are exactly the between-task gate). Spec compliance AND quality both pass, or the task isn't done. The implementer's own self-review never substitutes for this. Hand the reviewer the diff as a file; its output never enters your context. **Risk surfaces gate here too:** a task whose diff touches the security model's surfaces (auth, tenancy, payments, secrets, sends) adds `/im-a-security-reviewer` at this gate, and one that touches a named hot path adds `/im-a-performance-reviewer` — specialists run in parallel with the task review (all read-only over the same diff file), and a specialist finding enters the same fix loop. Catching a scoping bug or an N+1 at task 2 is a fix; finding it at the final review is an excavation.
5. **Run the fix loop, capped.** On findings: send them verbatim to the implementer (resume it — its context is intact), it fixes and re-runs the covering tests, then one scoped re-review of just the fix. Five rounds maximum. At the cap, adjudicate each open finding in the ledger — parked with a ruling, or BLOCKED to the human if something downstream builds on it. Never fix findings yourself in the coordinator session; that pollutes your context and skips review.
6. **Final whole-branch review, then hand off.** After the last task, the branch gets its independent voices — dispatched **in parallel**, since every one is read-only over the same branch diff: `/im-an-adversary` always (clean-room, reviewer wrote none of it); `/im-a-security-reviewer` if any task touched the security model's surfaces; `/im-a-performance-reviewer` if any touched a named hot path or budget. Merge their findings, dedupe, then ONE fix wave for the lot — not one wave per reviewer — one scoped re-review, adjudicate residuals. Then `/i-ship`. The roadmap is all green and the ledger is the record.

**Boundary:** making the plan is `/i-plan`; the TDD inside a single task is `/i-code`; the between-task and final reviews are `/im-a-code-reviewer` and `/im-an-adversary`. This skill is the orchestration that strings them together and keeps each implementer's context clean.

## Progress Protocol

Long stretches with no output read as a hang, and users interrupt hangs — which discards in-flight subagent work and restarts the step. The run owes its user a feed:

- **Announce before every dispatch:** which task or reviewer is starting, what it's doing, and when the next message comes — a duration range if a prior run gives a real basis, otherwise "unknown duration, next update when it returns." Never invent an ETA; a blown fake ETA is what teaches people to interrupt.
- **Update at every boundary:** each subagent return, each fix-loop round, each roadmap checkmark — one plain line: what finished, what's next.
- **Escalating cadence in quiet stretches:** whenever you have the floor (between tool calls) and a minute has passed since the last message, post a one-line status and name the next interval — "next update in ~2 min," then ~3, and so on. The growing gaps keep a long run from flooding the transcript.
- **Be honest about mute stretches.** Nothing can be emitted while a blocking call is in flight. When the next step is one long blocking call, say so *before* it starts: "this review runs blind for ~5–8 min — silence until it returns is normal." Where the harness supports background dispatch with notifications, prefer it for any step expected past ~2 minutes; that is what makes real timed updates possible.
- **Point at the side chat, not the interrupt.** State once up front what interrupting costs (partial work discarded, the step restarts), and remind every few updates: questions and new ideas go to a side chat (`/btw` in Claude Code; elsewhere, a second session) so the run keeps moving while you talk.
- **On completion, report actual elapsed** beside the result, and append it to the timings ledger — `.claude/attest/timings.local.jsonl`, one line per run: `{"skill", "step", "date", "elapsed_s", "scope"}`. Read the same ledger before announcing any ETA: ranges come from this user's actual prior runs in this repo, or they're "unknown" — never invented. The ledger is per-user and gitignored (`/i-setup` creates it and the ignore entry).

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

- Work started before the roadmap checklist is visible to the user
- A step expected to run minutes dispatched with no announcement — the user's next move is the interrupt key
- A task marked complete while its review has unaddressed Critical/Important findings
- The next task dispatched before the current one's review came back
- A dispatch prompt carrying "state after tasks 1–3" instead of just this task's context
- Progress tracked only in conversation, no ledger file — one compaction from re-running finished work
- The coordinator fixing a finding itself instead of resuming the implementer
- Two implementer subagents running at once

## Rationalizations

| Excuse | Reality |
|---|---|
| "Reviewing between tasks slows the run" | The run without reviews is unverified churn. The review is the steering, not the drag. |
| "I'll just implement this task myself, dispatching is overhead" | Coordinator implementations pollute your context and skip the review gate. Dispatch it. |
| "The todo list is enough, no ledger needed" | The todo list dies with your context. The ledger and git survive the compaction that erases both. |
| "Pasting prior-task summaries helps the subagent" | It buries the task in transcript and re-enters your context every turn. Hand it a file. |
| "One more fix round will converge" | Past the cap, rounds don't converge — the failure is structural. Adjudicate and route. |
| "Final review is redundant after per-task reviews" | Per-task reviews see one task; the final sees their interactions. Different bugs. |

## Project Specifics

Read `.claude/attest/project.md` for the test/check commands each task must pass, how subagents are dispatched in this harness, and where the ledger and plan live. If it is missing, run `/i-setup` — do not guess.
