import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-history-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">1996 &rarr; 2026</p>
        <h1>Thirty years of getting better.</h1>
        <p class="lede">
          The 529 began not in Washington but in state capitals, where legislators and treasurers
          were trying to solve a real problem with the tools they had. Congress has spent three
          decades expanding, refining, and strengthening the framework since.
        </p>
      </header>
    </div>

    <section class="shell stack-lg">
      <ol class="timeline">
        @for (entry of timeline(); track entry.year) {
          <li>
            <span class="timeline__year">{{ entry.year }}</span>
            <h2>{{ entry.title }}</h2>
            <p>{{ entry.body }}</p>
          </li>
        }
      </ol>
    </section>
  `,
})
export class HistoryPage {
  constructor() {
    inject(Seo).set({
      title: 'Thirty years of 529 plans — Total529',
      description:
        'How a state-capital experiment became federal law in 1996, and the eight expansions since — from tax-free withdrawals to tutors and Roth rollovers.',
    });
  }

  private readonly content = inject(ContentService);
  readonly timeline = computed(() => this.content.site()?.timeline ?? []);
}
