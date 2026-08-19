import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';
import { BlockRenderer } from '../shared/block-renderer';

@Component({
  selector: 'app-history-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BlockRenderer],
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

    @if (chapter(); as ch) {
      <section class="essay">
        <div class="shell shell--narrow">
          <p class="eyebrow">The full chapter</p>
          <h2 class="essay__title">A brief history of 529 plans</h2>
          <app-blocks [blocks]="intro()" />
          <p class="essay__more">
            <a class="link-more" routerLink="/examples">See the worked examples &rarr;</a>
          </p>
        </div>
      </section>
    }
  `,
  styles: `
    .essay {
      background: var(--sand-2);
      padding: 66px 0 74px;
    }

    .essay__title {
      font-size: 34px;
      margin: 13px 0 24px;
    }

    .essay__more {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--line);
    }

    @media (max-width: 900px) {
      .essay__title {
        font-size: 26px;
      }
    }
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
  readonly chapter = computed(() => this.content.chapter('history'));
  readonly intro = computed(() => this.content.chapterIntro('history'));
}
