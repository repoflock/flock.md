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

Copy [`examples/minimal/FLOCK.md`](examples/minimal/FLOCK.md) to your repo root and fill
in the Docs Map table. Done — that is a valid core-profile adoption.

### Already have docs

Adoption is a declaration, not a migration. The spec's typical locations are defaults;
the Docs Map declares your real paths — so nothing moves:

1. Inventory the documentation the repo already has.
2. Write Docs Map rows pointing at the paths where those documents already live. Do not
   add rows for kinds of documents you do not have.
3. Add the pointer line to your agent instruction file (next section).

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
