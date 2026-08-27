# The Flock Standard — Specification

**Version 0.3.0 (draft)** · Versioned with [SemVer](https://semver.org); `0.x` means the
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
  > flock: 0.3 · profile: core
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

The **Where** cell SHOULD contain the path or glob and nothing else. A tool reads the
cell as a literal path, so an annotation glued to it — a file count, a note — turns the
row into a location that does not exist, and the failure is silent. Annotations belong
in **Answers**.

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
design-to-delivery cycle. Its heart is the **question chain**:

> **Why → What → How → What happened.** Four questions, four documents, three-way
> linked. A unit of work is done when all four have written answers; the index answers
> the fifth — *where is everything, in what state?* — for every unit of work at once.

The chain fixes the **Type** vocabulary of the lifecycle kinds:

| Question | Kind | Answers | Typical location |
|---|---|---|---|
| **Why?** | `brd` *(optional)* | Why is this worth building, for whom, and how is success measured? | `docs/brd/` |
| **What?** | `feature` | What are we building, and what is the user experience? | `docs/feature/` |
| **How?** | `blueprint` | How exactly will it be built? | `docs/blueprint/` |
| **What happened?** | `worklog` | What actually happened while building it? | `docs/worklog/` |
| *Where?* | `index` | What exists, in what state? | `docs/ROADMAP.md` |

The chain fixes the lifecycle, not the whole map: kinds outside the chain
(`technical`, `business`, …) MAY be declared as additional Docs Map rows. Typical
locations are defaults, not requirements — the Docs Map declares the actual path, so
a repo already using, say, `docs/blueprints/` stays conforming without renaming.

A flow-profile `FLOCK.md` SHOULD carry two sections beyond the core three: a
`## Lifecycle` section stating the chain and how this repository runs it, and a
`## Conventions` section restating the §4 history rules — the shape
[`FLOCK_FLOW.md`](templates/FLOCK_FLOW.md) scaffolds. "Lifecycle" names the chain;
the states a piece of work moves through are Status Labels (§2.3).

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
- One `brd` MAY cover several `feature` documents. A `feature` MAY link to the `brd`
  it descends from via the `**Brd:**` label (§3.1); the link is one-way, feature → brd
  — a brd is not required to enumerate its features.

### 3.1 Document label block *(new in 0.2)*

Each flow document SHOULD open with a label block: bold labels, one per line, directly
under the H1 title. Recognized labels:

| Label | In | Meaning |
|---|---|---|
| `**Status:**` | all three kinds | A declared status label (§2.3), optionally with a date |
| `**Target:**` | feature | The version or milestone the work currently aims at *(optional)* |
| `**Brd:**` | feature | Link to the brd this feature descends from *(optional, new in 0.3)* |
| `**Feature:**` | blueprint, worklog | Link back to the feature document |
| `**Blueprint:**` / `**Worklog:**` | feature | Links completing three-way linking; `—` until the file exists |

A document MAY carry additional labels. A tool MUST ignore labels it does not recognize,
and MUST NOT remove them.

### 3.2 Templates *(new in 0.2)*

Starter skeletons live in [`templates/`](templates/): the three document kinds —
[`FEATURE.md`](templates/FEATURE.md) · [`BLUEPRINT.md`](templates/BLUEPRINT.md) ·
[`WORKLOG.md`](templates/WORKLOG.md) — and the `FLOCK.md` entry point per profile —
[`FLOCK_CORE.md`](templates/FLOCK_CORE.md) · [`FLOCK_FLOW.md`](templates/FLOCK_FLOW.md).
`<angle-bracket>` spans are placeholders.

A tool that scaffolds flow documents SHOULD start from these templates. The templates
define the skeleton — headings, label block, the questions each section answers — not
the prose; a repo MAY extend them, and existing documents that grew organically are not
made non-conforming by them.

### 3.3 Machine-writable index *(new in 0.2)*

An index MAY be machine-writable: a GFM table whose header row is exactly

```markdown
| Item | Target | Status | Docs |
```

(the `Target` column MAY be omitted, giving `| Item | Status | Docs |`), with one row
per item:

- **Item** — name plus at most one clause saying what it is.
- **Target** — the version or milestone aimed at, matching the feature's `**Target:**`.
- **Status** — a declared status label (§2.3), optionally with a date.
- **Docs** — link(s), at minimum to the feature document.

A tool adding an item appends one row to this table and updates the row's Status when
the document's Status changes. If the index contains no such table, the tool MUST NOT
guess where to write — it SHOULD hand the formatted row to a human to place. A richer,
hand-maintained index is still conforming; machine-writability is opt-in.

### 3.4 Stage transitions *(new in 0.2)*

Three transitions are common enough to name, so tools can offer them:

- **Adopt** *(no `FLOCK.md` → core or flow)*: create `FLOCK.md` at the repository root
  from the matching profile template. For the flow profile, also create the index file
  it references, seeded with the §3.3 table header — so Open has somewhere to write.
  In a repository that already has documentation, Adopt is declarative: the Docs Map
  points at documents where they already are (typical locations are defaults, not
  requirements), and the transition MUST NOT move, rename, or rewrite existing files.
  Backfilling is not required — neither index rows for finished work nor §4 dates in
  pre-existing documents; the conventions apply from adoption forward.
- **Open** *(nothing → `Design`)*: create the feature document from its template and add
  an index row.
- **Advance** *(`Design` → `Building`)*: create the blueprint and worklog from their
  templates, complete the three-way links, and update Status in both the feature
  document and the index.

A tool performing any of these transitions SHOULD leave the results as uncommitted
changes for a human to review, and MUST NOT overwrite an existing file or commit on its
own.

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
- `FLOCK.md` complements `AGENTS.md`; it does not replace it. A repo that keeps an
  instruction file for agents — `AGENTS.md`, `CLAUDE.md`, or a tool-specific
  equivalent — SHOULD reference `FLOCK.md` from it.
- In a flow-profile repo, an agent opening or advancing work SHOULD use the §3.4
  transitions and the §3.2 templates rather than inventing structure.

## 6. Version compatibility *(new in 0.2)*

The declaration line names a spec version, and `0.x` minor versions may break. So
tools and repositories will disagree about versions routinely, and the disagreement
must be survivable rather than fatal.

- A tool MUST NOT refuse a repository because its declared version differs from the
  tool's own — including a version the tool has never heard of. `FLOCK.md` is
  markdown; a reader that cannot use a section can still show it to a human.
- A tool SHOULD keep reading adoptions of earlier `0.x` versions. Features that
  depend on something a later version introduced degrade quietly on a repository
  that predates it — the absence of a §3.3 index table in a 0.1 adoption is not an
  error, it is a 0.1 adoption.
- A tool that writes documents SHOULD say when it writes them in the shape of a
  version other than the one the repository declares, so the difference is a choice
  the user saw rather than a surprise found later in a diff.
- A tool SHOULD treat an undeclared or unparseable version as "unknown" and behave
  as it would for its own version, rather than guessing high or low.
- Repositories are not expected to chase the spec. Bumping the declaration line is
  something an adopter does when they adopt something new, not maintenance the
  standard asks of them.

## 7. Conformance summary

| Level | Requirements |
|---|---|
| **Core** | `FLOCK.md` at root · Docs Map section |
| **Flow** | Core, plus the §3 kind vocabulary, linking rules, and the `## Lifecycle` / `## Conventions` sections |
| **Flow, machine-writable** *(opt-in)* | Flow, plus the §3.1 label block and a §3.3 index table |

Everything not marked MUST is guidance: adopt what earns its keep.
