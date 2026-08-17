import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import type { Block } from '../core/content.models';

interface FeaturedExample {
  name: string;
  tag: string;
  tone: 'gp' | 'parent' | 'student' | 'business';
  text: string;
  route: string[];
}

/** Worked examples worth putting on the front page, keyed by chapter/section/example index. */
const FEATURED: {
  chapter: string;
  section: string;
  index: number;
  name: string;
  tag: string;
  tone: FeaturedExample['tone'];
}[] = [
  {
    chapter: 'post-secondary',
    section: 'financial-aid',
    index: 0,
    name: 'Vinni',
    tag: 'Student · Financial aid',
    tone: 'student',
  },
  {
    chapter: 'basics',
    section: 'change-beneficiary',
    index: 0,
    name: 'Bob',
    tag: 'Parent · Beneficiary change',
    tone: 'parent',
  },
  {
    chapter: 'basics',
    section: 'change-successor',
    index: 0,
    name: 'Isaac',
    tag: 'Grandparent · Control',
    tone: 'gp',
  },
  {
    chapter: 'basics',
    section: 'employers-and-trusts',
    index: 0,
    name: 'Don',
    tag: 'Employer · Institutional account',
    tone: 'business',
  },
  {
    chapter: 'estate-planning',
    section: 'superfunding',
    index: 0,
    name: 'Robert',
    tag: 'Grandparent · Estate',
    tone: 'gp',
  },
];

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

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly book = this.content.book;
  readonly site = this.content.site;
  readonly chapters = this.content.chapters;
  readonly states = this.content.states;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;
  readonly totalPlans = this.content.totalPlans;

  readonly headlineFigures = computed(() => this.site()?.figures.headline ?? []);
  readonly keyNumbers = computed(() => this.site()?.figures.keyNumbers ?? []);
  readonly awareness = computed(() => this.site()?.figures.awareness ?? []);
  readonly timeline = computed(() => (this.site()?.timeline ?? []).slice(0, 6));
  readonly quickAnswers = computed(() => (this.site()?.quickAnswers ?? []).slice(0, 9));

  /** Where each kind of visitor most usefully starts. */
  readonly startingPoints = [
    { icon: '👶', label: "My child, and they're young", route: ['/guide', 'basics'] },
    { icon: '🎓', label: "A student who's close to college", route: ['/guide', 'post-secondary'] },
    { icon: '👵', label: 'My grandchildren', route: ['/guide', 'estate-planning'] },
    {
      icon: '🙋',
      label: 'Myself — school, loans, or licensing',
      route: ['/guide', 'after-graduation'],
    },
  ];

  /** The Forward's opening bullets carry the whole value proposition. */
  readonly forwardPoints = computed(() => {
    const forward = this.content.chapter('forward');
    const block = forward?.intro.find((b): b is Block => b.type === 'prose');
    return (block?.paragraphs ?? [])
      .filter((p) => p.startsWith('–') || p.startsWith('-'))
      .map((p) => p.replace(/^[–-]\s*/, '').trim());
  });

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
        'Up to $35,000 rolls into the beneficiary’s Roth IRA. Another $10,000 can pay down their student loans — and $10,000 more for a sibling’s.',
      route: ['/guide', 'after-graduation', 'roth-rollover'],
    },
  ];

  readonly featured = computed<FeaturedExample[]>(() =>
    FEATURED.map((pick) => {
      const section = this.content.section(pick.chapter, pick.section);
      const examples = section?.blocks.filter((b) => b.type === 'example') ?? [];
      return {
        name: pick.name,
        tag: pick.tag,
        tone: pick.tone,
        text: examples[pick.index]?.paragraphs?.[0] ?? '',
        route: ['/guide', pick.chapter, pick.section],
      };
    }).filter((e) => e.text),
  );

  icon(chapterId: string): string {
    return CHAPTER_ICONS[chapterId] ?? '📄';
  }

  tint(chapterId: string): string {
    return CHAPTER_TINTS[chapterId] ?? 'leaf';
  }

  goToState(event: Event): void {
    const slug = (event.target as HTMLSelectElement).value;
    if (slug) void this.router.navigate(['/states', slug]);
  }
}
