---
name: im-a-security-auditor
description: Use for a deep security review of source code — a diff, a branch, named files, or a whole codebase — whenever the user asks "is this safe / exploitable", requests a security review or audit, or the code handles untrusted input, auth, file paths, network requests, crypto, or serialization (even if they don't say "security"). Traces untrusted input to dangerous sinks; every finding is re-verified against the code before it ships.
---

# I'm a Security Auditor

**Core principle:** Almost every vulnerability is the same shape — untrusted data (a source) reaches a powerful operation (a sink) without the right control in between. The audit traces those paths. Its worth is set by signal: a report that buries one real bug under forty theoretical ones protects nothing.

## The Iron Law

```
EVERY FINDING IS RE-TRACED SOURCE-TO-SINK AGAINST THE ACTUAL CODE, OR IT DOES NOT SHIP
```

A focused scanner over-reports by design. A finding relayed straight from a scanner without the orchestrator re-opening the code and confirming the path is unverified, and unverified findings destroy a report's credibility faster than missed ones do.

## Sources → Sinks Across Trust Boundaries

The mental model the whole pass runs on:

1. **Sources** — where attacker-controlled data enters: HTTP params/body/headers/cookies, uploads, query strings, tenant-scoped env, queues, deserialized blobs, filenames, inter-service calls. Treat all of it as hostile.
2. **Sinks** — where data does something powerful: SQL/NoSQL, shell/`exec`, template rendering, HTML output, file paths, outbound HTTP, `eval`, deserializers, redirects, memory ops, auth decisions, crypto.
3. **The boundary** — for each source→sink path, ask whether the data is validated, parameterized, encoded, or authorized *correctly for that specific sink*. HTML-encoding does nothing for SQL; an extension check does nothing against `../`. The mismatch is where bugs live.
4. **What's missing** — many high-severity bugs (IDOR, missing authz, CSRF) are the *absence* of a check. Look for the check that should be there and isn't.

## The Pass

Publish these steps as a live checklist before you start (the harness todo tool); mark each done only when its evidence lands. Announce any step likely to exceed a minute before it starts — what's running, when the next update comes (real basis or "unknown") — and post one-line updates at escalating intervals (1 → 2 → 3 min) whenever a quiet stretch allows. Route mid-run questions to a side chat (`/btw` in Claude Code; elsewhere, a second session) instead of interrupting — interrupting discards in-flight work. Ground every ETA in the timings ledger (`.claude/attest/timings.local.jsonl`) and append this run's elapsed on completion.

1. **Orient and set scope.** Language, framework, what the code does, trust boundaries, assets worth protecting. Then pin the scope — uncommitted changes, branch-vs-base, a named range, or the whole codebase. If the user didn't say and more than one reading is plausible, **ask before scanning**: a security review of the wrong scope wastes the entire pass. Load `.claude/attest/security-model.md` to order the sweep by this project's real blast radius.
2. **Enumerate sources and sinks** for the scoped code — one shared map handed to every scanner so they don't each rediscover it.
3. **Fan out — one scanner per vulnerability family.** Nine scanners: eight pattern-based (Injection SQL/cmd/code/XSS · XXE & ReDoS · Path & Network · Auth & Access · Memory safety · Cryptography · Deserialization · Protocol & Encoding) plus an open-ended **Exploratory** pass for business-logic and novel issues the pattern scanners miss. Each scanner reads only its section of [references/vulnerability-catalog.md](references/vulnerability-catalog.md), scans its class only, and reports *every* candidate — recall over precision here, because verification restores precision later. Dispatch as parallel subagents where available; where not, run them sequentially, one class to completion at a time. Skip a clearly-inapplicable family (memory safety in a pure-Python web app) only by saying so, never silently. The exploratory scanner always runs.
4. **Fan in.** Collect all scanners' findings into one list once every scanner has returned — then dedupe and cross-reference, since one line may be flagged by several classes and one bug may enable another (SSRF → metadata creds → privesc).
5. **Verify every finding yourself — mandatory, orchestrator only.** Per finding: re-open the cited code (scanners misremember lines and hallucinate sinks); re-trace the source→sink path (a "source" that's actually constant or already-validated is a false positive — drop it); re-test the control (a scanner in isolation misses a mitigation applied elsewhere). Settle a verdict: CONFIRMED only with a traced exploitable path this turn, PLAUSIBLE with the unproven assumption named, or discarded. Record a one-line verification note per survivor.
6. **Rate, report, ratchet.** Severity = impact × exploitability (Critical/High/Medium/Low/Informational), reasoning stated not asserted. Per finding: location, class + CWE, what, why-exploitable with a minimal illustrative trigger (never a turnkey exploit), and the concrete fix naming the safe API. Highest-impact first. Prepare a tracked-issue draft for every confirmed finding; create it only with the user's explicit tracker-write authorization. New sensitive surfaces found en route get added to `security-model.md` so the audit leaves the threat model sharper than it found it.

## Delivery

The findings exist independently of format. Offer the choice rather than dumping: **in chat** (per-finding, prioritized summary first — good for pasting into a tracker) or a **self-contained HTML report** (severity dashboard, source→sink data-flow diagrams, before/after fix comparisons, remediation roadmap — good for stakeholders or many findings). Honor an up-front preference and skip the question.

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

- A scanner's finding relayed into the report without the orchestrator re-tracing it
- The sweep starting alphabetically instead of in blast-radius order
- A finding with no written source→sink path and no minimal trigger
- A family silently skipped instead of declared inapplicable
- The exploratory scanner cut for time — it catches the highest-impact, hardest-to-spot bugs
- An audit ending with findings but neither issue drafts nor an explicit decision to defer them
- A turnkey exploit written where a minimal proof-of-concept was the job

## Rationalizations

| Excuse | Reality |
|---|---|
| "More findings means a more thorough audit" | More *confirmed* findings does. Volume without verification is where the real bug hides. |
| "The scanner is usually right, skip verification" | Usually-right at scale is wrong steadily. The verification pass is the audit's signature. |
| "One combined scan is faster than nine" | One scan satisfices after two bugs. Per-class focus is what stops it quitting early. |
| "This hardening gap is worth flagging" | In a backlog, yes. In the report, it's noise wearing a severity label. |
| "I'll file the issues after the report circulates" | Reports circulate into archives; prepare the issue drafts now, then create them when authorized. |
| "Client-side check missing — easy finding" | Easy and invalid. The server owes the check; audit the server. |

## Boundary

One diff before merge, gate-scoped against the project's threat model, is `/im-a-security-reviewer`. This skill is the deep sweep — periodic, pre-launch, and after the threat model materially changes. Run it on a cadence, not once.

## Project Specifics

Read `.claude/attest/security-model.md` for this project's threat surfaces and `.claude/attest/project.md` for the tracker (where findings become issues) and source roots to sweep versus skip. If either is missing, run `/i-setup` — do not guess. A filled security model is a disclosure document: keep it private.
