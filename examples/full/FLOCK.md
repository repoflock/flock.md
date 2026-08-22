# FLOCK.md

> flock: 0.1 · profile: flow

## Docs Map

| Type | Where | Answers |
|---|---|---|
| brd | `docs/brd/` | Why is this worth building, for whom, measured how? |
| feature | `docs/feature/` | What are we building, and what is the UX? |
| blueprint | `docs/blueprints/` | How exactly will it be built? |
| worklog | `docs/worklog/` | What actually happened while building? |
| index | [docs/ROADMAP.md](docs/ROADMAP.md) | What exists, in what state? |
| technical | `docs/technical/` | How does the system work today? |

## Lifecycle

`brd` → `feature` → `blueprint` → `worklog`, indexed in `docs/ROADMAP.md`.

- A feature doc links to its blueprint and worklog; both link back (three-way linking).
- A blueprint describes the code as measured, in rounds (`B1`, `B2`, …) that stand alone.
- A worklog block is appended when a round closes: what was done, deviations from the
  blueprint, decisions that emerged, what was left for later.
- Naming: one topic per file, same base name across the three kinds —
  `FEATURE_X.md` / `FEATURE_X_BLUEPRINT.md` / `FEATURE_X_WORKLOG.md`.

## Index

[docs/ROADMAP.md](docs/ROADMAP.md) — one line per feature: name · priority ·
status label with date · link to the feature doc. Detail lives in the docs, never in
the index.

## Status Labels

`Design` · `Building` · `Done <date>` · `Parked`

## Conventions

- Decisions carry dates: `(decided 2026-08-22)`.
- Reversals are patched in place and marked `**SUPERSEDED <date>**`; the old text stays
  as context.
- Seriously considered alternatives are recorded with the reason they were rejected.
