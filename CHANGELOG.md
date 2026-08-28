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
- Terminology (decided 2026-08-27): "lifecycle" names the question chain; the states a
  piece of work moves through are Status Labels. The README previously used
  "Lifecycle" for the states — renamed. The two sections every flow `FLOCK.md` carries
  are now named in the spec — `## Lifecycle` (the chain) and `## Conventions` (the §4
  rules) — and listed in the §7 summary; previously only the templates showed them (§3).
- `examples/full/docs/ROADMAP.md`: a worked machine-writable index — the file every
  profile's Index section points at, which no example actually contained. Its rows
  mirror the §3.4 transitions: a `Design` item has only its feature document, a
  `Building` item has all three.
- §3.4 wording: "either transition" → "any of these transitions" (three have been
  listed since 0.2).
- §2.1: the **Where** cell SHOULD hold the path or glob alone — annotations belong in
  **Answers**. Found by migrating a source repository (decided 2026-08-27): a
  `(20 file)` count glued to the path made the consuming tool read a directory that
  does not exist, and 20 feature documents silently parsed as zero.
- Round task list, opt-in (decided 2026-08-28): a blueprint MAY carry its rounds as
  GFM task items, checked as each round closes; a tool MAY read checked / total as the
  unit's task progress, and MUST NOT edit the list beyond offering the check-off
  (§3.5). The blueprint is where the total exists before work starts. Rejected: the
  checklist in the worklog (append-only, it never knows the denominator; seeding it
  from the blueprint makes two copies of one truth), and counting section headings
  (a heuristic that imposes a layout §3.2 only suggests). The `BLUEPRINT.md` template
  now shows the list heading its per-round sections.
- README: Quick start gains a fourth path — upgrading an existing adoption to a
  newer spec version (decided 2026-08-28). The agent prompt is deliberately
  version-agnostic: it reads the CHANGELOG gap rather than hard-coding a release,
  adopts opt-ins (§3.3 header, §3.5 round lists) for work in flight only, never
  backfills or renames, bumps the declaration line last, and runs in one pass —
  everything lands uncommitted, so the diff is the review. The migration prompt's
  Phase 3 gains the matching guard (do not rewrite round sections into §3.5 task
  lists during a migration) and points there instead of growing its own upgrade
  rules.
- README: Quick start gains a third path — migrating an established docs system, for
  repositories whose conventions already live in an agent instruction file. Carries a
  phased agent prompt (read-only dry run with baseline numbers → truth-first
  `FLOCK.md` → deduplication → opt-in label alignment), distilled from piloting the
  migration on two of the standard's source repositories (2026-08-27). Its core rules:
  never verify by eye when a consuming tool exists, count inbound references before
  moving a section, declare the house status vocabulary rather than rewriting
  documents to the default one.

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
