# FLOCK.md

> One file that tells humans **and** AI agents where a repo's knowledge lives — and how work flows through it.

**Status: v0.3 — draft.** The spec is small on purpose and still settling. v0.3 names
the question chain — **Why → What → How → What happened** — that the flow profile has
always encoded; v0.2 added document templates and an opt-in machine-writable index —
tool-friendly, never tool-required. Feedback is welcome via issues.

## The problem

AI agents now write a large share of the documents in a repository: plans, specs, design
notes, work logs. They write them fast, and they write them wherever they were pointed at
that day. Six months later nobody — human or agent — can answer the basic questions:

- Where is the spec for this feature, and is it current?
- Why was this decided, and what was rejected?
- What was actually done, as opposed to what was planned?

`AGENTS.md` solved the *"how do I work in this codebase"* question. Nothing standard
answers *"where does this repo's knowledge live, and what states does work move through?"*

## The idea

A single markdown file, `FLOCK.md`, at the repository root. It declares:

1. **Docs Map** — what kinds of documents exist and where they live.
2. **Status labels** — the states work moves through (e.g. `Design` → `Building` → `Done`).
3. **Index** — where the one-line-per-feature overview lives.
4. **Conventions** — the history rules: decisions carry dates, reversals are patched
   in place and marked `SUPERSEDED`, rejected alternatives are recorded.

Plain GitHub-flavored Markdown. No schema, no tooling, no lock-in. A repo adopts the
core profile in five minutes; readers and agents get a stable entry point forever.

## The question chain

In the full [flow profile](spec/SPEC.md#3-the-flow-profile), a unit of work is done
when four questions have written answers, in order:

> **Why?** → `brd` · **What?** → `feature` · **How?** → `blueprint` ·
> **What happened?** → `worklog`

The index answers the fifth — *where is everything, in what state?* — for every unit
of work at once. Four questions, four documents, three-way linked. Documents outside
the chain (technical notes, business docs) are welcome; they get their own Docs Map
rows — the chain fixes the lifecycle, not the whole map.

## Quick start

### Starting fresh

A repository with no documentation yet has nothing to inventory and nothing to fill in —
the template's defaults **are** the adoption:

1. Copy [`examples/minimal/FLOCK.md`](examples/minimal/FLOCK.md) to your repo root, as
   shipped. Its Docs Map declares the spec's typical locations, and in a fresh repo those
   are not a description but a plan: the first design note goes in `docs/`, the first
   decision in `docs/decisions/`, and the map was true before either existed.
2. Add one line to your agent instruction file (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`):

   ```text
   Docs and project conventions: see FLOCK.md.
   ```

Done — that is a valid core-profile adoption, and the pointer line is the half that does
the work: an agent has never heard of a standard this new, so it finds `FLOCK.md` through
a file it already reads — and from then on it writes documents where the map says, from
day one. Edit the map when reality diverges from the defaults, not before.

No agent prompt for this case — copying one file and adding one line is less work than
handing it off. The prompts below are for repositories that already have documents to
declare.

### Already have docs

Adoption is a declaration, not a migration. The spec's typical locations are defaults;
the Docs Map declares your real paths — so nothing moves:

1. Inventory the documentation the repo already has.
2. Write Docs Map rows pointing at the paths where those documents already live. Do not
   add rows for kinds of documents you do not have.
3. Add the pointer line to your agent instruction file — the same one-liner as in
   *Starting fresh*.

That is the whole adoption: one new file, one pointer line, zero moved files. The
history conventions apply from adoption day forward — do not backfill dates or
`SUPERSEDED` marks into old documents. If you graduate to the flow profile later, start
the index with new work rather than backfilling every finished feature: a backfilled
table is too large to verify, and an index that might be wrong is worse than a shorter
one that is right.

Handing adoption to an agent? This prompt carries the guardrails:

```text
Read https://github.com/repoflock/flock.md and adopt the standard in this repository:

1. Create FLOCK.md at the repo root, starting from examples/minimal/FLOCK.md.
2. Fill in the Docs Map from the documentation that already exists here — do not
   invent sections for documents we do not have.
3. Add this line to AGENTS.md — or to whichever instruction file this repo
   already keeps for agents (CLAUDE.md, .cursorrules): Docs and project conventions: see FLOCK.md.

Do not move, rename, or rewrite any existing file.
```

### Migrating an established docs system

Some repositories already run a full convention system — typically grown inside an
agent instruction file: a docs map, status labels, history rules, all in one place.
Migrating that to Flock is a **deduplication** problem, not a declaration problem:
`FLOCK.md` takes over the knowledge contract, the agent file keeps the build-and-test
rules, and still nothing moves.

This prompt runs the migration in phases with a review stop after each. It was
distilled from migrating the standard's own source repositories, and the rules it
carries — baseline numbers first, paths-only Where cells, verify with the consuming
tool rather than by eye — each earned their place by catching a real failure:

```text
Read https://github.com/repoflock/flock.md. This repository already has a working
docs system — its conventions live in an agent instruction file (AGENTS.md,
CLAUDE.md, .cursorrules …) and/or scattered READMEs. Migrate it to the Flock
standard. Work in phases and STOP for my review after each phase. Leave every
change uncommitted.

Phase 0 — Dry run (read-only, write nothing):
1. Inventory: every agent instruction file, every docs directory (count files
   per kind), and the file that actually serves as the index of ongoing work.
   The index may live inside another document (a roadmap section of a spec) —
   record where it really is, not where the spec's defaults would put it.
2. Detect leftovers of any earlier or aborted adoption: a FLOCK.md or index stub
   whose declarations do not match what actually exists. A FLOCK.md that
   describes a repo that doesn't exist is worse than none.
3. Measure the labels as used: which label lines documents actually open with
   (Status / Target / house variants), and the actual status vocabulary with a
   count per variant. Do not assume the spec defaults are in use.
4. Measure the duplication: list every place that answers "where do docs live"
   or "what states does work move through" — agent file sections, README doc
   maps, wiki pages. These are candidates to collapse into FLOCK.md.
5. Find the tool that consumes FLOCK.md — a check this repo itself declares,
   else `node tools/check.mjs <repo>` from the standard's own repository,
   else a reference implementation installed here — run it now and
   record the before-numbers: how many documents it finds, how many labels it
   parses. These are the baseline the migration must not regress.
Report all of the above with counts, then STOP.

Phase 1 — FLOCK.md, truth-first:
- Write FLOCK.md declaring the paths, index file, and status vocabulary that
  ACTUALLY exist. Do not scaffold new directories, do not create a new index,
  do not declare the spec's default vocabulary unless the repo really uses it.
- The Where column of the Docs Map holds a path or glob and NOTHING else —
  no file counts, no parenthetical notes, no prose. A tool reads that cell as
  a literal path; "docs/feature/ (20 files)" is a directory that does not
  exist, and the failure is silent. Annotations belong in the Answers column.
- An index that lives inside another document is fine: link the file in the
  Docs Map row and the ## Index section, and say which section holds the table.
- Delete only stub files a previous adoption created that duplicate a real file.
- Do not move, rename, or rewrite any existing document.
- CLOSE THE PHASE BY VERIFYING WITH A TOOL, NOT BY EYE: re-run the Phase 0
  consumer against the new FLOCK.md and compare with the baseline. Every kind
  it found before, it must still find; the index must resolve to the real
  file. A FLOCK.md can read perfectly to a human and still parse to zero.
  If no consumer exists, at minimum script a check that every Where path in
  the Docs Map exists on disk.

Phase 2 — Deduplicate:
- The agent instruction file keeps "how to build, test, and write code here";
  FLOCK.md takes "where knowledge lives, lifecycle, status labels, history
  conventions". Replace the agent file's docs-map content with one line:
  "Docs and project conventions: see FLOCK.md."
- Before moving any section, count inbound references to it (links AND
  by-name mentions). Prefer moving low-reference sections; leave heavily
  referenced ones in place and link to them from FLOCK.md instead.
- Dated decisions and SUPERSEDED blocks move verbatim — never delete or
  rewrite recorded history (spec §4).
- A doc-writing style guide too long for FLOCK.md goes to its own file,
  declared as a Docs Map row.
- Close the phase the same way: re-run the consumer, confirm the numbers
  did not regress.

Phase 3 — Data alignment (only with my explicit approval, per item):
- Propose ONLY cheap mechanical renames that make existing labels match the
  spec's recognized ones (e.g. a house "Release target:" label → "Target:").
  One label per batch, line-based edits (mind CRLF), assert the changed-file
  count against the Phase 0 measurement.
- Do NOT rewrite the status vocabulary in documents — it is declared in
  FLOCK.md instead. Do NOT convert a hand-maintained index to the
  machine-writable table (spec §3.3: opt-in). Do NOT rewrite existing
  blueprints' round sections into §3.5 task lists — adopting newer opt-ins
  is the upgrade prompt's job (next section), a separate pass for after the
  migration has settled.
- Close with the consumer run: report before/after numbers for every batch.

Decisions you must ask me about, never decide yourself:
- whether a secondary per-file doc map (e.g. in README) is kept, trimmed, or moved;
- whether the index becomes machine-writable;
- which spec version the declaration line names;
- any rename touching more than a handful of files.
```

### Upgrading to a newer spec version

Repositories are not expected to chase the spec (§6): an older adoption keeps
conforming, and tools keep reading it. Upgrade when a newer version carries something
you actually want. The prompt below is deliberately version-agnostic — it reads the
CHANGELOG gap instead of hard-coding any release — and it runs in one pass, because
everything lands uncommitted: **the diff is the review**, not stops along the way.

```text
Read the current spec — spec/SPEC.md and CHANGELOG.md, from
https://github.com/repoflock/flock.md unless I have pointed you at a
checkout that is ahead of it. If what you read turns out to predate the
change we are here to adopt, say so and stop rather than concluding there
is nothing to do.
This repository already conforms to the Flock standard at the version its
FLOCK.md declaration line names. Upgrade the adoption to the current spec
version, in one pass, leaving every change uncommitted — I review the diff,
not the steps.

1. Establish the gap: read the declaration line, then every CHANGELOG entry
   between that version and the current one. List what is relevant to this
   repository — an opt-in it has no use for is not part of this upgrade.
   If the declared version equals the current one AND that version is still
   marked draft/unreleased, read its entry anyway: a draft keeps growing
   after repositories adopt it, so the number alone cannot tell you whether
   this repo has what the version now contains. Check the repo against that
   entry item by item; equal version numbers are not evidence of equal shape.
2. Before touching anything, capture `git status --short`. Files already
   modified or staged are someone's work in flight — out of scope no matter
   where a later step points; skip them and name them in the closing report.
   "The diff is the review" only holds if the reviewer can tell your diff
   from theirs, so the report also lists exactly the files this pass touched.
   Then find the consuming tool, in this order: a check this repository
   itself declares (grep its scripts and CI for flock); the standard's own
   checker — `node tools/check.mjs <repo>` in the repository this spec came
   from; a reference implementation installed on this machine. Found none?
   The floor is still owed: script a check that every Where path in the
   Docs Map exists. Run what you found and record its numbers — how many
   documents it finds, how many labels it parses, what the index resolves
   to. Run it again at the end. Nothing it found before may go missing.
   Record whether what it finds is RIGHT, not only how much: a section that
   parses to garbage is a regression already present, and repairing it
   belongs to this pass — though a wrong parse that a dated decision already
   declares deliberate is recorded, not repaired. And if a machine-readable
   shape you adopt does not move those numbers, say so explicitly and name
   what blocks it — an adoption the consuming tool cannot see is a
   documentation change, not an upgrade. Declaration-tier sections (a
   Lifecycle, an opt-in record) are expected to move nothing; the report
   just says so.
3. Adopt what pays, and only that:
   - Sections or labels the spec now recommends: add them where a document
     gains them naturally. A declaration bump with no other edits is a
     valid outcome, not a failed upgrade.
   - House label names stay, exactly like the house vocabulary. Never add a
     spec-named label to a document that already carries this repo's
     equivalent, and never introduce a second variant of a label already in
     use. When a house label blocks a machine-readable feature, skip the
     feature — and put the blocker on the closing report as a priced line,
     one per label: which label, which feature it blocks, how many files a
     rename would touch AND where the label is really governed — a repo
     whose doc standard lives outside it (shared with siblings, declared in
     its Docs Map) prices a rename across everything that standard rules,
     not inside one repo — and whether a dated decision, in this repo or in
     that standard, already covers keeping it. Classify each line — a pure
     shape fix that changes no word, a real rename, or a label absent
     outright, whose fix is an added line rather than a change — but act on
     none of them: I decide per line, and an approved change then runs as
     its own pass, one label per batch with the changed-file count asserted,
     never inside this upgrade.
   - Opt-in machine-readable shapes (a §3.3 index header, §3.5 round task
     lists) are adopted for work still in flight only. Before adopting one,
     trace the path the consuming tool reads it through: if a house label
     severs that path (a house blueprint label means the tool never reaches
     the blueprint, so a round list there is invisible), the shape is not
     adoptable here — it goes on the priced list above, not into the
     documents. Read "in flight" from the status vocabulary this repo
     declares in FLOCK.md, not from the spec's default words. Do not
     backfill finished work: a shipped feature's blueprint keeps its prose
     rounds, and the index gains no rows for done work.
   - A §3.5 round list counts only under a heading named `Rounds` — put it
     there, not under a house heading a tool will never find. Checklists
     under other headings (a Definition of Done, say) are out of scope and
     stay untouched.
   - Changed typical locations are defaults, not requirements: move and
     rename nothing — the Docs Map already declares the real paths.
   - Record in FLOCK.md which opt-ins are now in play, with the date — and
     which are deliberately not, each with its blocker. It is the file whose
     job is to say what shape this repo is in, and "not in play, because X"
     is shape too.
4. Rewrite no history: dated decisions, SUPERSEDED blocks and finished
   documents stay byte-for-byte, and the status vocabulary stays the house
   one. Line-based edits only, keeping each file's own line endings.
5. Bump the declaration line to the new version last — unless the repo
   already names it, which the draft case in step 1 makes possible. Then
   close with the report: what was adopted, what was skipped and why, what
   you had to leave to me, and the before/after numbers from step 2.
   "Nothing needed changing" is a valid report; an invented change is not.
```

### Checking an adoption

The standard carries its own conformance checker, so the verification the prompts
above lean on is never a tool you have to go find:

```bash
node tools/check.mjs <path-to-repo>
```

It prints what a tool can read from the adoption — kinds declared, labels parsed,
where the index resolves, §3.5 round counts — and fails only on MUST violations;
everything else the spec leaves as guidance, and the checker holds itself to that
line. `--self-test` runs it against the shapes real adoptions have taught it.

### Growing later

When your project grows into a full design-to-delivery flow, graduate to the
[flow profile](spec/SPEC.md#3-the-flow-profile): see
[`examples/full/FLOCK.md`](examples/full/FLOCK.md).

## FLOCK.md and AGENTS.md

They are complementary, not competing:

| | AGENTS.md | FLOCK.md |
|---|---|---|
| Answers | *How do I build, test, and write code here?* | *Where does knowledge live, and how does work flow?* |
| Audience | Coding agents | Humans **and** agents |
| Scope | Code conventions | Docs & project management |

Recommended: add one line to your agent instruction file — `AGENTS.md`, `CLAUDE.md`, or
your tool's equivalent — `Docs and project conventions: see FLOCK.md.`

## Read the spec

The full specification lives in [`spec/SPEC.md`](spec/SPEC.md). It fits on one page.
This repository follows its own standard — see [`FLOCK.md`](FLOCK.md).

## Who is behind this

FLOCK.md was extracted from the working conventions behind
[RepoFlock](https://repoflock.com), a multi-repo companion app, where an earlier form of
this standard has been used in production across the project's own repositories. The
standard is open and tool-agnostic: it works with zero tooling, in any editor, with any
agent.

## License

The specification text is licensed under [CC BY 4.0](LICENSE).
