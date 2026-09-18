import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';

export const FEEDBACK_ADDRESS = 'contact.Total529@gmail.com';

/**
 * The canonical product address. Amazon's own share sheet hands out a search-referral URL
 * carrying `ref`, `crid` and `dib` parameters from whoever copied it; `/dp/<ASIN>` is the part
 * that is actually the book.
 */
export const BOOK_AMAZON_URL = 'https://www.amazon.com/dp/B0HK6MPP3K';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer>
      <div class="shell">
        <div class="grid">
          <div class="brand">
            <a class="logo" routerLink="/">
              <svg class="mark" viewBox="50 50 200 200" aria-hidden="true" focusable="false">
                <circle class="mark__disc" cx="150" cy="150" r="90" />
                <path class="mark__sweep" d="M 214.74 87.48 A 90 90 0 1 1 195 72.06" />
                <polygon class="mark__tip" points="210.59,81.06 179.11,75.58 190.11,56.53" />
                <text
                  class="mark__num"
                  x="150"
                  y="150"
                  text-anchor="middle"
                  dominant-baseline="central"
                >
                  529
                </text>
              </svg>
              Total529
            </a>
            <p>
              A free educational resource built from <em>{{ book()?.subtitle }}</em
              >, {{ book()?.edition }}, by {{ book()?.author }}. The book itself is
              <strong>out now</strong> on Amazon.
            </p>
            <a class="link-more" routerLink="/the-book">Get the book &rarr;</a>
          </div>

          <div>
            <h2>Start a topic</h2>
            @for (entry of entryPoints().slice(0, 5); track entry.id) {
              <a [routerLink]="entry.route">{{ entry.title }}</a>
            }
          </div>

          <div>
            <h2>More topics</h2>
            @for (entry of entryPoints().slice(5); track entry.id) {
              <a [routerLink]="entry.route">{{ entry.title }}</a>
            }
          </div>

          <div>
            <h2>Reference</h2>
            <a routerLink="/examples">Real situations</a>
            <a routerLink="/states">All 51 state plans</a>
            <a routerLink="/costs">Cost of attendance</a>
            <a routerLink="/reference">Who counts as family?</a>
            <a routerLink="/search">Search</a>
          </div>

          <div>
            <h2>About</h2>
            <a routerLink="/about">The author &amp; the book</a>
            <a routerLink="/history">Thirty years of 529</a>
            <a routerLink="/about" fragment="sources">Sources</a>
            <a [href]="feedbackHref">Send feedback</a>
          </div>
        </div>

        <p class="disclaimer">{{ disclaimer() }}</p>
        <p class="colophon">
          Figures reviewed for the {{ book()?.taxYear }} tax year. Total529 sells nothing and
          receives no compensation from any state plan, program manager, or advisor.
        </p>
      </div>
    </footer>
  `,
  styles: `
    footer {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
      color: var(--on-dark);
      padding: 62px 0 42px;
      font-size: 15px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      margin-top: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.6fr repeat(4, 1fr);
      gap: 32px;
      padding-bottom: 34px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.13);
    }

    h2 {
      font-size: 11.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #fff;
      margin: 0 0 14px;
      font-weight: 800;
    }

    a {
      display: block;
      color: var(--on-dark);
      text-decoration: none;
      padding: 5px 0;
      font-size: 14.5px;
      line-height: 1.4;
    }

    a:hover {
      color: var(--gold-lt);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 11px;
      font-weight: 800;
      font-size: 21px;
      letter-spacing: -0.03em;
      color: #fff;
      padding: 0;
      margin-bottom: 14px;
    }

    .mark {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
    }

    .mark__disc {
      fill: var(--gold);
    }

    .mark__sweep {
      fill: none;
      stroke: var(--navy-deep);
      stroke-width: 14;
      stroke-linecap: round;
    }

    .mark__tip {
      fill: var(--navy-deep);
    }

    .mark__num {
      fill: var(--navy-deep);
      font-family: var(--sans);
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -2px;
    }

    .brand p {
      color: var(--on-dark-faint);
      line-height: 1.6;
      max-width: 40ch;
      margin-bottom: 12px;
    }

    .brand .link-more {
      display: inline-block;
      color: var(--gold-lt);
    }

    .disclaimer {
      font-size: 13px;
      line-height: 1.7;
      color: var(--on-dark-faint);
      margin: 26px 0 0;
      max-width: 104ch;
    }

    .colophon {
      font-size: 12.5px;
      color: var(--on-dark-faint);
      margin: 10px 0 0;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
})
export class SiteFooter {
  private readonly content = inject(ContentService);
  readonly book = this.content.book;
  readonly chapters = this.content.chapters;
  readonly disclaimer = () => this.content.site()?.disclaimer ?? '';

  /**
   * Chapters open at their first rule. There is no chapter page to link to, and listing every
   * rule here would rebuild the table of contents the site deliberately does without.
   */
  readonly entryPoints = computed(() =>
    this.chapters()
      .filter((chapter) => chapter.sections.length > 0)
      .map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        route: ['/guide', chapter.id, chapter.sections[0].id],
      })),
  );

  /** The site is static, so corrections and questions arrive by mail rather than through a form. */
  readonly feedbackHref = `mailto:${FEEDBACK_ADDRESS}?subject=${encodeURIComponent('Total529 site feedback')}`;
}
