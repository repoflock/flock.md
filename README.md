# FLOCK.md

> One file that tells humans **and** AI agents where a repo's knowledge lives — and how work flows through it.

**Status: v0.2 — draft.** The spec is small on purpose and still settling. v0.2 adds
document templates and an opt-in machine-writable index — tool-friendly, never
tool-required. Feedback is welcome via issues.

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
2. **Lifecycle** — the states work moves through (e.g. design → building → done).
3. **Index** — where the one-line-per-feature overview lives.
4. **Conventions** — the history rules: decisions carry dates, reversals are patched
   in place and marked `SUPERSEDED`, rejected alternatives are recorded.

Plain GitHub-flavored Markdown. No schema, no tooling, no lock-in. A repo adopts the
core profile in five minutes; readers and agents get a stable entry point forever.

## Quick start

Copy [`examples/minimal/FLOCK.md`](examples/minimal/FLOCK.md) to your repo root and fill
in the Docs Map table. Done — that is a valid core-profile adoption.

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

Recommended: add one line to your `AGENTS.md` — `Docs and project conventions: see FLOCK.md.`

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
