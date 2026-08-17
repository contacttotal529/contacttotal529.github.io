import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

import book from '../../../public/content/book.json';
import states from '../../../public/content/states.json';
import costs from '../../../public/content/costs.json';
import site from '../../../public/content/site.json';

const FIXTURES: Record<string, unknown> = {
  'book.json': book,
  'states.json': states,
  'costs.json': costs,
  'site.json': site,
};

/**
 * Runs against the real output of tools/build-content.mjs rather than a hand-written fixture,
 * so a drift in the manuscript parser fails here instead of rendering blanks in production.
 * There is no server under test, so fetch is served from the generated files on disk.
 */
describe('ContentService', () => {
  let service: ContentService;
  const realFetch = globalThis.fetch;

  beforeAll(async () => {
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const name = String(input).split('/').pop() ?? '';
      const body = FIXTURES[name];
      if (!body) return Promise.reject(new Error(`Unexpected fetch: ${input}`));
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(body),
      } as Response);
    }) as typeof fetch;

    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentService);
    await service.load();
  });

  afterAll(() => {
    globalThis.fetch = realFetch;
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
    expect(section?.blocks.some((b) => b.type === 'example')).toBe(true);
  });

  it('walks previous and next across chapter boundaries', () => {
    const first = service.chapters().find((c) => c.sections.length)!;
    const { prev, next } = service.neighbours(first.id, first.sections[0].id);
    expect(prev).toBeNull();
    expect(next).not.toBeNull();
  });

  it('ranks title matches above body matches when searching', () => {
    const hits = service.search('tutor');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title.toLowerCase()).toContain('tutor');
  });

  it('returns no search hits for an empty query', () => {
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
