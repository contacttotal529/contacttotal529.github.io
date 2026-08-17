// Turns the flat manuscript (resources/full-document.md) into the JSON the site renders.
// Output lands in src/generated so it can be imported as a module — the prerender step runs
// the app in Node, where there is no server to fetch assets from.
// The manuscript stays the single source of truth for prose; curated.json holds only the
// facts that the manuscript states in prose but that the site needs as structured data.
//
//   node tools/build-content.mjs
//
// Fails with a non-zero exit if an outline heading no longer matches the manuscript, so a
// silently half-parsed book can never reach the build.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { outline } from './book-outline.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(root, 'resources', 'full-document.md');
const OUT_DIR = join(root, 'projects', 'website', 'src', 'generated');

const PLAN_TYPES = ['Direct-Sold', 'Advisor-Sold', 'Prepaid Tuition'];

/** Smart quotes and dashes vary through the manuscript; compare on a flattened form. */
function normalise(line) {
  return line
    .normalize('NFC')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function slug(text) {
  return normalise(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const isUrl = (line) => /^https?:\/\//i.test(line.trim());
const money = (value) => {
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

// ---------------------------------------------------------------- slice the manuscript

const rawLines = readFileSync(SOURCE, 'utf8').split(/\r?\n/);

/** Walk the file once, cutting it at each declared boundary in order. */
function sliceByOutline() {
  const slices = [];
  let cursor = 0;

  for (let i = 0; i < outline.length; i += 1) {
    const boundary = outline[i];
    const target = normalise(boundary.heading);
    let found = -1;

    for (let line = cursor; line < rawLines.length; line += 1) {
      if (normalise(rawLines[line]) === target) {
        found = line;
        break;
      }
    }

    if (found === -1) {
      throw new Error(
        `Outline heading not found at or after line ${cursor + 1}: "${boundary.heading}"\n` +
          `Fix tools/book-outline.mjs or the manuscript, then rebuild.`,
      );
    }

    slices.push({ boundary, start: found + 1, headingLine: found });
    cursor = found + 1;
  }

  for (let i = 0; i < slices.length; i += 1) {
    slices[i].end = i + 1 < slices.length ? slices[i + 1].headingLine : rawLines.length;
  }

  return slices;
}

// ---------------------------------------------------------------- prose → blocks

/** Split a run of lines into paragraph groups on blank lines. */
function groupLines(lines) {
  const groups = [];
  let current = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length) groups.push(current);
      current = [];
    } else {
      current.push(line.replace(/\s+$/, ''));
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

const EXAMPLE_RE = /^\*?\s*example\s*\d*\s*:\s*/i;
const NOTE_RE = /^\*?\s*note\s*:\s*/i;
// The manuscript bullets with hyphens, en/em dashes, real bullets and leading asterisks.
const BULLET_RE = /^\s*[-–—•·]\s*/;
const STAR_BULLET_RE = /^\*(?!note|example)\s*\S/i;
const TREE_RE = /^decision tree/i;
const isBullet = (line) => BULLET_RE.test(line) || STAR_BULLET_RE.test(line);
const stripBullet = (line) =>
  line
    .replace(BULLET_RE, '')
    .replace(/^\*\s*/, '')
    .trim();

/**
 * The "Teacher vs. Tutor" comparison is the manuscript's only real table outside the
 * appendices, and it arrives as one cell per line. Rebuild it rather than emit 15 stray
 * paragraphs.
 */
function extractTutorTable(groups) {
  const index = groups.findIndex((g) => normalise(g[0]) === 'feature');
  if (index === -1) return groups;

  const cells = groups[index].map((l) => l.trim());
  if (cells.length < 12) return groups;

  const header = cells.slice(0, 3);
  const rows = [];
  for (let i = 3; i + 2 < cells.length; i += 3) rows.push(cells.slice(i, i + 3));

  const table = { type: 'table', header, rows };
  return [...groups.slice(0, index), table, ...groups.slice(index + 1)];
}

/**
 * Examples are not always separated from the surrounding prose by a blank line, so a group
 * gets cut again wherever an "Example:" or "Note:" marker starts a line.
 */
function splitOnMarkers(groups) {
  const out = [];
  for (const group of groups) {
    if (!Array.isArray(group)) {
      out.push(group);
      continue;
    }
    let current = [];
    for (const line of group) {
      const marked = EXAMPLE_RE.test(line.trim()) || NOTE_RE.test(line.trim());
      if (marked && current.length) {
        out.push(current);
        current = [];
      }
      current.push(line);
    }
    if (current.length) out.push(current);
  }
  return out;
}

function classify(group) {
  if (!Array.isArray(group)) return group; // already a built block

  const lines = group.filter((l) => l.trim() !== '');
  if (!lines.length) return null;

  const links = lines.filter(isUrl).map((l) => l.trim());
  const body = lines.filter((l) => !isUrl(l));

  if (!body.length) return { type: 'links', links };

  const first = body[0].trim();

  if (TREE_RE.test(first)) {
    const items = body.slice(1).map((l) => l.replace(BULLET_RE, '').trim());
    const label = first.replace(/^decision tree\s*:?\s*/i, '').trim();
    return { type: 'decision-tree', label: label || null, items, links };
  }

  if (NOTE_RE.test(first)) {
    return {
      type: 'note',
      paragraphs: [first.replace(NOTE_RE, ''), ...body.slice(1).map((l) => l.trim())].filter(
        Boolean,
      ),
      links,
    };
  }

  if (EXAMPLE_RE.test(first)) {
    const label = first
      .match(EXAMPLE_RE)[0]
      .replace(/[:*\s]+$/, '')
      .replace(/^\*/, '')
      .trim();
    return {
      type: 'example',
      label: label.replace(/\b\w/g, (c) => c.toUpperCase()),
      paragraphs: [first.replace(EXAMPLE_RE, ''), ...body.slice(1).map((l) => l.trim())].filter(
        Boolean,
      ),
      links,
    };
  }

  return segmentProse(body, links);
}

/**
 * A paragraph group often mixes narrative with a bulleted run — the Foreword's "you need to
 * know" list, the family-member list, the "*Consider" runs in Maximizing. Emit each run as its
 * own block instead of flattening everything into paragraphs.
 *
 * Also catches the manuscript's other list idiom: a line ending in a colon followed by
 * lower-case continuation lines ("...the tutor is not related to the student and:" / "is
 * licensed as a teacher in any state;").
 */
function segmentProse(body, links) {
  const blocks = [];
  let prose = [];
  let items = [];
  let lead = null;

  const flushProse = () => {
    if (prose.length) blocks.push({ type: 'prose', paragraphs: prose, links: [] });
    prose = [];
  };
  const flushList = () => {
    if (items.length >= 2) {
      blocks.push({ type: 'list', lead, items, links: [] });
    } else if (items.length === 1) {
      if (lead) prose.push(lead);
      prose.push(items[0]);
    }
    items = [];
    lead = null;
  };

  for (let i = 0; i < body.length; i += 1) {
    const line = body[i].trim();
    const previous = i > 0 ? body[i - 1].trim() : '';
    const continuesColonList =
      items.length > 0 ? /^[a-z]/.test(line) : previous.endsWith(':') && /^[a-z]/.test(line);

    if (isBullet(line)) {
      if (!items.length) {
        // A short trailing line before the run reads as the list's lead-in.
        if (prose.length && prose[prose.length - 1].endsWith(':')) lead = prose.pop();
        flushProse();
      }
      items.push(stripBullet(line));
    } else if (continuesColonList) {
      if (!items.length) {
        lead = prose.pop() ?? null;
        flushProse();
      }
      items.push(line);
    } else {
      flushList();
      prose.push(line);
    }
  }

  flushList();
  flushProse();

  if (!blocks.length) return [{ type: 'prose', paragraphs: [], links }];

  // Citations belong to the group as a whole; hang them off the last block.
  blocks[blocks.length - 1].links = links;
  return blocks;
}

function toBlocks(lines) {
  return splitOnMarkers(extractTutorTable(groupLines(lines)))
    .flatMap((group) => {
      const result = classify(group);
      return Array.isArray(result) ? result : [result];
    })
    .filter((b) => b && (b.type !== 'prose' || b.paragraphs.length || b.links.length));
}

function plainText(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.paragraphs) out.push(...b.paragraphs);
    if (b.items) out.push(...b.items);
    if (b.lead) out.push(b.lead);
    if (b.rows) out.push(...b.rows.flat());
  }
  return out.join(' ');
}

// The standing disclaimer opens several chapters; it is never a useful summary.
const BOILERPLATE_RE = /^(no statement or example|this book will give some examples)/i;

/**
 * First substantive sentence in a run of blocks — used for hub lists and search results.
 * Skips the repeated disclaimer and stub lines like "You need to know:".
 */
function summarise(blocks) {
  // Prose first, then the lead-in and items of a list, then a decision tree or worked example.
  // Seven rules open straight into a list or an example and would otherwise have no summary —
  // and the summary is what becomes the page's meta description.
  const tiers = [
    blocks.filter((b) => b.type === 'prose').flatMap((b) => b.paragraphs ?? []),
    blocks.flatMap((b) => (b.type === 'list' ? [b.lead, ...b.items] : [])),
    blocks.flatMap((b) => (b.type === 'decision-tree' ? b.items : [])),
    blocks.filter((b) => b.type === 'example').flatMap((b) => b.paragraphs ?? []),
  ];

  const usable = (p) => p && p.length >= 60 && !BOILERPLATE_RE.test(p);
  const text = tiers.flatMap((tier) => tier.filter(usable))[0];
  if (!text) return null;
  const match = text.match(/^.{40,220}?[.!?](\s|$)/);
  return (match ? match[0] : text.slice(0, 200)).trim();
}

// ---------------------------------------------------------------- appendix parsers

function parsePlans(lines) {
  const cells = lines.map((l) => l.trim()).filter(Boolean);
  const headerEnd = cells.findIndex((c) => /program description pdf link/i.test(c));
  const records = cells.slice(headerEnd + 1);

  const byState = new Map();
  const warnings = [];

  for (let i = 0; i + 3 < records.length + 1; i += 4) {
    const [rawState, name, type, link] = records.slice(i, i + 4);
    if (!rawState || !name || !type) break;

    if (!PLAN_TYPES.includes(type)) {
      warnings.push(`Unexpected plan type "${type}" near state "${rawState}"`);
    }

    const anyPlan = rawState.endsWith('*');
    // The manuscript lists D.C. twice under two names.
    const stateName = rawState
      .replace(/\*$/, '')
      .trim()
      .replace(/^Washington D\.C\.$/i, 'District of Columbia');

    const entry = byState.get(stateName) ?? {
      name: stateName,
      slug: slug(stateName),
      anyPlanDeduction: false,
      plans: [],
    };
    entry.anyPlanDeduction = entry.anyPlanDeduction || anyPlan;

    const plan = {
      name,
      type,
      url: link && isUrl(link) ? link.trim() : null,
      note: link && !isUrl(link) ? link.trim() : null,
    };
    if (!entry.plans.some((p) => p.name === plan.name && p.type === plan.type)) {
      entry.plans.push(plan);
    }

    byState.set(stateName, entry);
  }

  return { states: [...byState.values()], warnings };
}

function parseCosts(lines) {
  const cells = lines.map((l) => l.trim()).filter(Boolean);
  const headerEnd = cells.findIndex((c) => /^vs\. natl avg$/i.test(c));
  const records = cells.slice(headerEnd + 1);

  const rows = [];
  let national = null;

  for (let i = 0; i < records.length;) {
    if (/^NATIONAL AVERAGE/i.test(records[i])) {
      national = {
        tuition: money(records[i + 2]),
        room: money(records[i + 3]),
        board: money(records[i + 4]),
        books: money(records[i + 5]),
        total: money(records[i + 6]),
      };
      break;
    }

    const chunk = records.slice(i, i + 8);
    if (chunk.length < 8) break;

    rows.push({
      state: chunk[0],
      slug: slug(chunk[0]),
      school: chunk[1],
      tuition: money(chunk[2]),
      room: money(chunk[3]),
      board: money(chunk[4]),
      books: money(chunk[5]),
      total: money(chunk[6]),
      vsNational: money(chunk[7]),
    });
    i += 8;
  }

  return { rows, national };
}

function parseFamily(lines) {
  const cells = lines.map((l) => l.trim()).filter(Boolean);
  // Intro sentences run on to a colon; every family member is its own full-stop line.
  const lead = cells.filter((c) => c.endsWith(':'));
  const items = cells
    .filter((c) => !lead.includes(c))
    .map((c) => c.replace(BULLET_RE, '').trim())
    .filter((c) => c.length > 3);
  return { lead, items };
}

// ---------------------------------------------------------------- assemble

const slices = sliceByOutline();
const chapters = [];
const appendices = {};
const warnings = [];
let currentChapter = null;

for (const { boundary, start, end, headingLine } of slices) {
  const lines = rawLines.slice(start, end);

  if (boundary.type === 'skip') continue;

  if (boundary.type === 'appendix') {
    const body =
      boundary.kind === 'plans'
        ? parsePlans(lines)
        : boundary.kind === 'costs'
          ? parseCosts(lines)
          : parseFamily(lines);
    if (body.warnings) warnings.push(...body.warnings);
    appendices[boundary.kind] = {
      id: boundary.id,
      title: boundary.title,
      heading: rawLines[headingLine].trim(),
      ...body,
    };
    delete appendices[boundary.kind].warnings;
    continue;
  }

  if (boundary.type === 'chapter') {
    currentChapter = {
      id: boundary.id,
      title: boundary.title,
      subtitle: boundary.subtitle ?? null,
      heading: rawLines[headingLine].trim(),
      intro: toBlocks(lines),
      sections: [],
    };
    currentChapter.summary = summarise(currentChapter.intro);
    chapters.push(currentChapter);
    continue;
  }

  if (!currentChapter) throw new Error(`Section "${boundary.heading}" appears before any chapter`);

  const blocks = toBlocks(lines);
  currentChapter.sections.push({
    id: boundary.id,
    chapterId: currentChapter.id,
    chapterTitle: currentChapter.title,
    title: rawLines[headingLine].trim().replace(/\s+/g, ' '),
    blocks,
    summary: summarise(blocks),
    exampleCount: blocks.filter((b) => b.type === 'example').length,
    text: plainText(blocks),
  });
}

const curated = JSON.parse(readFileSync(join(root, 'tools', 'curated.json'), 'utf8'));

for (const chapter of chapters) {
  // A hand-written blurb describes the chapter's rule list better than its first sentence,
  // several of which are stubs or the standing disclaimer.
  chapter.summary = curated.chapterBlurbs?.[chapter.id] ?? chapter.summary;
  chapter.text = plainText(chapter.intro);
  chapter.sectionCount = chapter.sections.length;
  chapter.exampleCount =
    chapter.intro.filter((b) => b.type === 'example').length +
    chapter.sections.reduce((n, s) => n + s.exampleCount, 0);
}

// Fold the prose-derived state facts onto the appendix plan list.
const factsBySlug = new Map(curated.stateFacts.map((f) => [slug(f.state), f]));
for (const state of appendices.plans.states) {
  const facts = factsBySlug.get(state.slug);
  Object.assign(state, {
    taxBenefit: facts?.taxBenefit ?? null,
    taxBenefitDetail: facts?.taxBenefitDetail ?? null,
    k12: facts?.k12 ?? 'unstated',
    maxContribution: facts?.maxContribution ?? null,
    maxContributionNote: facts?.maxContributionNote ?? null,
    morningstarGold: facts?.morningstarGold ?? false,
    protection: facts?.protection ?? null,
    recapture: facts?.recapture ?? [],
    notes: facts?.notes ?? [],
  });
  const cost = appendices.costs.rows.find((r) => r.slug === state.slug);
  state.flagship = cost
    ? { school: cost.school, total: cost.total, vsNational: cost.vsNational }
    : null;
}

const unmatched = curated.stateFacts.filter(
  (f) => !appendices.plans.states.some((s) => s.slug === slug(f.state)),
);
if (unmatched.length) {
  warnings.push(
    `Curated facts with no matching appendix state: ${unmatched.map((f) => f.state).join(', ')}`,
  );
}

const book = {
  title: 'Total529.com',
  subtitle: 'Understanding, Using, and Maximizing 529 Accounts',
  edition: '529 30th Anniversary Edition',
  author: 'C. Richard Hopkins, MD, CRPC',
  taxYear: 2026,
  chapters,
  appendices: {
    plans: { id: appendices.plans.id, title: appendices.plans.title },
    costs: { id: appendices.costs.id, title: appendices.costs.title },
    family: appendices.family,
  },
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'book.json'), JSON.stringify(book));
writeFileSync(
  join(OUT_DIR, 'states.json'),
  JSON.stringify({
    states: appendices.plans.states.sort((a, b) => a.name.localeCompare(b.name)),
    groups: curated.stateGroups,
    sources: curated.stateSources,
  }),
);
writeFileSync(join(OUT_DIR, 'costs.json'), JSON.stringify(appendices.costs));
writeFileSync(
  join(OUT_DIR, 'site.json'),
  JSON.stringify({
    figures: curated.figures,
    timeline: curated.timeline,
    comparison: curated.comparison,
    quickAnswers: curated.quickAnswers,
    disclaimer: curated.disclaimer,
  }),
);

const totalSections = chapters.reduce((n, c) => n + c.sections.length, 0);
const totalExamples = chapters.reduce((n, c) => n + c.exampleCount, 0);

console.log(
  `content: ${chapters.length} chapters, ${totalSections} sections, ${totalExamples} examples`,
);
console.log(
  `content: ${appendices.plans.states.length} states, ${appendices.plans.states.reduce((n, s) => n + s.plans.length, 0)} plans, ${appendices.costs.rows.length} cost rows`,
);
console.log(`content: ${appendices.family.items.length} family-member entries`);
for (const w of warnings) console.warn(`  warning: ${w}`);

// ---------------------------------------------------------------- SEO assets

// Prerendering gives every route a real HTML file; the sitemap tells crawlers they exist.
// Generated here so a rule added to the manuscript is listed without anyone remembering to.
const ORIGIN = 'https://total529.com';
const STATIC_ROUTES = ['', 'guide', 'read', 'states', 'costs', 'history', 'reference', 'about'];

const urls = [
  ...STATIC_ROUTES.map((path) => ({ path, priority: path === '' ? '1.0' : '0.8' })),
  ...chapters.map((c) => ({ path: `guide/${c.id}`, priority: '0.7' })),
  ...chapters.flatMap((c) =>
    c.sections.map((s) => ({ path: `guide/${c.id}/${s.id}`, priority: '0.9' })),
  ),
  ...appendices.plans.states.map((s) => ({ path: `states/${s.slug}`, priority: '0.6' })),
];

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    ({ path, priority }) =>
      `  <url><loc>${ORIGIN}/${path ? `${path}/` : ''}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`,
  ),
  '</urlset>',
  '',
].join('\n');

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  '# Search results are a lookup convenience, not content worth indexing.',
  'Disallow: /search',
  '',
  `Sitemap: ${ORIGIN}/sitemap.xml`,
  '',
].join('\n');

const PUBLIC_DIR = join(root, 'projects', 'website', 'public');
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
writeFileSync(join(PUBLIC_DIR, 'robots.txt'), robots);
console.log(`content: sitemap lists ${urls.length} URLs`);
