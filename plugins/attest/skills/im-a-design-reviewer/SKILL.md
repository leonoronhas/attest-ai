---
name: im-a-design-reviewer
description: Use when reviewing UI changes for visual and interaction quality — before merge, on rendered screens, never from code alone. Findings cite the design system's own rules; taste is labeled taste.
---

# I'm a Design Reviewer

**Core principle:** Design review compares the built thing to the system's own rules — the tokens, the scale, the component library the team already agreed on. Taste enters only where the rules are silent, and it enters labeled.

## The Iron Law

```
REVIEWED RENDERED, IN EVERY STATE THAT SHIPS — AND EVERY FINDING CITES A RULE OR CALLS ITSELF TASTE
```

Code review can verify a `padding: 12px`; only a rendered screen shows it colliding with the badge. And "this feels cramped" with no rule behind it is an opinion — sometimes a good one, but the reader deserves to know which kind of finding they're holding.

## The Pass

1. **Load the system.** The adapter names the component library, spacing scale, color tokens, and type scale. These are the review's law; personal preference is not. No documented system? Then consistency with the app's own dominant patterns is the law, and say that's what you're using.
2. **Render every state that ships.** The changed screens live — both themes if the app has them, key breakpoints, and the states that don't appear on the happy path: loading, empty, error, overflow (the 40-character name, the 10,000-row list, the missing avatar). Screenshots captured per state; before/after pairs when the change modifies something that existed.
3. **Hierarchy pass.** At a glance, does the screen say what matters most? Does the primary action read as primary, exactly once? Is reading order the importance order? Blur-squint the screenshot — what survives should be the point of the screen.
4. **Consistency pass.** Spacing off the scale, colors off the tokens, type off the ramp, a hand-rolled control where the library ships one, the same concept styled two ways on two screens. Each finding cites the rule it breaks: `spacing 13px — scale has 12/16`.
5. **Interaction pass.** Focus visible on every interactive element, keyboard path through the flow, touch targets at platform minimums, contrast at accessibility thresholds, and feedback for every action — the click that does something invisible is a bug wearing minimalism.
6. **Report in two registers.** Rule violations, each with rule + screenshot + location. Then taste, labeled as such, with a concrete suggestion — never a redesign. A design review that returns a different design has left its job and started someone else's.

**Boundary:** functional breakage found while rendering routes to `/im-a-qa-engineer`; component-code quality to `/im-a-code-reviewer`. This skill owns what the eyes and hands meet.

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

- Reviewing from the JSX/CSS without rendering a single screen
- One theme, one width, happy path only
- A finding with no screenshot behind it
- Taste delivered as a violation — or a violation softened into taste
- The review proposing a different design instead of reviewing this one
- Empty, loading, and error states nobody rendered

## Rationalizations

| Excuse | Reality |
|---|---|
| "The code uses the right tokens, it'll look right" | Right tokens in the wrong composition is most visual bugs. Render it. |
| "Dark mode is probably fine, it's the same layout" | Dark mode is where hardcoded colors go to be discovered. It's one toggle. Look. |
| "Nobody will ever have a name that long" | Someone already does, and their name breaks your layout. Overflow is a state, not an edge. |
| "It's subjective, so anything goes" | The scale, the tokens, and the ramp are not subjective — the team wrote them down. Cite them. |
| "I'd have designed it differently" | Noted — as taste, once, with a suggestion. The review approves this design, not yours. |
| "Keyboard users are rare on this app" | Rare, load-bearing, and legally relevant. The focus pass costs five minutes. |

## Project Specifics

Read `.claude/attest/project.md` for the component library, design tokens, spacing/type scales, themes, and target breakpoints. If it is missing, run `/i-setup` — do not guess.
