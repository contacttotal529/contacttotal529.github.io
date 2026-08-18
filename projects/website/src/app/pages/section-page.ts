import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';
import { BlockRenderer } from '../shared/block-renderer';

/** Which state list is worth flagging beside a rule. Chapter default, overridden per rule. */
const CHAPTER_WATCH: Record<string, string> = {
  'k-12': 'k12NotAllowed',
  taxes: 'credit',
  'state-differences': 'anyPlanDeduction',
};

const SECTION_WATCH: Record<string, string> = {
  'taxes/which-state-plan': 'anyPlanDeduction',
  'taxes/deduction-or-credit': 'credit',
  'taxes/maximum-balance': 'morningstarGold',
  'post-secondary/financial-aid': '',
  'estate-planning/bankruptcy-protection': '',
};

@Component({
  selector: 'app-section-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BlockRenderer],
  templateUrl: './section-page.html',
  styleUrl: './section-page.scss',
})
export class SectionPage {
  private readonly content = inject(ContentService);
  private readonly seo = inject(Seo);

  readonly chapterId = input<string>('');
  readonly sectionId = input<string>('');

  readonly chapter = computed(() => this.content.chapter(this.chapterId()));

  readonly section = computed(() => this.content.section(this.chapterId(), this.sectionId()));

  readonly blocks = computed(() => this.content.sectionBlocks(this.chapterId(), this.sectionId()));

  constructor() {
    effect(() => {
      const found = this.section();
      this.seo.set({
        title: found ? `${found.title} — Total529` : 'Not found — Total529',
        description: found?.summary ?? null,
      });
    });
  }

  readonly ruleNumber = computed(() => {
    const chapter = this.chapter();
    const index = this.content.chapters().findIndex((c) => c.id === this.chapterId());
    const position = chapter?.sections.findIndex((s) => s.id === this.sectionId()) ?? -1;
    return index >= 0 && position >= 0 ? `${index + 1}.${position + 1}` : '';
  });

  readonly neighbours = computed(() => this.content.neighbours(this.chapterId(), this.sectionId()));

  readonly related = computed(() => {
    const section = this.section();
    return section ? this.content.related(section) : [];
  });

  /** Dollar and percentage figures the rule itself mentions — no derived numbers. */
  readonly figures = computed(() => this.section()?.figures ?? []);

  readonly watch = computed(() => {
    const key = `${this.chapterId()}/${this.sectionId()}`;
    const groupKey = key in SECTION_WATCH ? SECTION_WATCH[key] : CHAPTER_WATCH[this.chapterId()];
    if (!groupKey) return null;

    const group = this.content.statesDoc()?.groups[groupKey];
    if (!group) return null;

    const states = this.content.states();
    return {
      ...group,
      entries: group.states.map((name) => ({
        name,
        slug: states.find((s) => s.name === name)?.slug ?? null,
      })),
      tone: groupKey === 'k12NotAllowed' || groupKey === 'noDeduction' ? 'no' : 'yes',
    };
  });

  readonly disclaimer = computed(() => this.content.site()?.disclaimer ?? '');
}
