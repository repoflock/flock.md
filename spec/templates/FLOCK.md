# FLOCK.md

> flock: 0.5

## Docs Map

| Type | Where | Answers |
|---|---|---|
| brd | `docs/brd/` | Why is this worth building, for whom, measured how? |
| feature | `docs/feature/` | What are we building, and what is the UX? |
| blueprint | `docs/blueprint/` | How exactly will it be built? |
| worklog | `docs/worklog/` | What actually happened while building? |
| index | [docs/ROADMAP.md](docs/ROADMAP.md) | What exists, in what state? |
| shipped | [docs/SHIPPED.md](docs/SHIPPED.md) | What shipped, in which version? Rows the index released (spec §3.6) |
| research | `docs/research/` | What was measured outside this repo, when, from which source? Dated snapshots; facts and conclusions, never decisions (spec §3) |

## Lifecycle

**Why → What → How → What happened**: `brd` → `feature` → `blueprint` → `worklog`,
indexed in [docs/ROADMAP.md](docs/ROADMAP.md). `brd` is optional — delete its row if
unused. `research` sits outside the chain: a brd or feature cites it with
`**Research:**`, one-way — delete its row if unused.

- A feature doc links to its blueprint and worklog; both link back (three-way linking).
- A feature doc is read against the rest of the repository before its blueprint is
  written, and says so in `**Audit:**` — `not yet` until it has been (spec §3.1).
  Delete this line if not in play.
- A blueprint describes the code as measured, in rounds (`B1`, `B2`, …) that stand alone.
- A worklog block is appended when a round closes.
- Naming: one topic per file, same base name across the three kinds.
- Rhythm: <sprints of N weeks, closed by a demo — `**Target:**` carries the sprint code
  (`S3`); delete this line if work is aimed at versions instead>.

## Index

[docs/ROADMAP.md](docs/ROADMAP.md) — one line per item, machine-writable
(spec §3.3): `| Item | Target | Status | Docs |`. Detail lives in the docs, never in
the index. Rows leave when their version is released — to
[docs/SHIPPED.md](docs/SHIPPED.md), same columns, one heading per version (spec §3.4
Release). Delete the `shipped` row above if finished work is to stay in the index.

## Status Labels

`Design` · `Building` · `Done <date>` · `Parked`

## Roles

Roles own kinds; who plays a role — person, agent, model — is cast in the agent
instruction file, where names may change (spec §2.5). This table divides work, not
authority. Delete the section if one person plays every role and no agent does.

| Role | Owns | Decides |
|---|---|---|
| owner | — | every dated decision; the go-ahead when `**Audit:**` still means *not yet* |
| architect | `brd` · `feature` · `blueprint` · the `**Audit:**` field | the scope of a round or sprint, its definition of done |
| builder | code · `worklog` (appended when a round closes) | nothing about scope — a deviation from the blueprint goes into the worklog, not into code |

## Conventions

- Decisions carry dates: `(decided <YYYY-MM-DD>)`.
- Reversals are patched in place and marked `**SUPERSEDED <date>**`; the old text stays
  as context.
- Seriously considered alternatives are recorded with the reason they were rejected.
