import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-guide-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">Table of contents</p>
        <h1>The guide</h1>
        <p class="page-banner__lede">
          {{ book()?.subtitle }} &mdash; {{ chapters().length }} chapters,
          {{ totalSections() }} rules and {{ totalExamples() }} worked examples. Each rule stands on
          its own page; each chapter reads straight through.
        </p>
        <div class="page-banner__cta">
          <a class="btn btn--amber" routerLink="/guide/basics">Start with the basics</a>
          <a class="btn btn--white" routerLink="/states">Look up your state</a>
        </div>
      </header>
    </div>

    <div class="shell stack-lg">
      @for (chapter of chapters(); track chapter.id; let i = $index) {
        <section class="chapter">
          <div class="chapter__head">
            <p class="eyebrow">Chapter {{ i + 1 }}</p>
            <h2>
              <a [routerLink]="['/guide', chapter.id]">{{ chapter.title }}</a>
            </h2>
            @if (chapter.summary) {
              <p class="chapter__summary">{{ chapter.summary }}</p>
            }
            <p class="chapter__meta">
              @if (chapter.sectionCount) {
                {{ chapter.sectionCount }} rules
              } @else {
                Essay chapter
              }
              @if (chapter.exampleCount) {
                &middot; {{ chapter.exampleCount }} examples
              }
            </p>
          </div>

          @if (chapter.sections.length) {
            <ol class="rules">
              @for (section of chapter.sections; track section.id; let j = $index) {
                <li>
                  <a [routerLink]="['/guide', chapter.id, section.id]">
                    <span class="rules__num">{{ i + 1 }}.{{ j + 1 }}</span>
                    <span class="rules__title">{{ section.title }}</span>
                  </a>
                </li>
              }
            </ol>
          } @else {
            <p class="chapter__essay">
              <a class="link-more" [routerLink]="['/guide', chapter.id]">Read the chapter &rarr;</a>
            </p>
          }
        </section>
      }

      <section class="chapter">
        <div class="chapter__head">
          <p class="eyebrow">Appendices</p>
          <h2>Reference tables</h2>
          <p class="chapter__summary">
            The manuscript's three appendices, rebuilt as searchable, sortable data.
          </p>
        </div>
        <ol class="rules">
          <li>
            <a routerLink="/states"
              ><span class="rules__num">A1</span
              ><span class="rules__title">Every state's official 529 program description</span></a
            >
          </li>
          <li>
            <a routerLink="/costs"
              ><span class="rules__num">A2</span
              ><span class="rules__title">Each state's flagship college cost of attendance</span></a
            >
          </li>
          <li>
            <a routerLink="/reference"
              ><span class="rules__num">A3</span
              ><span class="rules__title">Who counts as a "member of my family"?</span></a
            >
          </li>
        </ol>
      </section>
    </div>
  `,
  styles: `
    .chapter {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 44px;
      padding: 34px 0;
      border-top: 1px solid var(--line);
      align-items: start;
    }

    .chapter:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .chapter__head h2 {
      font-size: 28px;
      margin: 9px 0 11px;
    }

    .chapter__head h2 a {
      text-decoration: none;
    }

    .chapter__head h2 a:hover {
      color: var(--moss);
    }

    .chapter__summary {
      font-size: 15.5px;
      color: var(--muted);
      line-height: 1.6;
      margin: 0 0 11px;
    }

    .chapter__meta {
      font-size: 12.5px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 700;
      margin: 0;
    }

    .rules {
      list-style: none;
      margin: 0;
      padding: 0;
      columns: 2;
      column-gap: 36px;
    }

    .rules li {
      break-inside: avoid;
    }

    .rules a {
      display: flex;
      gap: 14px;
      text-decoration: none;
      color: var(--text);
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      align-items: baseline;
    }

    .rules a:hover {
      background: var(--cream);
      color: var(--moss);
    }

    .rules__num {
      font-size: 13px;
      font-weight: 700;
      color: var(--faint);
      flex: 0 0 34px;
    }

    .rules__title {
      font-size: 16px;
      line-height: 1.45;
    }

    .chapter__essay {
      margin: 0;
    }

    @media (max-width: 980px) {
      .chapter {
        grid-template-columns: 1fr;
        gap: 18px;
      }

      .rules {
        columns: 1;
      }
    }
  `,
})
export class GuidePage {
  constructor() {
    inject(Seo).set({
      title: 'The guide — Total529',
      description:
        'All 13 chapters and 76 rules of Understanding, Using, and Maximizing 529 Accounts, each with its state exceptions and worked examples.',
    });
  }

  private readonly content = inject(ContentService);
  readonly book = this.content.book;
  readonly chapters = this.content.chapters;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;
}
