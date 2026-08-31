import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import type { Chapter } from '../core/content.models';
import { FEEDBACK_ADDRESS } from '../layout/site-footer';
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
 * Card order on the front page, set by the author rather than by book order. `states` is the
 * state-lookup card, not a chapter.
 *
 * Chapters with no page of their own — the foreword, the federal tip summary and the state
 * differences essay — are absent, because there is nowhere for their card to go.
 */
const PILLAR_ORDER = [
  'basics',
  'comparisons',
  'taxes',
  'states',
  'fund-selection',
  'k-12',
  'post-secondary',
  'after-graduation',
  'estate-planning',
  'maximizing',
];

interface Pillar {
  id: string;
  chapter: Chapter | null;
  route: string[];
  label: string;
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
  readonly totalExamples = this.content.totalExamples;
  readonly totalPlans = this.content.totalPlans;

  readonly feedbackAddress = FEEDBACK_ADDRESS;
  readonly feedbackHref = `mailto:${FEEDBACK_ADDRESS}?subject=${encodeURIComponent('Total529 site feedback')}`;

  readonly headlineFigures = computed(() => this.site()?.figures.headline ?? []);
  readonly quickAnswers = computed(() => (this.site()?.quickAnswers ?? []).slice(0, 9));

  /**
   * Each card opens the chapter's first rule rather than a chapter page, so the site answers a
   * question instead of offering the book to be read straight through.
   */
  readonly pillars = computed<Pillar[]>(() => {
    const byId = new Map(this.chapters().map((chapter) => [chapter.id, chapter]));
    return PILLAR_ORDER.flatMap((id): Pillar[] => {
      if (id === 'states')
        return [{ id, chapter: null, route: ['/states'], label: 'Look yours up' }];

      const chapter = byId.get(id);
      const first = chapter?.sections[0];
      if (!chapter || !first) return [];
      return [{ id, chapter, route: ['/guide', chapter.id, first.id], label: 'Start with rule 1' }];
    });
  });

  /** The single rule each kind of visitor most usefully starts on. */
  readonly startingPoints = [
    { icon: '👶', label: 'My young child', route: ['/guide', 'basics', 'you-are-in-control'] },
    {
      icon: '🎓',
      label: 'A student near or in college',
      route: ['/guide', 'post-secondary', 'getting-a-plan'],
    },
    {
      icon: '🧑‍🎓',
      label: 'A mid-age college graduate',
      route: ['/guide', 'after-graduation', 'continuing-education'],
    },
    {
      icon: '👵',
      label: 'My grandchildren',
      route: ['/guide', 'basics', 'unlimited-accounts-owner'],
    },
    {
      icon: '🏡',
      label: 'Estate planning',
      route: ['/guide', 'estate-planning', 'completed-gifts'],
    },
  ];

  readonly myths = [
    {
      myth: "It's only for college.",
      truth:
        'It is a K–12 account, a trade-school account, a credentialing account, a retirement account, and an estate-planning account too. Up to $20,000 a year can go toward K–12 tuition, curriculum, and tutoring.',
      route: ['/guide', 'k-12', 'tuition-books-software'],
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
