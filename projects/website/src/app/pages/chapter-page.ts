import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';
import { BlockRenderer } from '../shared/block-renderer';

@Component({
  selector: 'app-chapter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BlockRenderer],
  template: `
    @if (chapter(); as ch) {
      <div class="shell">
        <header class="page-banner">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a routerLink="/guide">The guide</a>
            <span aria-hidden="true">/</span>
            <span>{{ ch.title }}</span>
          </nav>
          <h1>{{ ch.title }}</h1>
          @if (ch.subtitle) {
            <p class="page-banner__sub">{{ ch.subtitle }}</p>
          }
          <p class="page-banner__meta">
            @if (ch.sectionCount) {
              {{ ch.sectionCount }} rules
            } @else {
              Essay chapter
            }
            @if (ch.exampleCount) {
              &middot; {{ ch.exampleCount }} worked examples
            }
          </p>
        </header>
      </div>

      <div class="shell layout">
        <article class="body">
          @if (ch.intro.length) {
            <app-blocks [blocks]="ch.intro" />
          }

          @if (ch.sections.length) {
            <h2 class="rules-heading">The rules in this chapter</h2>
            <ol class="rules">
              @for (section of ch.sections; track section.id; let i = $index) {
                <li>
                  <a [routerLink]="['/guide', ch.id, section.id]">
                    <span class="rules__num">{{ i + 1 }}</span>
                    <span>
                      <strong>{{ section.title }}</strong>
                      @if (section.summary) {
                        <span class="rules__summary">{{ section.summary }}</span>
                      }
                    </span>
                  </a>
                </li>
              }
            </ol>
          }
        </article>

        <aside class="rail">
          <div class="rail__block">
            <h2>Chapters</h2>
            @for (other of chapters(); track other.id) {
              <a
                class="rail__link"
                [routerLink]="['/guide', other.id]"
                [class.on]="other.id === ch.id"
                >{{ other.title }}</a
              >
            }
          </div>
          <div class="rail__box">
            <p class="eyebrow">Reading the book</p>
            <p>
              Every chapter here is the author's text, unedited. The guide lists all of them, with
              each rule broken out onto its own page.
            </p>
            <a class="link-more" routerLink="/guide">Every chapter and rule &rarr;</a>
          </div>
        </aside>
      </div>
    } @else {
      <div class="shell stack-lg">
        <h1>Chapter not found</h1>
        <p><a class="link-more" routerLink="/guide">Back to the guide &rarr;</a></p>
      </div>
    }
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: 1fr 262px;
      gap: 52px;
      align-items: start;
      padding-top: 46px;
      padding-bottom: 70px;
    }

    .body {
      max-width: 72ch;
    }

    .rules-heading {
      font-size: 26px;
      margin: 44px 0 8px;
      padding-top: 26px;
      border-top: 1px solid var(--line);
    }

    .rules {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .rules a {
      display: flex;
      gap: 16px;
      text-decoration: none;
      color: var(--text);
      padding: 16px 18px;
      border-radius: var(--radius-sm);
      align-items: baseline;
    }

    .rules a:hover {
      background: var(--cream);
    }

    .rules a:hover strong {
      color: var(--moss);
    }

    .rules__num {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--faint);
      flex: 0 0 24px;
    }

    .rules strong {
      display: block;
      font-size: 18.5px;
      font-weight: 700;
      line-height: 1.4;
    }

    .rules__summary {
      display: block;
      font-size: 15px;
      color: var(--muted);
      margin-top: 6px;
      line-height: 1.55;
    }

    .rail__box {
      margin-top: 26px;
    }

    @media (max-width: 980px) {
      .layout {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .rail {
        position: static;
      }
    }
  `,
})
export class ChapterPage {
  private readonly content = inject(ContentService);
  private readonly seo = inject(Seo);

  readonly chapterId = input<string>('');
  readonly chapters = this.content.chapters;

  readonly chapter = computed(() => this.content.chapter(this.chapterId()));

  constructor() {
    effect(() => {
      const found = this.chapter();
      this.seo.set({
        title: found ? `${found.title} — Total529` : 'Not found — Total529',
        description: found?.summary ?? null,
      });
    });
  }
}
