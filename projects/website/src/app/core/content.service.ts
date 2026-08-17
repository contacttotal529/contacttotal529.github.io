import { Injectable, computed, signal } from '@angular/core';
import type {
  Book,
  Chapter,
  CostsDoc,
  SearchHit,
  Section,
  SiteDoc,
  StateEntry,
  StatesDoc,
} from './content.models';

// The manuscript is imported rather than fetched: prerendering runs this app in Node, where
// there is no origin to fetch from. Dynamic imports keep it out of the initial bundle, so the
// browser still pays for it only once, as a lazy chunk.
const load = {
  book: () => import('../../generated/book.json').then((m) => m.default as unknown as Book),
  states: () =>
    import('../../generated/states.json').then((m) => m.default as unknown as StatesDoc),
  costs: () => import('../../generated/costs.json').then((m) => m.default as unknown as CostsDoc),
  site: () => import('../../generated/site.json').then((m) => m.default as unknown as SiteDoc),
};

interface IndexEntry {
  hit: Omit<SearchHit, 'score' | 'snippet'>;
  haystack: string;
  source: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly bookSignal = signal<Book | null>(null);
  private readonly statesSignal = signal<StatesDoc | null>(null);
  private readonly costsSignal = signal<CostsDoc | null>(null);
  private readonly siteSignal = signal<SiteDoc | null>(null);
  private index: IndexEntry[] = [];

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
    this.buildIndex(book, states);
  }

  chapter(id: string): Chapter | undefined {
    return this.chapters().find((c) => c.id === id);
  }

  section(chapterId: string, sectionId: string): Section | undefined {
    return this.chapter(chapterId)?.sections.find((s) => s.id === sectionId);
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

  /**
   * Sections that mention any of the given terms, excluding the one being read. Used to
   * suggest related rules without hand-maintaining a cross-reference table.
   */
  related(section: Section, limit = 5): Section[] {
    const terms = keyTerms(section.title);
    if (!terms.length) return [];

    return this.chapters()
      .flatMap((c) => c.sections)
      .filter((s) => !(s.chapterId === section.chapterId && s.id === section.id))
      .map((s) => {
        const haystack = `${s.title} ${s.text}`.toLowerCase();
        const score =
          terms.reduce((n, term) => n + (haystack.includes(term) ? 1 : 0), 0) +
          (s.chapterId === section.chapterId ? 0.5 : 0);
        return { s, score };
      })
      .filter((r) => r.score >= 1.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.s);
  }

  search(query: string, limit = 40): SearchHit[] {
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
        const inTitle = entry.hit.title.toLowerCase().includes(term);
        const inBody = entry.haystack.includes(term);
        if (inTitle) score += 6;
        if (inBody) score += 1;
      }
      if (score === 0) continue;
      hits.push({ ...entry.hit, score, snippet: snippetAround(entry.source, terms) });
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private buildIndex(book: Book, states: StatesDoc): void {
    const entries: IndexEntry[] = [];

    for (const chapter of book.chapters) {
      entries.push({
        hit: {
          kind: 'chapter',
          title: chapter.title,
          context: 'Chapter',
          route: ['/guide', chapter.id],
        },
        haystack: `${chapter.title} ${chapter.text}`.toLowerCase(),
        source: chapter.text || chapter.title,
      });

      for (const section of chapter.sections) {
        entries.push({
          hit: {
            kind: 'section',
            title: section.title,
            context: chapter.title,
            route: ['/guide', chapter.id, section.id],
          },
          haystack: `${section.title} ${section.text}`.toLowerCase(),
          source: section.text || section.title,
        });
      }
    }

    for (const state of states.states) {
      const source = [
        state.taxBenefitDetail,
        state.protection,
        ...state.notes,
        ...state.plans.map((p) => `${p.name} (${p.type})`),
      ]
        .filter(Boolean)
        .join(' ');

      entries.push({
        hit: {
          kind: 'state',
          title: state.name,
          context: 'State plan guide',
          route: ['/states', state.slug],
        },
        haystack: `${state.name} ${source}`.toLowerCase(),
        source,
      });
    }

    this.index = entries;
  }
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'you',
  'your',
  'may',
  'can',
  'are',
  'with',
  'from',
  'that',
  'this',
  'any',
  'all',
  'account',
  'accounts',
  '529',
  'plan',
  'plans',
  'without',
  'through',
  'into',
  'their',
  'they',
  'have',
  'has',
  'not',
  'but',
  'per',
  'own',
  'one',
  'out',
  'who',
  'what',
  'when',
  'how',
  'much',
  'more',
  'other',
  'each',
  'some',
  'time',
  'made',
  'make',
  'over',
  'used',
  'using',
  'use',
  'should',
  'consider',
  'decide',
  'change',
  'well',
  'else',
  'someone',
]);

function keyTerms(title: string): string[] {
  return [
    ...new Set(
      title
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 3 && !STOP_WORDS.has(w)),
    ),
  ];
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
