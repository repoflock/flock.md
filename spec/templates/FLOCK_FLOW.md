# FLOCK.md

> flock: 0.3 · profile: flow

## Docs Map

| Type | Where | Answers |
|---|---|---|
| brd | `docs/brd/` | Why is this worth building, for whom, measured how? |
| feature | `docs/feature/` | What are we building, and what is the UX? |
| blueprint | `docs/blueprint/` | How exactly will it be built? |
| worklog | `docs/worklog/` | What actually happened while building? |
| index | [docs/ROADMAP.md](docs/ROADMAP.md) | What exists, in what state? |

## Lifecycle

**Why → What → How → What happened**: `brd` → `feature` → `blueprint` → `worklog`,
indexed in [docs/ROADMAP.md](docs/ROADMAP.md). `brd` is optional — delete its row if
unused.

- A feature doc links to its blueprint and worklog; both link back (three-way linking).
- A blueprint describes the code as measured, in rounds (`B1`, `B2`, …) that stand alone.
- A worklog block is appended when a round closes.
- Naming: one topic per file, same base name across the three kinds.

## Index

[docs/ROADMAP.md](docs/ROADMAP.md) — one line per item, machine-writable
(spec §3.3): `| Item | Target | Status | Docs |`. Detail lives in the docs, never in
the index.

## Status Labels

`Design` · `Building` · `Done <date>` · `Parked`

## Conventions

- Decisions carry dates: `(decided <YYYY-MM-DD>)`.
- Reversals are patched in place and marked `**SUPERSEDED <date>**`; the old text stays
  as context.
- Seriously considered alternatives are recorded with the reason they were rejected.
