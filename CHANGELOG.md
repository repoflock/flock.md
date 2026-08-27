# Changelog

Spec versions follow [SemVer](https://semver.org). While in `0.x`, minor versions may
change the spec incompatibly.

## 0.3.0 — draft (unreleased)

Theme: name the chain. Nothing structural changes; 0.2 adoptions remain conforming.

- Flow profile: the kind chain is framed as the **question chain** — **Why → What →
  How → What happened** (`brd` → `feature` → `blueprint` → `worklog`), with the index
  answering the fifth question, *where is everything, in what state?* (§3).
- Typical locations normalized to singular, matching the kind vocabulary:
  `docs/blueprints/` → `docs/blueprint/` (decided 2026-08-26). Locations are defaults,
  not requirements — the Docs Map declares the actual path, so existing repos need not
  rename.
- Clarified that the flow profile fixes the lifecycle chain's vocabulary, not the
  whole Docs Map: kinds outside the chain (`technical`, `business`, …) may be declared
  as additional rows (§3).
- Feature label block: optional `**Brd:**` label linking a feature to the brd it
  descends from; the link is one-way, feature → brd, since one brd may cover several
  features (§3.1).
- Rejected (decided 2026-08-26): splitting the index into per-version files
  (`docs/roadmap/1.1.md`, …). Version filtering is what the machine-writable index's
  Target column is for, and a single declared index file is what lets a tool know
  where to write (§3.3); per-release *planning documents* are a kind of their own,
  declared as a Docs Map row, not a variant of the index.
- Adoption for repositories with existing documentation (decided 2026-08-27): §3.4
  Adopt is declarative — the Docs Map points at documents where they already are, the
  transition MUST NOT move, rename, or rewrite existing files, and backfilling (index
  rows for finished work, §4 dates in old documents) is not required; conventions
  apply from adoption forward. README Quick start splits into the two paths — starting
  fresh vs. already have docs — and carries an agent prompt for the second, since a
  standard published this year is one no model was trained on.
- §5: the cross-reference recommendation names the general case — any agent
  instruction file (`AGENTS.md`, `CLAUDE.md`, or a tool-specific equivalent), not only
  `AGENTS.md`. None of the standard's own source repositories use the name `AGENTS.md`.
- Rejected (decided 2026-08-27): a separate `ADOPTING.md` (deferred until the guide
  outgrows its README section — a standard whose spec fits on one page should not need
  a second manual to join); and full index backfill on adoption (a backfilled table is
  too large to verify, and an index that might be wrong is worse than a shorter one
  that is right).

## 0.2.0 — draft (unreleased)

Theme: tool-friendly, never tool-required. Everything below is SHOULD/MAY; 0.1
adoptions remain conforming.

- Flow profile: document label block — `Status` / optional `Target` (version or
  milestone aimed at) / three-way-link labels; tools must ignore unknown labels (§3.1).
- Starter templates for feature / blueprint / worklog in `spec/templates/` (§3.2).
- Machine-writable index, opt-in: a table headed `| Item | Target | Status | Docs |`
  (Target omissible); a tool appends rows there and must not guess when the table is
  absent (§3.3).
- Named stage transitions **Adopt** (no `FLOCK.md` → core/flow, seeding the flow index
  with the §3.3 header), **Open** (→ Design) and **Advance** (Design → Building) so
  tools can implement them; results stay uncommitted for human review, existing files
  are never overwritten (§3.4). `FLOCK.md` profile templates added alongside the
  document templates (§3.2).
- Agents: prefer transitions + templates over invented structure (§5).
- Version compatibility (§6): a tool must not refuse a repository over a version
  difference, should keep reading earlier `0.x` adoptions, and should say when it
  writes documents shaped by a version the repository does not declare.

## 0.1.0 — draft (unreleased)

- Initial draft: `FLOCK.md` entry-point file, core profile (Docs Map, Index, Status
  Labels), flow profile (brd → feature → blueprint → worklog + index, three-way
  linking), history conventions (dated decisions, supersede-in-place, record the road
  not taken), agent guidance.
