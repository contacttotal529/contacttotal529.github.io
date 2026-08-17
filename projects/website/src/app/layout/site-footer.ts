import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';

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
              <span class="leaf" aria-hidden="true">529</span>
              Total529
            </a>
            <p>
              A free educational resource built from <em>{{ book()?.subtitle }}</em
              >, {{ book()?.edition }}, by {{ book()?.author }}.
            </p>
            <a class="link-more" routerLink="/read">Read the full book &rarr;</a>
          </div>

          <div>
            <h2>The guide</h2>
            @for (chapter of chapters().slice(0, 7); track chapter.id) {
              <a [routerLink]="['/guide', chapter.id]">{{ chapter.title }}</a>
            }
          </div>

          <div>
            <h2>More chapters</h2>
            @for (chapter of chapters().slice(7); track chapter.id) {
              <a [routerLink]="['/guide', chapter.id]">{{ chapter.title }}</a>
            }
          </div>

          <div>
            <h2>Reference</h2>
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
      background: var(--forest-deep);
      color: #a9c6b5;
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
      color: #a9c6b5;
      text-decoration: none;
      padding: 5px 0;
      font-size: 14.5px;
      line-height: 1.4;
    }

    a:hover {
      color: var(--amber-lt);
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

    .leaf {
      width: 38px;
      height: 38px;
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.1);
      color: var(--amber-lt);
      display: grid;
      place-items: center;
      font-size: 13.5px;
      font-weight: 800;
    }

    .brand p {
      color: #86a894;
      line-height: 1.6;
      max-width: 40ch;
      margin-bottom: 12px;
    }

    .brand .link-more {
      display: inline-block;
      color: var(--amber-lt);
    }

    .disclaimer {
      font-size: 13px;
      line-height: 1.7;
      color: #7a9c88;
      margin: 26px 0 0;
      max-width: 104ch;
    }

    .colophon {
      font-size: 12.5px;
      color: #5f8271;
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
}
