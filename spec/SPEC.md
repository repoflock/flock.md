# The Flock Standard — Specification

**Version 0.5.0 (draft)** · Versioned with [SemVer](https://semver.org); `0.x` means the
spec is still evolving and minor versions may break.

The key words MUST, SHOULD, and MAY are to be interpreted as described in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## 1. The FLOCK.md file

- A conforming repository MUST contain a file named `FLOCK.md` at the repository root.
- The file MUST be valid GitHub-flavored Markdown. There is no schema; structure is
  expressed with the headings defined below.
- The file SHOULD begin with a declaration line, as a blockquote directly under the
  title, naming the spec version:

  ```markdown
  # FLOCK.md
  > flock: 0.5
  ```

  Versions 0.1–0.3 wrote a second field, `· profile: core` or `· profile: flow`. The
  field is gone (§7 says why); a tool MUST ignore it where it still appears, and an
  adopter has nothing to change.

- Paths in `FLOCK.md` are relative to the repository root.

## 2. The sections of FLOCK.md

One section is required; the rest are where the file earns its keep.

### 2.1 Docs Map (required)

`FLOCK.md` MUST contain a `## Docs Map` section with a table of at least three columns:

| Column | Meaning |
|---|---|
| **Type** | The kind of document — free vocabulary, except the kinds §3 names |
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

**The index is for work that has not shipped.** A line whose work has shipped in a
released version SHOULD leave the index — it moves, verbatim, to the shipped ledger
(§3.6) when the repository declares one. A repository that declares no ledger keeps
its finished lines in the index; that is a conforming 0.1–0.3 shape, not an error.
Short entries keep the index readable; leaving is what keeps it short — measured before
this rule existed, the standard's largest source adoption had 137 of 173 index lines
finished, 98 of them shipped in a tagged release, and the file at 112 KB.

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

### 2.4 Conventions (recommended)

`FLOCK.md` SHOULD contain a `## Conventions` section restating the §4 history rules,
so a reader who opens nothing else still meets them. The rules bind every adoption
whether or not the section exists; the section is where the repo says so.

### 2.5 Roles (optional) *(new in 0.5)*

`FLOCK.md` MAY contain a `## Roles` section answering a question the chain does not ask:
**who owns what?** The chain asks four questions about one unit of work and the index
answers a fifth for all of them (§3); `## Roles` answers a sixth for the whole
repository — which role owns which kind, and what that role decides. It is a table:

| Column | Meaning |
|---|---|
| **Role** | A role name — free vocabulary |
| **Owns** | What the role is responsible for: kinds, named by their Docs Map **Type**, and things that are not documents — code, a gate, a release |
| **Decides** | The decisions that are this role's to make, and the ones that are explicitly not |

Rules:

- **Owns** SHOULD name kinds by their Docs Map Type, so a tool can join the two tables.
  A kind outside the chain is as valid an entry as one inside it.
- **The table divides work, not authority.** A tool MAY show which role owns a kind; it
  MUST NOT infer from the table who may read or write anything.
- **The table names roles, not people, agents or models.** Who plays a role — and which
  model, where an agent does — is cast in the agent instruction file (§5), where names
  are allowed to change monthly; the standard names no vendor. Who is working on a unit
  of work *right now* is tracker state, not a label: it changes daily and does not live
  in git.
- A repository with one contributor MAY still declare roles when agents play some of
  them. The role worth declaring first is the one that holds `**Audit:**` (§3.1) — it
  is the only role the lifecycle checks.

Two illustrative tables, from the adoptions that piloted the section. They are examples,
not vocabularies: copy one, rename roles, merge rows. The standard has no preset field
and no list of team types — a team is whatever its table says.

A software team:

| Role | Owns | Decides |
|---|---|---|
| owner | — | every dated decision; the spoken go-ahead when `**Audit:**` still means *not yet* |
| architect | `brd` · `feature` · `blueprint` · the `**Audit:**` field · reading the `worklog` back | the scope of a round or sprint, its definition of done, the merge at its end |
| builder | code · `worklog` (appended when a round closes) | nothing about scope — a deviation from the blueprint is written into the worklog, not decided in code |
| designer | `design` | screens and tokens; a port that drifts is an issue for the builder, not a fix in the code |

A video production team, where episodes live outside the chain as data (kinds `episode`,
`calendar`, `channel`) and the chain is run for the rendering engine:

| Role | Owns | Decides |
|---|---|---|
| producer | — | every dated decision: niche, cadence, the measurement milestones; the two gates — approving a script, and pressing publish |
| writer | `brd` · `feature` · `blueprint` · `calendar` · in `episode`: the script and every word spoken or shown, the publish copy | topic, angle and order of episodes (proposed; the producer decides); does not run voice or render, does not touch the engine |
| editor | in `episode`: scene composition, narration timing, illustrations; all engine code; voice · render · thumbnails; `worklog` | picture and pacing; a deviation from the blueprint goes into the worklog; a new engine op is a feature document in the chain, not a patch inside the episode; does not change a spoken word, does not approve, does not publish |

## 3. The lifecycle

The standard is built around one **question chain**, and a repository declares in its
`## Lifecycle` section whether and how it runs it. Nothing in this section is required
of a repository that runs no lifecycle — the Docs Map is the only MUST — but a
repository that does run one SHOULD run this one, so that tools and readers meet the
same shape everywhere:

> **Why → What → How → What happened.** Four questions, four documents, three-way
> linked. A unit of work is done when all four have written answers; the index answers
> the fifth — *where is everything, in what state?* — for every unit of work at once.

A sixth question — *who owns what?* — is about the repository rather than a unit of
work, and is answered by `## Roles` (§2.5), not by a document in the chain.

The chain fixes the **Type** vocabulary of the lifecycle kinds:

| Question | Kind | Answers | Typical location |
|---|---|---|---|
| **Why?** | `brd` *(optional)* | Why is this worth building, for whom, and how is success measured? | `docs/brd/` |
| **What?** | `feature` | What are we building, and what is the user experience? | `docs/feature/` |
| **How?** | `blueprint` | How exactly will it be built? | `docs/blueprint/` |
| **What happened?** | `worklog` | What actually happened while building it? | `docs/worklog/` |
| *Where?* | `index` | What exists, in what state? | `docs/ROADMAP.md` |

The chain fixes the lifecycle, not the whole map: kinds outside the chain
(`technical`, `business`, …) MAY be declared as additional Docs Map rows. Two such kinds
have fixed names. `shipped` has one because a tool writes to it: the ledger the index
releases finished rows into (§3.6). `research` has one because other documents link to
it *(new in 0.5)*: a dated snapshot of what was measured outside the repository and
from which sources — facts and conclusions, never decisions. The decisions a research
document informs are written in the `brd` or `feature` that cites it, where they get a
date and can be superseded (§4); a research document is not a stage of the chain, it is
what the chain's *Why* cites. Typical location `docs/research/`, one topic per file
with the date in the name; the Docs Map MAY point outside the repository for this kind,
since research often serves several repositories at once. Typical
locations are defaults, not requirements — the Docs Map declares the actual path, so
a repo already using, say, `docs/blueprints/` stays conforming without renaming.

A repository that runs the chain SHOULD carry a `## Lifecycle` section stating the
chain and how this repository runs it — the shape [`FLOCK.md`](templates/FLOCK.md)
scaffolds. "Lifecycle" names the chain; the states a piece of work moves through are
Status Labels (§2.3). A repository that runs no lifecycle omits the section; a
repository that runs a different one declares it there, and §3.1–§3.6 simply have
nothing to read.

Rules:

- Each `feature` SHOULD link to its `blueprint` and `worklog`, and each of those MUST
  link back to its `feature` — a reader landing on any of the three can reach the other
  two ("three-way linking").
- A `blueprint` SHOULD describe the current state of the code as measured, not as
  remembered, and SHOULD break work into rounds that each stand alone. §3.5 gives the
  round list a machine-readable shape.
- A `worklog` entry SHOULD be appended when a round of work closes, and SHOULD record
  deviations from the blueprint and decisions that emerged during the work.
- A `feature` SHOULD state what is explicitly out of scope, and SHOULD define done as
  something observable from outside the code.
- One `brd` MAY cover several `feature` documents. A `feature` MAY link to the `brd`
  it descends from via the `**Brd:**` label (§3.1); the link is one-way, feature → brd
  — a brd is not required to enumerate its features.
- A `brd` or `feature` MAY cite the `research` it rests on via the `**Research:**`
  label (§3.1), one-way and possibly several links — a research document is not
  required to enumerate what cites it, for the same reason a brd is not. A research
  document MUST NOT record a decision; a tool reading one has nothing to track.
- A `brd` or `feature` SHOULD pass an audit — a read by someone other than the writing
  session, or by a reviewer the repository's agent instruction file names (§5) —
  before its blueprint is written, and SHOULD say so in the `**Audit:**` label (§3.1). What an audit catches
  is the contradiction between this document and a decision recorded in another one;
  that is the mistake that surfaces three rounds later, under tests and schemas, if it
  is not caught here.

### 3.1 Document label block *(new in 0.2)*

Each lifecycle document SHOULD open with a label block: bold labels, one per line, directly
under the H1 title. Recognized labels:

| Label | In | Meaning |
|---|---|---|
| `**Status:**` | all three kinds | A declared status label (§2.3), optionally with a date |
| `**Target:**` | feature | The version or milestone the work currently aims at *(optional)* |
| `**Brd:**` | feature | Link to the brd this feature descends from *(optional, new in 0.3)* |
| `**Research:**` | brd, feature | Link(s) to the research this document rests on *(optional, new in 0.5)* |
| `**Audit:**` | brd, feature | Who read this document against the rest of the repository, when, and how far *(optional, new in 0.5)* |
| `**Feature:**` | blueprint, worklog | Link back to the feature document |
| `**Blueprint:**` / `**Worklog:**` | feature | Links completing three-way linking; `—` until the file exists |

The `**Target:**` value SHOULD hold the version or milestone alone. A tool organizes
work by the exact value string — the §3.3 index column carries the same short code —
so a qualification glued to the value turns a per-version view into one group per
document. Qualifications and history belong on a line of their own below the label,
or in the body; a document whose aim cannot be stated as a short value SHOULD omit
the label rather than carry an invented one. A sprint or iteration code is a milestone:
`1.2` and `S3` are both valid values *(clarified in 0.5)* — a repository that ships no
versions still has a delivery rhythm, and that rhythm is what Target groups by.

The `**Research:**` value is one or more links, on one line, separated by ` · `; a
link MAY leave the repository. The label is one-way (§3): it says what this document
rests on, and a tool reads it to show evidence — it is not a progress signal, and a
tool SHOULD NOT resolve the links as if they were chain links.

The `**Audit:**` value SHOULD name who read the document, the date, and the scope
read or the commit it was read at — `Reviewer 2026-10-14 — whole document, 3 fixes in
place` — or a value from the repository's own vocabulary meaning *not yet*. A
repository that uses the label SHOULD name that word in its `## Lifecycle` section
(the templates say `not yet`), so a tool offering Advance (§3.4) can tell without
asking. A document written by a reviewer the repository's agent instruction file names
MAY count its own writing as the audit, citing the commit. A tool reads the label to
tell audited from unaudited; it MUST NOT judge the value beyond that.

A document MAY carry additional labels. A tool MUST ignore labels it does not recognize,
and MUST NOT remove them.

### 3.2 Templates *(new in 0.2)*

Starter skeletons live in [`templates/`](templates/): the three document kinds —
[`FEATURE.md`](templates/FEATURE.md) · [`BLUEPRINT.md`](templates/BLUEPRINT.md) ·
[`WORKLOG.md`](templates/WORKLOG.md) — and the entry point itself —
[`FLOCK.md`](templates/FLOCK.md). `<angle-bracket>` spans are placeholders.

A tool that scaffolds lifecycle documents SHOULD start from these templates. The templates
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

A finished document with no row in the index is not a missing row: its row has been
released to the shipped ledger (§3.6), or the adoption never backfilled it (§3.4). A
tool MUST NOT append a row for a document whose Status is a finished label. A document
that reopens after shipping is rare enough to hand to a human, under the same rule as a
missing table.

### 3.4 Stage transitions *(new in 0.2)*

Four transitions are common enough to name, so tools can offer them:

- **Adopt** *(no `FLOCK.md` → `FLOCK.md`)*: create `FLOCK.md` at the repository root
  from the template, and the index file it references, seeded with the §3.3 table
  header — so Open has somewhere to write. In a repository that already has
  documentation, Adopt is declarative: the Docs Map points at documents where they
  already are (typical locations are defaults, not requirements), rows for kinds the
  repository does not have are deleted rather than filled, and the transition MUST NOT
  move, rename, or rewrite existing files.
  Backfilling is not required — neither index rows for finished work nor §4 dates in
  pre-existing documents; the conventions apply from adoption forward.
- **Open** *(nothing → `Design`)*: create the feature document from its template and add
  an index row.
- **Advance** *(`Design` → `Building`)*: create the blueprint and worklog from their
  templates, complete the three-way links, and update Status in both the feature
  document and the index. A tool offering Advance SHOULD decline, or ask, when the
  feature document carries an `**Audit:**` label whose value means *not yet* — and
  SHOULD ask when it cannot tell, since the word for *not yet* is the repository's
  *(new in 0.5)* — the audit is the one check the chain asks for before the *How* is written,
  and a tool that advances past it silently removes the only moment it could have
  been noticed. A document with no `**Audit:**` label declares nothing, and Advance
  proceeds as before.
- **Release** *(finished → shipped, new in 0.4)*: when a Target is delivered — a
  version tagged and its build published, or a sprint closed by its demo *(wording
  widened in 0.5)* — move every index row whose Status is a finished label and whose
  Target is that value, verbatim, from the index to the shipped ledger (§3.6), under the
  heading for that Target. The trigger is the delivery, not the Status alone: a
  finished row aimed at an undelivered Target is still that Target's open business.
  The transition MUST NOT alter a row it moves, and MUST NOT touch the documents the row
  links to; they stay where the Docs Map says they are. A repository that declares no
  ledger has no Release transition.

A tool performing any of these transitions SHOULD leave the results as uncommitted
changes for a human to review, and MUST NOT overwrite an existing file or commit on its
own.

### 3.5 Round task list *(new in 0.3)*

A blueprint MAY carry its rounds as a GFM task list under a heading named `Rounds` —
one task item per round, checked when the round closes, the same moment the worklog
entry for that round is appended:

```markdown
## Rounds

- [x] B1 — Contracts and service
- [ ] B2 — Renderer surface
```

The blueprint is the document that declares the rounds (§3), so it is the one place the
total exists before the work starts.

The heading is the anchor, and it is fixed the way the §3.3 header and the §3.1 label
names are: task lists are common in blueprints for other purposes — a Definition of
Done is often a checklist — and a count over the whole file would sum unrelated things.
Measured before this rule existed: in the standard's two source repositories, 111 of
154 blueprints carried task items, almost all of them DoD checklists.

- A tool reading task progress MUST count only the task items inside the `Rounds`
  section — from that heading (matched case-insensitively, at any level) to the next
  heading of the same or a higher level. Task items inside fenced code blocks do not
  count; task items under subheadings within the section do.
- A blueprint with no `Rounds` section declares no progress. That is not an error — it
  is an older or house-shaped blueprint (§6); the tool simply has no progress to show.
  A checklist under any other heading means whatever its own heading says, and is none
  of this section's business.
- The list belongs to the author: a tool MUST NOT add, remove, or reorder items on its
  own. Checking an item off is a write a tool MAY offer, under the same review rule as
  §3.4 — the result stays uncommitted for a human to review.
- The list MAY stand alone or head a set of per-round sections; the template (§3.2)
  shows the combined shape.

### 3.6 Shipped ledger *(new in 0.4)*

The index has an entry — Open — and needs an exit, or every adoption that lives long
enough ends up with an index that is mostly finished work under a heading that says
otherwise. The exit is a **shipped ledger**: one file, declared as a Docs Map row of kind
`shipped`, holding the rows the index has released (§3.4).

- The ledger SHOULD use the same columns as the index it receives rows from, so a row
  moves verbatim — the ledger is the index's past, not a second index.
- Rows SHOULD sit under one heading per released version, newest first, the heading
  carrying the version and its release date: `## 1.0 — 2026-08-21`.
- A ledger is history in the sense of §4: rows are moved into it, never deleted from it,
  and never rewritten there. A correction to a shipped row is a dated note beside it.
- The ledger is one file. Rejected (decided 2026-09-02): one ledger file per version —
  that is the per-version index the standard already declined, under another name; and
  a `## Shipped` section inside the index — it keeps the record but not the size, and
  the size is what an agent pays for every time it reads the index.
- Typical location `docs/SHIPPED.md`; as with every kind, the Docs Map declares the
  actual path. A declared ledger that does not exist yet is a plan, not a violation —
  the first Release creates it.

A tool MAY read the ledger to show shipped work per version; it MUST NOT treat a row's
absence from the index as a document's absence from the repository.

## 4. History conventions

These rules apply to every adoption and are the heart of the standard: they keep a repo's
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
- The agent instruction file is where roles (§2.5) are cast: which person, agent or
  model plays each role, and under what rules. `FLOCK.md` names the roles; the
  instruction file names who plays them, because that binding changes with every
  model release and the standard does not.
- In a repository that runs the lifecycle, an agent opening or advancing work SHOULD
  use the §3.4 transitions and the §3.2 templates rather than inventing structure.

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

| A tool can read | When the repository has |
|---|---|
| **A conforming adoption** | `FLOCK.md` at root · Docs Map section |
| **The lifecycle** | the §3 kind vocabulary, linking rules, and a `## Lifecycle` section |
| **Machine-writable work** *(opt-in)* | the §3.1 label block and a §3.3 index table; a §3.6 shipped ledger if the index is to have an exit |
| **Evidence and review** *(opt-in, new in 0.5)* | `**Research:**` and `**Audit:**` labels on brd and feature documents, and a `research` row in the Docs Map |
| **Who owns what** *(opt-in, new in 0.5)* | a `## Roles` section whose Owns column names Docs Map kinds |

Everything not marked MUST is guidance: adopt what earns its keep.

These are tiers of what a tool can read, not choices an adopter makes up front.
Versions 0.1–0.3 called the first two *profiles* — `core` and `flow` — and asked the
declaration line to name one. Dropped (decided 2026-09-10): a profile is a promise
about shape, and the standard is deliberately loose about shape — the Docs Map
declares what exists, and everything past it is SHOULD. Every adoption made with the
standard had declared `flow` and then declared, row by row, which parts of it were in
play; the profile said nothing the file did not already say, while costing a second
template, a second example, a branch in every adoption prompt, and a question in every
adoption dialog. Rejected: keeping `core` as an unadvertised floor — a name nobody is
told to use is a name nobody can be expected to understand when they meet it.
