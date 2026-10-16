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
| shipped | [docs/SHIPPED.md](docs/SHIPPED.md) | What shipped, in which version? Rows the index released |
| research | `docs/research/` | What was measured outside this repo, when, from which source? Dated snapshots — facts and conclusions, never decisions |
| technical | `docs/technical/` | How does the system work today? |
| business | `docs/business/` | How does this make money, and for whom? |

## Lifecycle

**Why → What → How → What happened**: `brd` → `feature` → `blueprint` → `worklog`,
indexed in `docs/ROADMAP.md`. `research`, `technical` and `business` sit outside the
chain — the chain fixes the lifecycle, not the whole map. A brd or feature cites the
research it rests on with `**Research:**`; the link is one-way.

- A feature doc links to its blueprint and worklog; both link back (three-way linking).
- A feature doc is read against the rest of the repository before its blueprint is
  written, and says so in `**Audit:**`
  ([spec §3.1](https://github.com/repoflock/flock.md/blob/main/spec/SPEC.md#31-document-label-block-new-in-02)).
- A blueprint describes the code as measured, in rounds (`B1`, `B2`, …) that stand alone.
- A worklog block is appended when a round closes: what was done, deviations from the
  blueprint, decisions that emerged, what was left for later.
- Naming: one topic per file, same base name across the three kinds —
  `FEATURE_X.md` / `FEATURE_X_BLUEPRINT.md` / `FEATURE_X_WORKLOG.md`.

## Index

[docs/ROADMAP.md](docs/ROADMAP.md) — one line per feature, machine-writable
([spec §3.3](https://github.com/repoflock/flock.md/blob/main/spec/SPEC.md#33-machine-writable-index-new-in-02)):
`| Item | Target | Status | Docs |`. Detail lives in the docs, never in the index, and
finished rows do not stay: when a version is released they move verbatim to
[docs/SHIPPED.md](docs/SHIPPED.md) ([spec §3.6](https://github.com/repoflock/flock.md/blob/main/spec/SPEC.md#36-shipped-ledger-new-in-04)).

## Status Labels

`Design` · `Building` · `Done <date>` · `Parked`

## Roles

Roles own kinds; who plays a role — person, agent, model — is cast in the agent
instruction file, where names may change
([spec §2.5](https://github.com/repoflock/flock.md/blob/main/spec/SPEC.md#25-roles-optional-new-in-05)).
This table divides work, not authority.

| Role | Owns | Decides |
|---|---|---|
| owner | — | every dated decision; the go-ahead when `**Audit:**` still means *not yet* |
| architect | `brd` · `feature` · `blueprint` · the `**Audit:**` field · reading the `worklog` back | the scope of a round or sprint, its definition of done, the merge at its end |
| builder | code · `worklog` (appended when a round closes) | nothing about scope — a deviation from the blueprint goes into the worklog, not into code |

## Conventions

- Decisions carry dates: `(decided 2026-08-22)`.
- Reversals are patched in place and marked `**SUPERSEDED <date>**`; the old text stays
  as context.
- Seriously considered alternatives are recorded with the reason they were rejected.
