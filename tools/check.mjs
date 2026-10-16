#!/usr/bin/env node
// Conformance checker for the Flock standard — the consuming tool an adopter
// can always find, because it lives in the same repository as the spec they
// were told to read.
//
//   node tools/check.mjs <path-to-repo>
//   node tools/check.mjs --self-test
//
// It reads what a tool can read (§1 declaration, §2.1 Docs Map, §2.2 Index,
// §2.3 Status Labels, §2.5 Roles, §3.1 label blocks and Target bareness,
// §3.3 index header, §3.5 round lists) and prints the numbers. Only MUST violations fail the exit code — everything
// not marked MUST is guidance, and this checker holds itself to that line.
//
// Zero dependencies, Node 18+. Kept deliberately close to the spec text: each
// rule cites the section it implements, so a disagreement between this file
// and SPEC.md is a bug in one of them, worth reporting either way.

import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── §1 declaration line ────────────────────────────────────────────────────
// `> flock: 0.4` — SHOULD, not MUST; an undeclared FLOCK.md still conforms,
// presence is the signal. 0.1–0.3 adoptions carry a trailing `· profile: …`
// field; §1 says a tool ignores it, so it is matched and dropped, not reported.
const DECLARATION = /^>\s*flock:\s*([^\s·|,]{1,16})(?:\s*[·|,]\s*profile:\s*[A-Za-z0-9._-]{1,32})?/i;

// §3: typical locations are defaults, not requirements — the Docs Map wins.
const DEFAULT_PLAN = { feature: 'docs/feature', blueprint: 'docs/blueprint', worklog: 'docs/worklog', index: 'docs/ROADMAP.md' };
// §3.3: the machine-writable header, in both allowed shapes.
const INDEX_HEADERS = ['| Item | Target | Status | Docs |', '| Item | Status | Docs |'];

const read = path => { try { return readFileSync(path, 'utf8'); } catch { return undefined; } };
const isFile = path => { try { return statSync(path).isFile(); } catch { return false; } };
const isDir = path => { try { return statSync(path).isDirectory(); } catch { return false; } };

/** Body of a `## <heading>` section, to the next `##`. */
function sectionBody(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = new RegExp(`^##\\s+${escaped}\\s*$`, 'm').exec(text);
  if (!start) return undefined;
  const after = text.slice(start.index + start[0].length);
  const stop = /^##\s/m.exec(after);
  return stop ? after.slice(0, stop.index) : after;
}

/** GFM table rows in `lines`, as trimmed cell arrays, separator row dropped. */
function rowsIn(lines) {
  const rows = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) break;
    if (!trimmed.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/.test(trimmed)) continue;
    rows.push(trimmed.slice(1, -1).split('|').map(cell => cell.trim()));
  }
  return rows;
}

/** Repo-relative, `/`-separated, provably inside the repo — or nothing. A path
 *  that escapes is not an error by itself; it is a fact reported as such. */
function safeRel(raw) {
  const value = raw.trim().replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '');
  if (!value || value.startsWith('/') || value.startsWith('..') || value.includes('../')) return undefined;
  if (/^[A-Za-z]:/.test(value) || value.startsWith('//')) return undefined;
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return undefined;
  return value;
}

/** `[text](path)` → path · `` `path` `` → path · bare text → text. */
function cellPath(cell) {
  const link = /\[[^\]]*\]\(([^)]+)\)/.exec(cell);
  const raw = link ? link[1] : cell.replace(/`/g, '');
  return raw.split('#')[0].trim();
}

/** §2.1 Docs Map rows + §2.2 Index authority, resolved into a plan. */
function readPlan(text) {
  const plan = { ...DEFAULT_PLAN };
  const kinds = [];
  const body = sectionBody(text, 'Docs Map');
  for (const cells of body ? rowsIn(body.split(/\r?\n/)) : []) {
    if (cells.length < 2) continue;
    const kind = cells[0].toLowerCase().replace(/`/g, '').trim();
    if (kind === 'type') continue;
    kinds.push({ kind, where: cellPath(cells[1]) });
    const where = safeRel(cellPath(cells[1]));
    if (!where) continue;
    if (kind === 'feature') plan.feature = where;
    else if (kind === 'blueprint' || kind === 'blueprints') plan.blueprint = where;
    else if (kind === 'worklog') plan.worklog = where;
    else if (kind === 'index') plan.index = where;
  }
  // §2.2: the Index section is the authority when it names a file.
  const index = sectionBody(text, 'Index');
  if (index) {
    const link = /\[[^\]]*\]\(([^)]+)\)/.exec(index);
    if (link) plan.indexDeclared = link[1].split('#')[0].trim();
    const target = link && safeRel(plan.indexDeclared);
    if (target && /\.md$/i.test(target)) plan.index = target;
  }
  return { plan, kinds, hasDocsMap: Boolean(body) };
}

/** §2.3 Status Labels, in declared order. A section with a table is read from
 *  its first column only — the Meaning cells and the prose under the table are
 *  about the labels, not among them. */
function readVocab(text) {
  const body = sectionBody(text, 'Status Labels');
  if (!body) return undefined;
  const rows = rowsIn(body.split(/\r?\n/));
  const source = rows.length ? rows.map(cells => cells[0]).join('\n') : body;
  const labels = [];
  const seen = new Set();
  for (const [, span] of source.matchAll(/`([^`\n]+)`/g)) {
    const label = span.replace(/<[^>]*>/g, '').replace(/\s+([,.;:])/g, '$1').replace(/\s{2,}/g, ' ').trim();
    if (!label || label.length > 24 || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    labels.push(label);
    if (labels.length === 16) break;
  }
  return labels.length ? labels : undefined;
}

/** §3.1 `**Label:**` value from a document's opening label block. */
function labelValue(text, label) {
  const prefix = `**${label}:**`;
  for (const raw of text.split(/\r?\n/, 40)) {
    const line = raw.trim();
    if (line.startsWith('## ')) break;
    if (line.startsWith(prefix)) return line.slice(prefix.length).trim();
  }
  return undefined;
}

/** Lines under every heading named `name` — any level, any case, closed by a
 *  same-or-higher heading. Fenced code is skipped whole, so a heading inside a
 *  fence opens nothing; subheadings inside the section are yielded, their
 *  content still belongs to it. The anchor rule §3.5 states, reused by §2.5. */
function* linesUnder(text, name) {
  let fence, level;
  for (const line of text.split(/\r?\n/)) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (marker) {
      const [char] = marker[1];
      if (!fence) fence = { char, length: marker[1].length };
      else if (fence.char === char && marker[1].length >= fence.length) fence = undefined;
      continue;
    }
    if (fence) continue;
    const heading = /^(#{1,6})\s+(.*?)\s*$/.exec(line);
    if (heading) {
      if (level !== undefined && heading[1].length <= level) level = undefined;
      if (level === undefined) {
        if (heading[2].replace(/\s*#+$/, '').trim().toLowerCase() === name) level = heading[1].length;
        continue;
      }
    }
    if (level !== undefined) yield line;
  }
}

/** §3.5: checked / total under a heading named `Rounds`; items under
 *  subheadings inside the section still count. */
function countRounds(text) {
  let done = 0, total = 0;
  for (const line of linesUnder(text, 'rounds')) {
    const task = /^\s*[-*+]\s+\[([ xX])\]\s/.exec(line);
    if (!task) continue;
    total++;
    if (task[1] !== ' ') done++;
  }
  return total ? { done, total } : undefined;
}

/** §2.5 `## Roles`: the first table under the heading, `Role | Owns | Decides`.
 *  Owns SHOULD name kinds by their Docs Map Type; a tool reads the backtick
 *  spans shaped like a Type name (a word, no path or label punctuation) and
 *  joins them to the Docs Map. Everything else in the cell — code, a gate, a
 *  path, a label — is legal and is not a kind. Display only: §2.5 is MAY, and
 *  a tool MUST NOT infer permissions from the table, so nothing here fails. */
function readRoles(text) {
  const block = [];
  for (const line of linesUnder(text, 'roles')) {
    if (line.trim().startsWith('|')) block.push(line);
    else if (block.length) break;
  }
  const [header, ...rows] = rowsIn(block);
  if (!header) return undefined;
  const ownsAt = Math.max(1, header.findIndex(cell => cell.replace(/[*_`]/g, '').trim().toLowerCase() === 'owns'));
  const roles = rows.filter(cells => cells[0]);
  const owned = new Set();
  for (const cells of roles) {
    for (const [, span] of (cells[ownsAt] ?? '').matchAll(/`([^`\n]+)`/g)) {
      if (/^[A-Za-z][\w-]*$/.test(span.trim())) owned.add(span.trim().toLowerCase());
    }
  }
  return { count: roles.length, owned: [...owned] };
}

/** §3.1: a Target value SHOULD be the version or milestone alone — `1.2`,
 *  `S3`, `chart-and-chance`. Whitespace or a bracket means a qualification is
 *  glued on, and a tool grouping by the exact string gets one group per doc. */
const isBareTarget = value => !/[\s()[\]{}]/.test(value);

/** A label link resolved from the feature directory, kept inside the repo. */
function resolveFrom(fromDir, raw) {
  const target = raw.split('#')[0].trim().replaceAll('\\', '/');
  if (!target || target.startsWith('/') || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)) return undefined;
  const parts = fromDir.split('/').filter(Boolean);
  for (const segment of target.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment !== '..') parts.push(segment);
    else if (parts.length) parts.pop();
    else return undefined;
  }
  return safeRel(parts.join('/'));
}

function linkedDoc(repo, plan, kind, base, label) {
  // §3.1: the label is the door. No spec-named label with a link → no door —
  // a house-named label (`Blueprint thực thi:`) is legal and unreadable, and
  // the naming convention is only a fallback for a link that resolves nowhere,
  // never a divining rod. Same rule as the reference implementation.
  if (!label?.includes('](')) return undefined;
  const link = /\[[^\]]*\]\(([^)]+)\)/.exec(label);
  const rel = (link && resolveFrom(plan.feature, link[1]))
    ?? `${kind === 'blueprint' ? plan.blueprint : plan.worklog}/${base}_${kind.toUpperCase()}.md`;
  return isFile(join(repo, rel)) ? rel : undefined;
}

// ── The check itself ───────────────────────────────────────────────────────

export function check(repo) {
  const out = [];
  const must = [];
  const text = read(join(repo, 'FLOCK.md'));
  if (text === undefined) {
    return { lines: ['FLOCK.md: not found at the repository root.'], must: ['FLOCK.md is missing — there is no adoption to check.'] };
  }

  let declared = 'undeclared';
  for (const raw of text.split(/\r?\n/, 12)) {
    const match = DECLARATION.exec(raw.trim());
    if (match) { declared = `flock ${match[1]}`; break; }
    if (raw.trim().startsWith('##')) break;
  }
  out.push(`FLOCK.md: ${declared}`);

  const { plan, kinds, hasDocsMap } = readPlan(text);
  if (!hasDocsMap) must.push('No `## Docs Map` section — the one thing the spec marks MUST (§2.1).');
  else {
    // §2.1 has no MUST that a Where path exists — a fresh adoption legitimately
    // declares where documents WILL go, so a clean-but-absent path is a note.
    // What does fail is a cell that is not a bare path or glob (an annotation
    // glued on): that cell cannot resolve for any tool, ever, and the failure
    // it causes downstream is silent — the shape the pilot migration hit.
    const notes = [];
    let unresolved = 0;
    for (const { kind, where } of kinds) {
      const rel = safeRel(where);
      if (!rel) { unresolved++; notes.push(`${kind} → ${where} (outside the repository) — a fact a repo may declare, but no tool will follow it`); continue; }
      // A glob names a family; its directory is what can be checked to exist.
      const probe = rel.includes('*') ? dirname(rel.slice(0, rel.indexOf('*') + 1)) : rel;
      if (isFile(join(repo, probe)) || isDir(join(repo, probe))) continue;
      unresolved++;
      if (/\s/.test(rel)) must.push(`Where cell is not a bare path or glob: ${kind} → ${where} — a tool reads the cell literally, so the location does not resolve (§2.1).`);
      else notes.push(`${kind} → ${where} — does not exist yet: a plan in a fresh adoption, a rotted path in a repo that has these documents`);
    }
    out.push(`Docs Map: ${kinds.length} kind${kinds.length === 1 ? '' : 's'} declared${unresolved ? '' : ' · every Where resolves'}`);
    for (const line of notes) out.push(`  note: ${line}`);
  }

  const indexAbs = join(repo, plan.index);
  const declaredIndex = plan.indexDeclared && !safeRel(plan.indexDeclared) ? ` (declared: ${plan.indexDeclared}, outside the repository)` : '';
  out.push(`Index: ${plan.index} — ${isFile(indexAbs) ? 'exists' : 'not found'}${declaredIndex}`);
  const indexText = read(indexAbs);
  const header = indexText?.split(/\r?\n/).map(line => line.trim()).find(line => INDEX_HEADERS.includes(line));
  out.push(`Machine-writable header (§3.3): ${header ? 'present' : 'absent (opt-in)'}`);

  const vocab = readVocab(text);
  out.push(`Status labels (§2.3): ${vocab ? `${vocab.length} declared — ${vocab.join(' · ')}` : 'none declared'}`);

  // §2.5 is MAY: no section prints nothing, and a section never fails (§6).
  const roles = readRoles(text);
  if (roles) {
    const types = new Set(kinds.map(({ kind }) => kind));
    const outside = roles.owned.filter(name => !types.has(name));
    out.push(`Roles (§2.5): ${roles.count} declared · Owns naming a Docs Map Type: ${roles.owned.length - outside.length}${outside.length ? ` · not in the Docs Map: ${outside.length}` : ''}`);
    if (outside.length) out.push(`  note: ${outside.join(' · ')} — Owns may hold what is not a document; a kind meant here wants a Docs Map row`);
  }

  let names = [];
  try { names = readdirSync(join(repo, plan.feature)).filter(name => name.toLowerCase().endsWith('.md')).slice(0, 500); } catch { /* no feature dir — reported via counts */ }
  let withStatus = 0, matched = 0, withTarget = 0, withBlueprint = 0, withWorklog = 0, withRounds = 0, checked = 0, totalRounds = 0;
  let withResearch = 0, withAudit = 0;
  const targets = [];
  for (const name of names) {
    const doc = read(join(repo, plan.feature, name));
    if (doc === undefined) continue;
    const base = name.slice(0, -3);
    const status = labelValue(doc, 'Status');
    if (status) withStatus++;
    if (status && vocab?.some(label => status.replace(/[*_`]/g, '').trim().toLowerCase().startsWith(label.toLowerCase()))) matched++;
    const target = labelValue(doc, 'Target');
    if (target) { withTarget++; targets.push(target); }
    const blueprint = linkedDoc(repo, plan, 'blueprint', base, labelValue(doc, 'Blueprint'));
    if (blueprint) {
      withBlueprint++;
      const rounds = countRounds(read(join(repo, blueprint)) ?? '');
      if (rounds) { withRounds++; checked += rounds.done; totalRounds += rounds.total; }
    }
    if (linkedDoc(repo, plan, 'worklog', base, labelValue(doc, 'Worklog'))) withWorklog++;
    // §3.1 (0.5): Research links are counted, never resolved — a link MAY leave
    // the repository. Audit is read as present or absent; a tool MUST NOT judge
    // the value beyond that, so any non-empty value counts.
    if (/\[[^\]]*\]\([^)]+\)/.test(labelValue(doc, 'Research') ?? '')) withResearch++;
    if (labelValue(doc, 'Audit')) withAudit++;
  }
  out.push(`Feature documents (${plan.feature}): ${names.length}`);
  out.push(`  Status label (§3.1): ${withStatus}${vocab ? ` · matching the declared vocabulary: ${matched}` : ''}`);
  const notBare = targets.filter(value => !isBareTarget(value));
  out.push(`  Target: ${withTarget}${withTarget ? ` · distinct values: ${new Set(targets).size} · not bare: ${notBare.length}` : ''}`);
  if (notBare.length) out.push(`    note: §3.1 asks for the value alone — ${[...new Set(notBare)].slice(0, 5).map(value => JSON.stringify(value)).join(' · ')}${new Set(notBare).size > 5 ? ' · …' : ''}`);
  out.push(`  Chain: blueprint link resolving: ${withBlueprint} · worklog link resolving: ${withWorklog}`);
  out.push(`  Research (§3.1): ${withResearch} · Audit: ${withAudit}`);
  out.push(`  Round lists (§3.5): ${withRounds}${withRounds ? ` — ${checked}/${totalRounds} checked overall` : ''}`);

  return { lines: out, must };
}

// ── Self-test: the shapes real adoptions taught us ─────────────────────────

function selfTest() {
  const root = mkdtempSync(join(tmpdir(), 'flock-check-'));
  const write = (rel, body) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), body); };
  const assert = (cond, message) => { if (!cond) { console.error(`self-test FAILED: ${message}`); process.exitCode = 1; } };
  const has = (result, fragment) => result.lines.some(line => line.includes(fragment));

  // 1. An adoption in the spec's own shape: default vocabulary, a blueprint
  //    whose Rounds list counts and whose DoD checklist does not.
  write('a/FLOCK.md', '# FLOCK.md\n\n> flock: 0.4\n\n## Docs Map\n\n| Type | Where | Answers |\n|---|---|---|\n| feature | `docs/feature/` | What? |\n| blueprint | `docs/blueprint/` | How? |\n| index | [docs/ROADMAP.md](docs/ROADMAP.md) | State? |\n| research | `../research/` | Measured? |\n\n## Index\n\n[docs/ROADMAP.md](docs/ROADMAP.md)\n\n## Status Labels\n\n`Design` · `Building` · `Done <date>` · `Parked`\n');
  write('a/docs/ROADMAP.md', '# Roadmap\n\n| Item | Target | Status | Docs |\n|---|---|---|---|\n| One | 1.0 | Building | [ONE.md](feature/ONE.md) |\n');
  write('a/docs/feature/ONE.md', '# One\n\n**Status:** Building 2026-08-28\n**Target:** 1.0\n**Blueprint:** [ONE_BLUEPRINT.md](../blueprint/ONE_BLUEPRINT.md)\n**Worklog:** —\n**Research:** [x.md](../../research/x.md) · [y](https://example.com)\n**Audit:** pending\n');
  write('a/docs/blueprint/ONE_BLUEPRINT.md', '# One — Implementation Blueprint\n\n## Rounds\n\n- [x] B1 — done\n- [ ] B2 — pending\n\n```markdown\n- [ ] an example, not a round\n## Rounds\n```\n\n## Definition of Done\n\n- [ ] not a round either\n');
  const a = check(join(root, 'a'));
  assert(a.must.length === 0, `fixture a: expected no MUST violations, got ${JSON.stringify(a.must)}`);
  assert(has(a, 'Round lists (§3.5): 1 — 1/2 checked overall'), `fixture a: §3.5 count wrong: ${JSON.stringify(a.lines)}`);
  assert(has(a, 'FLOCK.md: flock 0.4'), 'fixture a: the declared version should be reported');
  assert(has(a, '4 declared'), 'fixture a: default vocabulary should read as 4 labels');
  assert(has(a, 'Machine-writable header (§3.3): present'), 'fixture a: §3.3 header should be detected');
  assert(has(a, 'Research (§3.1): 1 · Audit: 1'), `fixture a: §3.1 Research/Audit counts wrong: ${JSON.stringify(a.lines)}`);
  assert(has(a, 'research → ../research/ (outside the repository)'), `fixture a: an out-of-repo research row is a note, not a violation: ${JSON.stringify(a.lines)}`);

  // 2. The house shapes two dogfood runs hit: vocabulary as a table with prose
  //    under it (first column only), a house blueprint label the tool cannot
  //    follow, and an index declared outside the repository. Declared 0.3 with
  //    the profile field of that era — read as 0.3, the field dropped (§1).
  write('b/FLOCK.md', '# FLOCK.md\n\n> flock: 0.3 · profile: flow\n\n## Docs Map\n\n| Type | Where | Answers |\n|---|---|---|\n| feature | `docs/feature/` | What? |\n| index | [../elsewhere/ROADMAP.md](../elsewhere/ROADMAP.md) | State? |\n\n## Index\n\n[../elsewhere/ROADMAP.md](../elsewhere/ROADMAP.md)\n\n## Status Labels\n\n| Label | Meaning |\n|---|---|\n| `🟢 Shipped <date>` | Out |\n| `🟡 Building` | Under way (`B1 ✅ · B2` per round) |\n\nOne doc writes `✅` instead — recorded, not reconciled.\n');
  write('b/docs/feature/TWO.md', '# Two\n\n**Status:** 🟡 Building\n**Blueprint thực thi:** [TWO_BLUEPRINT.md](../blueprint/TWO_BLUEPRINT.md)\n**Research:** notes in the wiki\n**Audit:**\n');
  write('b/docs/blueprint/TWO_BLUEPRINT.md', '# Two — Implementation Blueprint\n\n## Rounds\n\n- [ ] B1\n');
  const b = check(join(root, 'b'));
  assert(b.must.length === 0, `fixture b: an out-of-repo index is a note, not a violation: ${JSON.stringify(b.must)}`);
  assert(has(b, 'FLOCK.md: flock 0.3') && !has(b, 'profile'), `fixture b: a 0.3 profile field must be dropped, not reported: ${JSON.stringify(b.lines[0])}`);
  assert(has(b, '2 declared — 🟢 Shipped · 🟡 Building'), `fixture b: vocabulary must be first-column only: ${JSON.stringify(b.lines)}`);
  assert(has(b, 'blueprint link resolving: 0'), 'fixture b: a house label must leave the blueprint unreachable');
  assert(has(b, 'Round lists (§3.5): 0'), 'fixture b: an unreachable blueprint contributes no round list');
  assert(has(b, 'outside the repository'), 'fixture b: the out-of-repo index must be named');
  assert(has(b, 'Research (§3.1): 0 · Audit: 0'), `fixture b: a linkless Research and an empty Audit must not count: ${JSON.stringify(b.lines)}`);

  // 3. MUST violations: a missing Docs Map, and a Where path that lies.
  write('c/FLOCK.md', '# FLOCK.md\n\nNo sections at all.\n');
  const c = check(join(root, 'c'));
  assert(c.must.length === 1 && c.must[0].includes('Docs Map'), `fixture c: missing Docs Map must fail: ${JSON.stringify(c.must)}`);
  write('d/FLOCK.md', '# FLOCK.md\n\n## Docs Map\n\n| Type | Where | Answers |\n|---|---|---|\n| feature | `docs/feature/ (20 files)` | What? |\n');
  const d = check(join(root, 'd'));
  assert(d.must.length === 1 && d.must[0].includes('does not resolve'), `fixture d: the annotated Where cell must fail: ${JSON.stringify(d.must)}`);

  // 4. Verbatim copies into a fresh repository — the README's Starting fresh
  //    path, and the template as shipped. The declared locations do not exist
  //    yet; they are a plan, and a plan is a note, not a violation.
  const here = dirname(fileURLToPath(import.meta.url));
  write('e/FLOCK.md', readFileSync(join(here, '..', 'spec', 'templates', 'FLOCK.md'), 'utf8'));
  const e = check(join(root, 'e'));
  assert(e.must.length === 0, `fixture e: a verbatim template copy must pass: ${JSON.stringify(e.must)}`);
  assert(has(e, 'does not exist yet'), 'fixture e: planned locations must be named as notes');
  assert(has(e, 'Index: docs/ROADMAP.md — not found'), 'fixture e: an unseeded index is reported, not failed');
  write('f/FLOCK.md', readFileSync(join(here, '..', 'examples', 'FLOCK.md'), 'utf8'));
  write('f/docs/ROADMAP.md', '| Item | Target | Status | Docs |\n|---|---|---|---|\n');
  const f = check(join(root, 'f'));
  assert(f.must.length === 0, `fixture f: a fresh example copy with a seeded index must pass: ${JSON.stringify(f.must)}`);
  assert(has(f, 'Machine-writable header (§3.3): present'), 'fixture f: the seeded index header must be detected');

  // 5. §2.5 Roles and §3.1 Target bareness. The section is found in any case,
  //    only its first table is read, and a same-level heading closes it. Owns
  //    joins to the Docs Map through Type-shaped backtick spans only — a path,
  //    a label and unquoted words are not kinds. Target values qualified with a
  //    space or a bracket are counted, never failed.
  write('g/FLOCK.md', '# FLOCK.md\n\n## Docs Map\n\n| Type | Where | Answers |\n|---|---|---|\n| feature | `docs/feature/` | What? |\n| blueprint | `docs/blueprint/` | How? |\n\n## roles\n\nWho owns what.\n\n| Role | Owns | Decides |\n|---|---|---|\n| architect | `feature` · `Blueprint` · the `**Audit:**` field | scope |\n| builder | code · `gizmo` · `docs/feature/` | nothing about scope |\n\n| Alias | Meaning |\n|---|---|\n| `x` | not a role |\n\n## Later\n\n| Role | Owns | Decides |\n|---|---|---|\n| ghost | `phantom` | — |\n');
  const targets = ['1.2', '1.2', 'S3', '1.2 (moved from 1.1)', 'v2[rc]'];
  targets.forEach((value, i) => write(`g/docs/feature/T${i}.md`, `# T${i}\n\n**Status:** Design\n**Target:** ${value}\n`));
  const g = check(join(root, 'g'));
  assert(g.must.length === 0, `fixture g: Roles and Target are never MUST: ${JSON.stringify(g.must)}`);
  assert(has(g, 'Roles (§2.5): 2 declared · Owns naming a Docs Map Type: 2 · not in the Docs Map: 1'), `fixture g: §2.5 counts wrong: ${JSON.stringify(g.lines)}`);
  assert(has(g, 'note: gizmo —') && !has(g, 'phantom'), `fixture g: only the unmatched kind of the first table is named: ${JSON.stringify(g.lines)}`);
  assert(has(g, 'Target: 5 · distinct values: 4 · not bare: 2'), `fixture g: §3.1 Target bareness wrong: ${JSON.stringify(g.lines)}`);
  assert(has(g, '"1.2 (moved from 1.1)" · "v2[rc]"'), `fixture g: the not-bare values must be named: ${JSON.stringify(g.lines)}`);

  // 6. No Roles section prints nothing — absence is not an error (§6) — and a
  //    `## Roles` inside fenced code opens no section. A bare Target only.
  write('h/FLOCK.md', '# FLOCK.md\n\n## Docs Map\n\n| Type | Where | Answers |\n|---|---|---|\n| feature | `docs/feature/` | What? |\n\n```markdown\n## Roles\n\n| Role | Owns | Decides |\n|---|---|---|\n| owner | `feature` | all |\n```\n');
  write('h/docs/feature/ONE.md', '# One\n\n**Target:** S3\n');
  const h = check(join(root, 'h'));
  assert(h.must.length === 0, `fixture h: ${JSON.stringify(h.must)}`);
  assert(!h.lines.some(line => line.includes('Roles')), `fixture h: no Roles section must print no Roles line: ${JSON.stringify(h.lines)}`);
  assert(has(h, 'Target: 1 · distinct values: 1 · not bare: 0') && !has(h, '§3.1 asks'), `fixture h: a bare Target gets no note: ${JSON.stringify(h.lines)}`);
  assert(!has(a, 'Roles (§2.5)'), 'fixture a: the spec-shaped fixture has no Roles section and must print none');

  rmSync(root, { recursive: true, force: true });
  if (process.exitCode !== 1) console.log('self-test: OK (8 fixtures)');
}

// ── Entry ──────────────────────────────────────────────────────────────────

const arg = process.argv[2];
if (arg === '--self-test') selfTest();
else if (!arg) {
  console.error('Usage: node tools/check.mjs <path-to-repo> | --self-test');
  process.exitCode = 2;
} else {
  const { lines, must } = check(arg);
  for (const line of lines) console.log(line);
  if (must.length) {
    console.log('\nMUST violations:');
    for (const line of must) console.log(`  ✗ ${line}`);
    process.exitCode = 1;
  } else {
    console.log('\nMUST checks: OK. Everything else the spec leaves as guidance.');
  }
  console.log('A richer reader of this standard: RepoFlock — https://repoflock.com/flock');
}
