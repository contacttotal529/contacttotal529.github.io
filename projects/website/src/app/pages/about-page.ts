import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { FEEDBACK_ADDRESS } from '../layout/site-footer';
import { Seo } from '../core/seo.service';

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
            Total529 publishes <em>{{ book()?.subtitle }}</em> as a website, chapter by chapter.
            Every rule, worked example and appendix has its own page, unedited &mdash; reorganised
            so that a rule you need at 11pm is one search away instead of forty pages in.
          </p>
          <p>
            The book is an attempt to both advertise and clarify the numerous underutilized
            advantages Section 529 plans have for younger children, college students, parents, and
            grandparents or other benevolent relatives and friends. Half of families now save with a
            529 account; as recently as 2025, fifty-two percent of parents said they did not know
            what a 529 plan was. That gap is the reason this exists.
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

          <h2 id="feedback">Corrections and questions</h2>
          <p>
            The figures and state rules here change every year, and a reader who spots one that has
            moved is doing everyone a favour. Write to
            <a [href]="feedbackHref">{{ feedbackAddress }}</a> &mdash; corrections, questions about
            a rule, or a state whose plan has changed. Nothing is collected from you here; there is
            no form and no tracking, just an inbox.
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
            <a class="btn btn--forest" routerLink="/search">Search for a rule</a>
            <a class="btn btn--outline" routerLink="/states">Look up your state</a>
          </div>

          <div class="side__card">
            <p class="eyebrow">The printed book</p>
            <p class="side__note">
              <strong>Coming soon.</strong> {{ book()?.subtitle }} is being published now; this site
              carries the guide in the meantime.
            </p>
          </div>

          <div class="side__card">
            <p class="eyebrow">Feedback</p>
            <p class="side__note">
              Found something out of date? Write to
              <a [href]="feedbackHref">{{ feedbackAddress }}</a
              >.
            </p>
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

    .side__note {
      font-size: 15px;
      line-height: 1.6;
      color: var(--muted);
      margin: 10px 0 0;
    }

    .side__note a {
      word-break: break-word;
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
  constructor() {
    inject(Seo).set({
      title: 'About Total529',
      description:
        'Total529 publishes Understanding, Using, and Maximizing 529 Accounts as a free, independent website. It sells nothing and takes no plan compensation.',
    });
  }

  private readonly content = inject(ContentService);

  readonly book = this.content.book;
  readonly chapters = this.content.chapters;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;
  readonly totalPlans = this.content.totalPlans;
  readonly sources = computed(() => this.content.statesDoc()?.sources ?? []);
  readonly disclaimer = computed(() => this.content.site()?.disclaimer ?? '');

  readonly feedbackAddress = FEEDBACK_ADDRESS;
  readonly feedbackHref = `mailto:${FEEDBACK_ADDRESS}?subject=${encodeURIComponent('Total529 site feedback')}`;
}
