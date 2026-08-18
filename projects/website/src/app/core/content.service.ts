import { Injectable, computed, signal } from '@angular/core';
import { chapterLoaders } from '../../generated/chapter-loaders';
import type {
  Block,
  Book,
  Chapter,
  ChapterContent,
  CostsDoc,
  SearchEntry,
  SearchHit,
  SearchIndex,
  Section,
  SiteDoc,
  StateEntry,
  StatesDoc,
} from './content.models';

// Content is imported rather than fetched: prerendering runs this app in Node, where there is
// no origin to fetch from. Dynamic imports keep each piece in its own lazy chunk.
//
// The split is deliberate. book.json is the table of contents; the prose sits in a file per
// chapter, and the search index carries sorted token lists instead of sentences. No single
// asset on the site is the book — that is what the printed edition is for.
const load = {
  book: () => import('../../generated/book.json').then((m) => m.default as unknown as Book),
  states: () =>
    import('../../generated/states.json').then((m) => m.default as unknown as StatesDoc),
  costs: () => import('../../generated/costs.json').then((m) => m.default as unknown as CostsDoc),
  site: () => import('../../generated/site.json').then((m) => m.default as unknown as SiteDoc),
  searchIndex: () =>
    import('../../generated/search-index.json').then((m) => m.default as unknown as SearchIndex),
};

interface IndexEntry extends SearchEntry {
  haystack: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly bookSignal = signal<Book | null>(null);
  private readonly statesSignal = signal<StatesDoc | null>(null);
  private readonly costsSignal = signal<CostsDoc | null>(null);
  private readonly siteSignal = signal<SiteDoc | null>(null);

  /** Chapter prose, keyed by chapter id, as each one is opened. */
  private readonly contentSignal = signal<Record<string, ChapterContent>>({});
  private readonly pending = new Map<string, Promise<void>>();

  private index: IndexEntry[] = [];
  private indexLoad: Promise<void> | null = null;
  private readonly indexReady = signal(false);

  readonly book = this.bookSignal.asReadonly();
  readonly statesDoc = this.statesSignal.asReadonly();
  readonly costs = this.costsSignal.asReadonly();
  readonly site = this.siteSignal.asReadonly();

  readonly chapters = computed<Chapter[]>(() => this.bookSignal()?.chapters ?? []);
  readonly states = computed<StateEntry[]>(() => this.statesSignal()?.states ?? []);

  /** Chapters that carry rule sections — the appendix-style chapters are shown separately. */
  readonly ruleChapters = computed(() => this.chapters().filter((c) => c.sections.length > 0));
  readonly essayChapters = computed(() => this.chapters().filter((c) => c.sections.length === 0));

  readonly totalSections = computed(() =>
    this.chapters().reduce((n, c) => n + c.sections.length, 0),
  );
  readonly totalExamples = computed(() => this.chapters().reduce((n, c) => n + c.exampleCount, 0));
  readonly totalPlans = computed(() => this.states().reduce((n, s) => n + s.plans.length, 0));

  async load(): Promise<void> {
    if (this.bookSignal()) return;

    const [book, states, costs, site] = await Promise.all([
      load.book(),
      load.states(),
      load.costs(),
      load.site(),
    ]);

    this.bookSignal.set(book);
    this.statesSignal.set(states);
    this.costsSignal.set(costs);
    this.siteSignal.set(site);
  }

  /**
   * Fetches one chapter's prose. Routes that render prose resolve this before activating, so
   * a prerendered page never ships with an empty body.
   */
  loadChapter(id: string): Promise<void> {
    if (this.contentSignal()[id]) return Promise.resolve();

    const existing = this.pending.get(id);
    if (existing) return existing;

    const loader = chapterLoaders[id];
    if (!loader) return Promise.resolve();

    const run = loader()
      .then((content) => {
        this.contentSignal.update((all) => ({ ...all, [id]: content }));
      })
      .finally(() => this.pending.delete(id));

    this.pending.set(id, run);
    return run;
  }

  chapter(id: string): Chapter | undefined {
    return this.chapters().find((c) => c.id === id);
  }

  section(chapterId: string, sectionId: string): Section | undefined {
    return this.chapter(chapterId)?.sections.find((s) => s.id === sectionId);
  }

  /** A chapter's own opening blocks. Empty until its prose has been loaded. */
  chapterIntro(chapterId: string): Block[] {
    return this.contentSignal()[chapterId]?.intro ?? [];
  }

  /** One rule's blocks. Empty until its chapter's prose has been loaded. */
  sectionBlocks(chapterId: string, sectionId: string): Block[] {
    const content = this.contentSignal()[chapterId];
    return content?.sections.find((s) => s.id === sectionId)?.blocks ?? [];
  }

  state(slug: string): StateEntry | undefined {
    return this.states().find((s) => s.slug === slug);
  }

  /** Previous/next across the whole book, so the site can still be read cover to cover. */
  neighbours(chapterId: string, sectionId: string): { prev: Section | null; next: Section | null } {
    const flat = this.chapters().flatMap((c) => c.sections);
    const at = flat.findIndex((s) => s.chapterId === chapterId && s.id === sectionId);
    return {
      prev: at > 0 ? flat[at - 1] : null,
      next: at >= 0 && at < flat.length - 1 ? flat[at + 1] : null,
    };
  }

  /** Rules that discuss the same thing. Scored at build time; resolved here by identity. */
  related(section: Section): Section[] {
    return section.related
      .map((ref) => this.section(ref.chapterId, ref.id))
      .filter((s): s is Section => !!s);
  }

  /**
   * Pulls in the search index on demand. It is the largest asset on the site and only /search
   * has any use for it, so no other page pays for it.
   */
  ensureSearchIndex(): Promise<void> {
    return (this.indexLoad ??= load.searchIndex().then((doc) => {
      this.index = doc.entries.map((entry) => ({ ...entry, haystack: entry.tokens.join(' ') }));
      this.indexReady.set(true);
    }));
  }

  search(query: string, limit = 40): SearchHit[] {
    // Read as a signal so results recompute when the index lands, not just when typing.
    if (!this.indexReady()) return [];

    const terms = query
      .toLowerCase()
      .split(/[^a-z0-9$%]+/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    if (!terms.length) return [];

    const hits: SearchHit[] = [];
    for (const entry of this.index) {
      let score = 0;
      for (const term of terms) {
        const inTitle = entry.title.toLowerCase().includes(term);
        const inBody = entry.haystack.includes(term);
        if (inTitle) score += 6;
        if (inBody) score += 1;
      }
      if (score === 0) continue;
      hits.push({
        kind: entry.kind,
        title: entry.title,
        context: entry.context,
        route: entry.route,
        score,
        snippet: snippetAround(entry.excerpt, terms),
      });
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

function snippetAround(source: string, terms: string[], span = 190): string {
  if (!source) return '';
  const lower = source.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const found = lower.indexOf(term);
    if (found !== -1 && (at === -1 || found < at)) at = found;
  }
  if (at === -1) return source.slice(0, span) + (source.length > span ? '…' : '');

  const start = Math.max(0, at - Math.floor(span / 3));
  const end = Math.min(source.length, start + span);
  return (
    (start > 0 ? '…' : '') + source.slice(start, end).trim() + (end < source.length ? '…' : '')
  );
}
