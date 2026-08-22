# The Flock Standard — Specification

**Version 0.1.0 (draft)** · Versioned with [SemVer](https://semver.org); `0.x` means the
spec is still evolving and minor versions may break.

The key words MUST, SHOULD, and MAY are to be interpreted as described in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## 1. The FLOCK.md file

- A conforming repository MUST contain a file named `FLOCK.md` at the repository root.
- The file MUST be valid GitHub-flavored Markdown. There is no schema; structure is
  expressed with the headings defined below.
- The file SHOULD begin with a declaration line, as a blockquote directly under the
  title, naming the spec version and profile:

  ```markdown
  # FLOCK.md
  > flock: 0.1 · profile: core
  ```

- Paths in `FLOCK.md` are relative to the repository root.

## 2. The core profile

The core profile is the minimum conforming adoption.

### 2.1 Docs Map (required)

`FLOCK.md` MUST contain a `## Docs Map` section with a table of at least three columns:

| Column | Meaning |
|---|---|
| **Type** | The kind of document (free vocabulary in core profile) |
| **Where** | Path or glob where documents of this type live |
| **Answers** | The question a reader goes there to answer |

Every documentation location a contributor is expected to know about SHOULD have a row.
A location not listed in the Docs Map is, by definition, not part of the repo's
knowledge contract.

### 2.2 Index (recommended)

`FLOCK.md` SHOULD contain a `## Index` section pointing at one file that lists ongoing
and planned work, one line per item, each line linking to the relevant document.

**The index is an index, not a journal.** Detail lives in the linked documents; the
index only answers "what exists, in what state, where do I read more." Keeping index
entries short is what keeps the index readable by both humans and agents.

### 2.3 Status Labels (recommended)

`FLOCK.md` SHOULD contain a `## Status Labels` section declaring the vocabulary used to
mark the state of work. The recommended default vocabulary:

| Label | Meaning |
|---|---|
| `Design` | Being specified; no implementation yet |
| `Building` | Implementation in progress |
| `Done <date>` | Shipped; the date is part of the label |
| `Parked` | Deliberately not being worked on; the reason is recorded |

A repo MAY declare its own vocabulary instead; declaring it is what matters.

## 3. The flow profile

The flow profile is a superset of the core profile for projects that run a full
design-to-delivery cycle. It fixes the **Type** vocabulary of the Docs Map to a chain of
document kinds:

| Kind | Answers | Typical location |
|---|---|---|
| `brd` *(optional)* | Why is this worth building, for whom, and how is success measured? | `docs/brd/` |
| `feature` | What are we building, and what is the user experience? | `docs/feature/` |
| `blueprint` | How exactly will it be built? | `docs/blueprints/` |
| `worklog` | What actually happened while building it? | `docs/worklog/` |
| `index` | What exists, in what state? | `docs/ROADMAP.md` |

Rules:

- Each `feature` SHOULD link to its `blueprint` and `worklog`, and each of those MUST
  link back to its `feature` — a reader landing on any of the three can reach the other
  two ("three-way linking").
- A `blueprint` SHOULD describe the current state of the code as measured, not as
  remembered, and SHOULD break work into rounds that each stand alone.
- A `worklog` entry SHOULD be appended when a round of work closes, and SHOULD record
  deviations from the blueprint and decisions that emerged during the work.
- A `feature` SHOULD state what is explicitly out of scope, and SHOULD define done as
  something observable from outside the code.
- One `brd` MAY cover several `feature` documents.

## 4. History conventions

These rules apply to all profiles and are the heart of the standard: they keep a repo's
recorded reasoning trustworthy over time — for the humans who return to it and for the
agents that will otherwise confidently re-litigate or refactor away decisions.

1. **Decisions carry dates.** A recorded decision SHOULD carry the date it was made,
   inline: `(decided 2026-08-22)`.
2. **Supersede in place.** Reversing a recorded decision MUST NOT silently delete it.
   Patch the document where the old decision lives: mark it `**SUPERSEDED <date>**`,
   keep the old text as context (strikethrough is fine), and state the new decision
   next to it.
3. **Record the road not taken.** When an alternative was seriously considered and
   rejected, record it and the reason. The rejected option is what stops the same
   debate from being reopened later.

## 5. Agents

- An agent working in a conforming repository SHOULD read `FLOCK.md` before creating or
  moving documentation, and SHOULD place new documents according to the Docs Map.
- Agents MUST follow the history conventions of §4 — in particular, agents MUST NOT
  delete or rewrite recorded decisions; they supersede them in place.
- `FLOCK.md` complements `AGENTS.md`; it does not replace it. Repos with an `AGENTS.md`
  SHOULD reference `FLOCK.md` from it.

## 6. Conformance summary

| Level | Requirements |
|---|---|
| **Core** | `FLOCK.md` at root · Docs Map section |
| **Flow** | Core, plus the §3 kind vocabulary and linking rules |

Everything not marked MUST is guidance: adopt what earns its keep.
