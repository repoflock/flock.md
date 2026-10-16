# Changelog

Spec versions follow [SemVer](https://semver.org). While in `0.x`, minor versions may
change the spec incompatibly.

## 0.5.0 — draft (unreleased)

Theme: evidence and review. The chain learns what it rests on and who read it, and a
Target learns to be a sprint. Everything is SHOULD/MAY and additive; a 0.4 adoption
changes nothing, and a 0.4 tool meeting the new labels ignores them (§3.1, §6).

- **`research` is a named kind outside the chain** (decided 2026-10-14). A dated
  snapshot of what was measured outside the repository and from which sources —
  facts and conclusions, never decisions. It gets a fixed name for the mirror of the
  reason `shipped` has one: `shipped` because a tool writes to it, `research` because
  other documents link to it. Measured on the source adoptions: 18 research notes
  living one level above every repository, cited by 30 documents by path in the body
  and by 3 through a house label no tool could read — the same shape the 0.3 label
  alignment had already met once with `Blueprint:`. The Docs Map MAY point outside
  the repository for this kind.
- **`**Research:**` label** (§3.1) on brd and feature: one or more links on one line,
  one-way, the same way `**Brd:**` is one-way — a research document is not required
  to enumerate what cites it.
- **Rejected: research as a fifth question of the chain** ("What is true?" before
  "Why?"). A chain stage is one-to-one with a unit of work, three-way linked, and
  moves through Status; research is many-to-many, is a snapshot that never changes
  state, and mostly lives outside the repository it serves. Forcing it into the chain
  would hand it labels it does not have and links it does not need. It is what *Why*
  cites, not a question before it.
- **`**Audit:**` label** (§3.1) on brd and feature: who read the document against
  the rest of the repository, when, and how far — or the repository's own word for
  *not yet*. A tool offering Advance SHOULD decline or ask while the value means not
  yet (§3.4). The first label about *who*; what it catches is the contradiction
  between this document and a decision recorded in another, which is the mistake
  that otherwise surfaces three rounds later under tests and schemas. Rejected with
  it: `**Author:**` or `**Model:**` labels — the commit trailer already records who
  wrote a document, and a second copy drifts.
- **Target may be a sprint** (§3.1 clarified, §3.4 Release reworded): `S3` is a
  milestone the way `1.2` is a version, and Release fires when a Target is
  *delivered* — a version tagged, or a sprint closed by its demo — rather than only
  when a version is released. Measured: two internal-tool adoptions had declared "no
  Target, this repository ships no versions" while running one-week sprints closed by
  demo; the sprint was the Target they lacked, and without one the index had no exit.
- **Rejected: a `sprint` kind, a `## Sprints` section in the index, or a sprint
  Status.** A file per sprint is the per-version index 0.3 declined and 0.4 declined
  again under the ledger; a section inside the index keeps the record but not the
  size; a Status is a document's state, not a calendar. The sprint's rhythm — length,
  closing condition, who merges — is a sentence in `## Lifecycle`, a declaration.
- **`## Roles` section** (§2.5; decided 2026-10-16, after being held back on
  2026-10-14 until a second pilot existed). A table of `Role | Owns | Decides`
  answering a sixth question — *who owns what?* — for the whole repository, the way
  the index answers the fifth for every unit of work. Owns names Docs Map kinds so a
  tool can join the two tables; the table divides work, not authority, and a tool
  MUST NOT infer permissions from it. The binding of roles to people, agents or
  models stays in the agent instruction file (§5): it changes monthly, and the
  standard names no vendor. Measured on the two pilots: a software adoption declared
  four roles over chain kinds; a video-production adoption declared roles over kinds
  *outside* the chain (`episode`, `calendar`) — and went in with four roles and came
  out with three, the publish role folding into the writer (the copy) and the
  producer (the press). The second pilot is why the section is in the spec: it showed
  the shape is not a software table in disguise, and that the pilot teaches the spec
  its vocabulary, not the other way round.
- **Team presets are illustrative tables inside §2.5, not files.** The owner asked for
  predefined teams (a software team, a video team). What differs between two teams is
  the *content* of the Roles table, not the *shape* of any section, so the presets are
  two non-normative tables in the spec that an adopter copies and edits. Rejected: an
  `examples/teams/<team>/FLOCK.md` tree with a "pick the example closest to your team"
  fork in Quick start and a team picker in the adoption dialog — that is, item for
  item, the cost list the 0.4 profile drop paid (a second example, a branch in the
  fresh-repo prompt, a question in the dialog, a name to explain), and each team
  example would carry a different Docs Map, which Quick start tells adopters not to
  rewrite to a guess. Rejected: a `preset:` field on the declaration line — a profile
  by another name. Rejected: a third team table without a third adoption — a team
  with no pilot has no table.
- **Rejected: Who as a fifth stage of the chain, or an Owner column in the Docs Map.**
  A chain stage is a document per unit of work; a *who* document per feature would be
  empty or identical across features. An Owner column would widen the only MUST in
  the standard (§2.1, three columns) to carry something SHOULD, and leave a
  one-person repository filling or blanking a cell on every row.
- **Checker reads §2.5 and measures Target bareness** (`tools/check.mjs`). It prints
  the number of roles and joins the Owns column to the Docs Map through backtick
  spans shaped like a Type name, naming the ones with no Docs Map row as a note —
  never a failure, since Owns legitimately holds code and gates, and the table
  carries no MUST a tool could check. Next to the Target count it now prints the
  number of distinct values and of values that are not bare (whitespace or a
  bracket), which is what the §3.1 SHOULD is about. Measured why: a pass on the
  video pilot took its Target values from 0/15 bare to 15/15 and from 8 strings to
  5, and the checker printed `Target: 15` before and after.

## 0.4.0 — 2026-10-15

Theme: close the chain, and one shape. The index gains an exit; the core/flow profiles
go. Everything is SHOULD/MAY; 0.3 adoptions remain conforming — a `profile:` field on
the declaration line is ignored, not an error — and one that declares no ledger changes
nothing.

- **Profiles dropped** (decided 2026-09-10). 0.1–0.3 offered two: `core` (Docs Map,
  Index, Status Labels) and `flow` (core plus the chain, three-way linking, `## Lifecycle`
  and `## Conventions`), named on the declaration line. Now there is one shape: the Docs
  Map is the only MUST (§2.1), `## Conventions` is recommended for every adoption
  (§2.4, new — §4 always bound every adoption; the section is where a repo says so), and
  a repository declares in `## Lifecycle` whether it runs the chain (§3). The declaration
  line names the version alone (§1). The reasoning: a profile is a promise about shape,
  and the standard is deliberately loose about shape — the Docs Map already declares
  what exists, and everything past it is guidance. Measured on the day: every adoption
  made with the standard had declared `flow` and then said, row by row and in prose,
  which parts were in play; the field never told a tool anything the file did not, and
  no tool branched on it (neither the checker nor the reference implementation). What
  it cost: a second template, a second example, a branch in the fresh-repo prompt, a
  "which profile" question in the adoption dialog of the reference implementation —
  and a second name to explain to every newcomer.
- Rejected with it: keeping `core` as an unadvertised conformance floor (a name nobody
  is told to use is a name nobody understands on meeting it — and the floor exists
  without the name: it is §2.1); and a third or per-kind profile for repositories that
  run a different lifecycle (the `## Lifecycle` section declares one in prose, which is
  where a loose standard keeps things it does not fix).
- Consequences in the repository: `spec/templates/FLOCK_FLOW.md` → `FLOCK.md`,
  `FLOCK_CORE.md` deleted; `examples/minimal/` deleted, `examples/full/` flattened to
  `examples/` (one example needs no qualifier). README Quick start: Starting fresh is
  one path (copy the example, seed the index, add the pointer line) — the "fresh and
  serious" fork that pointed at the full example was the only fork, and it always won;
  "Already have docs" builds the three sections rather than copying a template that
  carried a lifecycle the repository may not run; the Growing later section is gone
  with the thing it grew into. §3.4 Adopt says what "declarative" means for a template
  row the repository has no documents for: delete it, do not fill it. The checker drops
  the profile field on read and asserts so on a 0.3-shaped fixture.
- Versioning: into the open 0.4 draft rather than a 0.5, because 0.4 is unpublished and
  its one adoption is the reference implementation's own repository, upgraded in the
  same pass. The standard's own `FLOCK.md` — the single `core` adoption that existed —
  now says in prose that it runs no lifecycle.

- The lifecycle had an entry and no exit (decided 2026-09-02): §3.4 Open and Advance
  put rows into the index, and nothing took one out, while §2.2 defined the index as
  "ongoing and planned work". Measured on the standard's largest source adoption the
  day the rule was written: 173 index rows, 137 finished, 98 of those shipped in a
  tagged release, the file at 112 KB — one month after a character-ceiling lint had
  compressed it from 82 KB to 36 KB. Short cells did not help, because the number of
  dead rows never went down; and the section holding 100 of the finished rows was
  headed "designed, not yet built". The gap is the spec's, not the adopter's
  discipline: any adoption that lives long enough arrives there.
- §3.6 **Shipped ledger**: a Docs Map kind `shipped`, one file, same columns as the
  index, one heading per released version carrying the version and its date. Rows are
  moved in, never deleted, never rewritten (§4 applies). Typical location
  `docs/SHIPPED.md`; a declared ledger that does not exist yet is a plan.
- §3.4 fourth transition **Release** *(finished → shipped)*: when a version is
  released, every index row that is finished and aimed at that version moves verbatim to
  the ledger. The trigger is the release — tag or published build — not the finished
  Status: a finished row for an unreleased version is still that release's open
  business, and its release gate reads it. The move touches no linked document.
- §2.2 now says what §3.4 makes true: the index is for work that has not shipped.
  Without a declared ledger, finished rows stay — the 0.1–0.3 shape, conforming.
- §3.3: a finished document with no index row is a released row or an unbackfilled
  one, not a missing one — a tool MUST NOT append a row for a finished document.
- Rejected (decided 2026-09-02): one ledger file per version — the per-version index
  the 0.3 entry already declined, renamed; a `## Shipped` section inside the index —
  the PEP 0 shape keeps the record but not the size, and size is what an agent pays for
  every read (the source adoption had tried "one file, compressed" and tripled in
  thirty days); and leaving it to tools to filter — the reference implementation
  already filters its overview by version, and the file was still 112 KB for every
  human and agent reading it raw. What the long-lived precedents share — Keep a
  Changelog's Unreleased section, project boards' archive-on-close, sprint boards
  clearing Done — is a trigger tied to the delivery rhythm, a row that is not lost,
  and a place of its own.
- Design note: Release moves index rows only. The reference implementation reads
  status from feature documents, not from the index, so the ledger changes nothing a
  tool computes; and the documents stay where the Docs Map says, so the eighty inbound
  links measured on the source adoption keep resolving (one of them targeted a
  section anchor; none targeted a row).
- Versioning (decided 2026-09-02): this went into a new minor rather than the open 0.3
  draft. Three repositories already declared 0.3; growing the draft under them once
  more would be the third "same number, different shape" gap the upgrade prompt has
  to special-case, and the change reads a core-profile section differently. 0.3 was
  frozen and tagged the same day. Cost of the bump: nothing — no adopter outside the
  standard's own repositories, nothing promoted.
- `examples/full` gains `docs/SHIPPED.md` holding the row the index example used to
  show as `Done 1.0`; the `FLOCK_FLOW.md` template gains the `shipped` row with a note
  to delete it if finished work is to stay.

## 0.3.0 — 2026-09-02

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
- §3.5 counting is anchored to a heading named `Rounds` (decided 2026-08-28, same
  day — the first dogfood run caught the file-wide count lying): measured across the
  standard's two source repositories, 111 of 154 blueprints carried task items and
  almost all were Definition-of-Done checklists, so a whole-file count sums unrelated
  things on most real repositories. The anchor follows the machine tier's existing
  shape — the exact §3.3 header, the fixed §3.1 label names: data is declared, but
  the anchors a tool finds data by are the spec's own tokens. Rejected: declaring the
  section name in FLOCK.md (the motivating repo uses two different house names in the
  same repository, so even a per-repo declaration cannot cover it), and counting the
  first list in the file (the number silently changes meaning when an unrelated
  checklist lands earlier in the document).
- README: Quick start gains a fourth path — upgrading an existing adoption to a
  newer spec version (decided 2026-08-28). The agent prompt is deliberately
  version-agnostic: it reads the CHANGELOG gap rather than hard-coding a release,
  adopts opt-ins (§3.3 header, §3.5 round lists) for work in flight only, never
  backfills or renames, bumps the declaration line last, and runs in one pass —
  everything lands uncommitted, so the diff is the review. The migration prompt's
  Phase 3 gains the matching guard (do not rewrite round sections into §3.5 task
  lists during a migration) and points there instead of growing its own upgrade
  rules. The prompt also handles the case a `0.x` draft creates: a repository
  that adopted a draft version before the draft grew declares the same number as
  the spec while lacking what that number now covers, so equal versions are
  checked item by item rather than treated as nothing to do.
  Hardened by its first real run (2026-08-28, on a repository that had migrated
  the day before), which found six gaps: house *label names* need the same
  protection the house vocabulary already had, or the prompt reads as permission
  to rename across documents; "in flight" has to be read from the vocabulary the
  repo declares, since the spec's default words return nothing there; §3.5
  counting is file-wide, so a blueprint whose Definition of Done is a checklist
  reports a number mixing two unrelated things; the consumer run has to record
  whether output is *right*, not only how much of it there is, and has to say
  when an adopted shape moves no numbers at all — an adoption the tool cannot see
  is a documentation change, not an upgrade; the opt-ins in play belong recorded
  in FLOCK.md; and the source line must not send an agent to a published spec
  that predates the change it was sent to adopt.
  Refined once more when the run's numbers were read back (decided 2026-08-28):
  "skip and report the blocker" was too passive to decide on. A house label that
  blocks a machine-readable feature is now reported as a priced line — which
  label, which feature, how many files a rename touches, which dated decision
  already covers keeping it — classified shape-fix versus real rename, acted on
  by neither: approved renames run as their own pass under the migration
  prompt's Phase 3 discipline. Forcing normalization was rejected on three
  grounds: a tool re-litigating a repo's dated decisions is what §4–§5 exist to
  prevent; one-pass diff review is only safe while every edit is additive — a
  bulk rename hides its risk in the noise; and the machine tier is opt-in by
  design, so a prompt must not be more aggressive than the spec it serves. The
  two prompts thereby become one mechanism: the upgrade produces the list that
  Phase 3 executes.
  A second dogfood run (2026-08-28, on a repository whose adoption predates the
  §3.5 additions by one day — the exact draft-gap case) confirmed the first
  round's patches hold, and found the next layer: the working tree is not
  assumed clean anymore (files someone else already modified are out of scope,
  and the closing report names both them and the files the pass touched — "the
  diff is the review" only works if the two diffs can be told apart); adopting
  an opt-in shape now requires tracing the consuming tool's read path first,
  since a house label can sever it and make the shape invisible — that
  conflict between "adopt for in-flight work" and "skip what a label blocks"
  previously had no tie-breaker; a priced line prices a rename where the label
  is really governed, which for a repo sharing a doc standard with siblings is
  across everything that standard rules; the classification gains a third kind
  (label absent outright — an added line, not a change); declaration-tier
  sections are expected to move no consumer numbers, so the report says so
  instead of flagging them; and the opt-in record in FLOCK.md now names what
  is deliberately NOT in play, with its blocker.
- `tools/check.mjs` — the standard's own conformance checker (decided
  2026-08-28), answering the question both agent prompts left open: an adopter
  had no way to *find* the consuming tool their verification step leans on. It
  travels with the spec — the one repository every prompt already sends the
  agent to — so discovery costs nothing; the prompts now search in order
  (repo-declared check → this checker → an installed reference implementation →
  the path-existence floor). It reads the full machine tier (§1 declaration,
  §2.1 Docs Map with Where resolution, §2.2 index, §2.3 vocabulary, §3.1
  labels, §3.3 header, §3.5 round counts), fails only on MUST violations, and
  ships a self-test built from the shapes two real adoptions exhibited — which
  caught, on its first run, this second parser drifting from the reference
  implementation (a naming-convention fallback applied without the label that
  §3.1 makes the door). Verified to agree with the reference implementation on
  both dogfooded repositories. Rejected: declaring consumers in FLOCK.md (they
  live outside the repo and the list rots — FLOCK.md declares where knowledge
  lives, not what software exists); a `Verify:` field (the first machine field
  about software rather than knowledge, and the checker makes it unnecessary —
  may be revisited if repos grow rich house checks); and the path-existence
  floor as the only answer (measured across two dogfood runs: every real
  defect surfaced through a consumer run, none through path existence).
- README: *Starting fresh* gains an agent prompt too (decided 2026-08-28), superseding
  that section's own "no agent prompt for this case — copying one file and adding one
  line is less work than handing it off". The reasoning held for the work and missed the
  reader: someone already working through an agent does not do the two steps by hand
  either way, so the choice was never between a prompt and one file — it was between a
  guardrailed prompt and an improvised one. The guardrails are the payload, not the two
  steps: refuse a repository that is not fresh (the "already have docs" and migration
  paths exist for it) or that already has a `FLOCK.md` (§3.4 forbids overwriting one);
  copy the template as shipped rather than rewriting the Docs Map to a guess about the
  project; create no placeholder documents or empty directories for declared paths,
  since a clean path that does not exist yet is a plan; and do not "fix" a fresh
  adoption's zero document count by writing documents. Every prompt in this README now
  carries the failure it exists to prevent, and this one's is the paste-in-the-wrong-repo
  case that the four-path Quick start makes easy to hit. Dogfooded before publishing by
  running the checker against both templates copied into empty directories, which is
  what put the last clause in: a fresh core adoption reports its index as `not found`,
  because the minimal template's Index section names a file day one has no reason to
  contain — the same plan-not-violation case the Docs Map paths get a friendly note for.
  The prompt names that line so an agent reads it as expected output instead of a defect
  to repair; the asymmetry in how the checker phrases the two is left as it is for now.
- README: the approved rename gets its own prompt — "Running an approved label rename"
  (decided 2026-08-28). The priced-list mechanism previously ended at "approved
  renames run under the migration prompt's Phase 3 discipline", which left the
  executing pass without a prompt to hand an agent — and re-running a whole migration
  for one label is the wrong tool. The pass is now its own section, superseding that
  pointer: one approved line per run, re-measured before editing, keys renamed with
  values kept byte-for-byte, closed by the consuming tool's before/after numbers.
  Its two hard rules were priced on a real adoption (twenty feature documents,
  measured 2026-08-28): a `Target:` rename is the one that is NOT mechanical — tools
  group by the exact value string, and every Target value in that adoption was a
  clause, so the mechanical rename would have produced twenty groups of one; values
  normalize to short codes, a document whose version cannot be read from it loses the
  label rather than gaining an invented one, and the key rename is all documents or
  none, because one declared `Target:` flips how a tool organizes every other
  document. An anchor-heading batch (house heading → `Rounds`) carries its own trap:
  the section runs to the next same-or-higher heading, so a Definition of Done that
  sat safely under its own heading must not fall inside `Rounds`. Phase 3's
  "mechanical rename" example was corrected accordingly — `Release target:` →
  `Target:` was the one example that is not mechanical.
- README: Quick start gains a third path — migrating an established docs system, for
  repositories whose conventions already live in an agent instruction file. Carries a
  phased agent prompt (read-only dry run with baseline numbers → truth-first
  `FLOCK.md` → deduplication → opt-in label alignment), distilled from piloting the
  migration on two of the standard's source repositories (2026-08-27). Its core rules:
  never verify by eye when a consuming tool exists, count inbound references before
  moving a section, declare the house status vocabulary rather than rewriting
  documents to the default one.
- §3.1: the `**Target:**` value SHOULD hold the version or milestone alone (decided
  2026-08-31) — qualifications move to a line of their own or into the body, and a
  document whose aim cannot be stated as a short value omits the label rather than
  carrying an invented one. The same lesson §2.1's Where cell already recorded, met
  one label over: measured on the standard's largest source adoption, 105 of 131
  feature documents carried a clause after the version — replan history, tier
  breakdowns, prose — so a tool grouping by Target would have drawn dozens of groups
  of one. The README's approved-rename prompt had already priced exactly this failure
  and normalizes values as it renames; the spec now states the rule that prompt was
  enforcing, so a repository writing its first `Target:` line does not need a rename
  pass to learn it. The `FEATURE.md` template's placeholder says "the short code
  alone" accordingly.

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
