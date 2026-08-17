import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">About</p>
        <h1>{{ book()?.subtitle }}</h1>
        <p class="lede">{{ book()?.edition }} &middot; {{ book()?.author }}</p>
      </header>
    </div>

    <section class="shell stack-lg intro">
      <div class="intro__grid">
        <div>
          <h2>What this site is</h2>
          <p>
            Total529 is the full text of <em>{{ book()?.subtitle }}</em> published as a website.
            Every chapter, rule, example, and appendix in the book is here, unedited &mdash;
            reorganised so that a rule you need at 11pm is one search away instead of forty pages
            in.
          </p>
          <p>
            The book is an attempt to both advertise and clarify the numerous underutilized
            advantages Section 529 plans have for younger children, college students, parents, and
            grandparents or other benevolent relatives and friends. Thirty-five percent of families
            use a college savings fund; fifty-four percent of parents say they don't know enough
            about 529 plans to enroll. That gap is the reason this exists.
          </p>

          <h2>How it's put together</h2>
          <p>
            The manuscript is the single source of truth. The site's chapters, rules, worked
            examples and appendix tables are generated directly from it, so the text you read here
            is the text the author wrote. Where the site adds structure &mdash; the state tables,
            the qualified-expense list, the timeline &mdash; every value traces back to a statement
            in the book.
          </p>
          <p>
            Where the book is silent about a state, the site says so rather than guessing. A blank
            field means "not stated in this edition", never "zero".
          </p>

          <h2 id="sources">Sources</h2>
          <p>
            Each rule carries its own citations at the point they appear in the manuscript. The
            state guide draws additionally on:
          </p>
          <ul class="sources">
            @for (source of sources(); track source.url) {
              <li>
                <a [href]="source.url" target="_blank" rel="noopener noreferrer">{{
                  source.label
                }}</a>
              </li>
            }
          </ul>
        </div>

        <aside class="side">
          <div class="side__card">
            <p class="eyebrow">The book in numbers</p>
            <dl>
              <div>
                <dt>Chapters</dt>
                <dd>{{ chapters().length }}</dd>
              </div>
              <div>
                <dt>Rules</dt>
                <dd>{{ totalSections() }}</dd>
              </div>
              <div>
                <dt>Worked examples</dt>
                <dd>{{ totalExamples() }}</dd>
              </div>
              <div>
                <dt>State plans</dt>
                <dd>{{ totalPlans() }}</dd>
              </div>
              <div>
                <dt>Tax year</dt>
                <dd>{{ book()?.taxYear }}</dd>
              </div>
            </dl>
          </div>

          <div class="side__card side__card--amber">
            <p class="eyebrow">Start reading</p>
            <a class="btn btn--forest" routerLink="/read">The full book</a>
            <a class="btn btn--outline" routerLink="/guide">Chapter by chapter</a>
          </div>
        </aside>
      </div>
    </section>

    <section class="legal">
      <div class="shell shell--narrow">
        <h2>Disclaimer</h2>
        <p>{{ disclaimer() }}</p>
        <p>
          Total529 is an independent educational resource. It sells nothing, collects nothing, and
          receives no compensation from any state plan, program manager, or financial advisor.
          Nothing here is personalised advice.
        </p>
      </div>
    </section>
  `,
  styles: `
    .intro__grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 56px;
      align-items: start;
    }

    .intro h2 {
      font-size: 26px;
      margin: 34px 0 12px;
    }

    .intro h2:first-child {
      margin-top: 0;
    }

    .intro p {
      font-size: 18px;
      line-height: 1.75;
      color: var(--text);
      max-width: 68ch;
    }

    .sources {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sources li {
      padding: 9px 0;
      border-bottom: 1px solid var(--line-soft);
    }

    .sources a {
      color: var(--moss);
      font-weight: 700;
      text-decoration: none;
      font-size: 16px;
    }

    .sources a:hover {
      text-decoration: underline;
    }

    .side {
      position: sticky;
      top: 100px;
    }

    .side__card {
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 24px 26px;
      margin-bottom: 16px;
    }

    .side__card--amber {
      background: var(--amber-pale);
      border-color: #e8cb9c;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }

    .side__card dl {
      margin: 14px 0 0;
    }

    .side__card dl > div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid var(--line-soft);
    }

    .side__card dl > div:last-child {
      border-bottom: 0;
    }

    .side__card dt {
      font-size: 15px;
      color: var(--muted);
    }

    .side__card dd {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
    }

    .legal {
      background: var(--sand-2);
      padding: 56px 0 64px;
    }

    .legal h2 {
      font-size: 24px;
      margin-bottom: 14px;
    }

    .legal p {
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--muted);
    }

    @media (max-width: 980px) {
      .intro__grid {
        grid-template-columns: 1fr;
        gap: 34px;
      }

      .side {
        position: static;
      }
    }
  `,
})
export class AboutPage {
  private readonly content = inject(ContentService);

  readonly book = this.content.book;
  readonly chapters = this.content.chapters;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;
  readonly totalPlans = this.content.totalPlans;
  readonly sources = computed(() => this.content.statesDoc()?.sources ?? []);
  readonly disclaimer = computed(() => this.content.site()?.disclaimer ?? '');
}
