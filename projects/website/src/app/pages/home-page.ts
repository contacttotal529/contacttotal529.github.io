import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import type { Chapter } from '../core/content.models';
import { Seo } from '../core/seo.service';

const CHAPTER_ICONS: Record<string, string> = {
  forward: '📖',
  'federal-tips': '🧭',
  history: '🕰️',
  'state-differences': '🗺️',
  basics: '🗝️',
  taxes: '🧾',
  'fund-selection': '📈',
  'k-12': '🎒',
  'post-secondary': '🏛️',
  'after-graduation': '🚀',
  'estate-planning': '🏡',
  maximizing: '⭐',
  comparisons: '⚖️',
};

const CHAPTER_TINTS: Record<string, string> = {
  basics: 'leaf',
  taxes: 'amber',
  'fund-selection': 'sky',
  'k-12': 'leaf',
  'post-secondary': 'amber',
  'after-graduation': 'sky',
  'estate-planning': 'plum',
  maximizing: 'amber',
  comparisons: 'sky',
};

/**
 * Card order on the front page, set by the author rather than by book order: the three rows a
 * newcomer needs first, then the remaining chapters, then the two summary chapters. `states` is
 * the state-lookup card, not a chapter, and sits deliberately in the middle of the second row.
 * The foreword is absent on purpose — it is still reachable from /guide.
 */
const PILLAR_ORDER = [
  'basics',
  'comparisons',
  'state-differences',
  'taxes',
  'states',
  'fund-selection',
  'k-12',
  'post-secondary',
  'after-graduation',
  'estate-planning',
  'maximizing',
  'history',
  'federal-tips',
];

interface Pillar {
  id: string;
  chapter: Chapter | null;
}

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  constructor() {
    inject(Seo).set({
      title: 'Total529 — Understanding, Using, and Maximizing 529 Accounts',
      description:
        'A 529 is not just for college. Every federal rule in plain language, how your state changes it, and what it looks like for a real family.',
    });
  }

  private readonly content = inject(ContentService);

  readonly book = this.content.book;
  readonly site = this.content.site;
  readonly chapters = this.content.chapters;
  readonly states = this.content.states;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;
  readonly totalPlans = this.content.totalPlans;

  readonly headlineFigures = computed(() => this.site()?.figures.headline ?? []);
  readonly quickAnswers = computed(() => (this.site()?.quickAnswers ?? []).slice(0, 9));

  readonly pillars = computed<Pillar[]>(() => {
    const byId = new Map(this.chapters().map((chapter) => [chapter.id, chapter]));
    return PILLAR_ORDER.flatMap((id): Pillar[] => {
      if (id === 'states') return [{ id, chapter: null }];
      const chapter = byId.get(id);
      return chapter ? [{ id, chapter }] : [];
    });
  });

  /** Where each kind of visitor most usefully starts. */
  readonly startingPoints = [
    { icon: '👶', label: 'My young child', route: ['/guide', 'basics'] },
    { icon: '🎓', label: 'A student near or in college', route: ['/guide', 'post-secondary'] },
    { icon: '🧑‍🎓', label: 'A mid-age college graduate', route: ['/guide', 'after-graduation'] },
    { icon: '👵', label: 'My grandchildren', route: ['/guide', 'estate-planning', 'superfunding'] },
    { icon: '🏡', label: 'Estate planning', route: ['/guide', 'estate-planning'] },
  ];

  readonly myths = [
    {
      myth: "It's only for college.",
      truth:
        'It is a K–12 account, a trade-school account, a credentialing account, and an estate-planning account too. Up to $20,000 a year can go toward K–12 tuition, curriculum, and tutoring.',
      route: ['/guide', 'k-12'],
    },
    {
      myth: 'I lose the money if they skip college.',
      truth:
        'The money never left you. You are the owner until you decide otherwise — and you can change the beneficiary to a sibling, a cousin, or yourself, free, at any time.',
      route: ['/guide', 'basics', 'change-beneficiary'],
    },
    {
      myth: 'Leftover money is wasted.',
      truth:
        'Up to $35,000 rolls into the beneficiary’s Roth IRA. Another $10,000 can pay down their (or their sibling’s) student loans.',
      route: ['/guide', 'after-graduation', 'roth-rollover'],
    },
  ];

  /** Worked examples worth putting on the front page, picked in tools/curated.json. */
  readonly featured = computed(() => this.content.site()?.highlights.featured ?? []);

  icon(chapterId: string): string {
    return CHAPTER_ICONS[chapterId] ?? '📄';
  }

  tint(chapterId: string): string {
    return CHAPTER_TINTS[chapterId] ?? 'leaf';
  }
}
