import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

import book from '../../generated/book.json';
import states from '../../generated/states.json';
import costs from '../../generated/costs.json';
import site from '../../generated/site.json';
import searchIndex from '../../generated/search-index.json';

/**
 * Runs against the real output of tools/build-content.mjs rather than a hand-written fixture,
 * so a drift in the manuscript parser fails here instead of rendering blanks in production.
 */
describe('ContentService', () => {
  let service: ContentService;

  beforeAll(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentService);
    await service.load();
  });

  it('loads the same content the prerender step imports', () => {
    expect(service.book()?.chapters.length).toBe(book.chapters.length);
    expect(service.states().length).toBe(states.states.length);
    expect(service.costs()?.rows.length).toBe(costs.rows.length);
    expect(service.site()?.timeline.length).toBe(site.timeline.length);
  });

  it('gives every rule a summary for its meta description', () => {
    const missing = service
      .chapters()
      .flatMap((c) => c.sections)
      .filter((s) => !s.summary);
    expect(missing).toEqual([]);
  });

  it('loads every chapter with rules and examples', () => {
    expect(service.chapters().length).toBeGreaterThan(10);
    expect(service.totalSections()).toBeGreaterThan(70);
    expect(service.totalExamples()).toBeGreaterThan(70);
  });

  it('loads all 51 jurisdictions with plans', () => {
    expect(service.states().length).toBe(51);
    expect(service.totalPlans()).toBeGreaterThan(80);
    expect(service.state('utah')?.taxBenefit).toBe('credit');
  });

  it('finds a rule by chapter and section id', () => {
    const section = service.section('k-12', 'tutors');
    expect(section?.title).toContain('tutor');
  });

  it('serves a rule no prose until its chapter has been loaded', async () => {
    expect(service.sectionBlocks('k-12', 'tutors')).toEqual([]);

    await service.loadChapter('k-12');

    expect(service.sectionBlocks('k-12', 'tutors').some((b) => b.type === 'example')).toBe(true);
    expect(service.chapterIntro('k-12').length).toBeGreaterThan(0);
  });

  /**
   * The book is published in print, so no single asset the site serves may be the book. The
   * table of contents carries titles and summaries; the prose lives in a file per chapter and
   * the search index in sorted token lists. These are the invariants that keep it that way.
   */
  it('keeps prose out of the table of contents', () => {
    const serialised = JSON.stringify(book);
    expect(serialised).not.toContain('"blocks"');
    expect(serialised).not.toContain('"intro"');
    expect(serialised).not.toContain('"paragraphs"');
  });

  it('keeps the search index unreadable as prose', async () => {
    await service.ensureSearchIndex();
    const entries = (searchIndex as unknown as { entries: { tokens: string[] }[] }).entries;

    expect(entries.length).toBeGreaterThan(100);
    for (const entry of entries) {
      const sorted = [...entry.tokens].sort();
      expect(entry.tokens).toEqual(sorted);
      expect(new Set(entry.tokens).size).toBe(entry.tokens.length);
    }
  });

  it('ranks title matches above body matches when searching', async () => {
    await service.ensureSearchIndex();
    const hits = service.search('tutor');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title.toLowerCase()).toContain('tutor');
  });

  it('still matches words the rule only mentions in passing', async () => {
    await service.ensureSearchIndex();
    const hits = service.search('superfunding');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.snippet.length > 0)).toBe(true);
  });

  it('returns no search hits for an empty query', async () => {
    await service.ensureSearchIndex();
    expect(service.search('   ')).toEqual([]);
  });

  it('suggests related rules from shared key terms', () => {
    const section = service.section('after-graduation', 'roth-rollover')!;
    const related = service.related(section);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.id !== section.id)).toBe(true);
  });

  it('keeps every state cross-referenced to a cost-of-attendance row where one exists', () => {
    const withFlagship = service.states().filter((s) => s.flagship);
    expect(withFlagship.length).toBeGreaterThanOrEqual(50);
  });
});
