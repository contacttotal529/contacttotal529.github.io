import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { FEEDBACK_ADDRESS } from '../layout/site-footer';
import { Seo } from '../core/seo.service';

/**
 * The sink for every link that would carry a reader further into the book than the sample the
 * site publishes. The site is a teaser for the manuscript, so "keep reading" ends here.
 */
@Component({
  selector: 'app-coming-soon-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell shell--narrow stack-lg">
      <p class="eyebrow">The book</p>
      <h1>Total529, the book: Coming Soon</h1>
      <p class="lede">
        <em>{{ book()?.subtitle }}</em> is currently in the publishing process. The rest of this
        rule — and every other rule, worked example and appendix table — arrives with it.
      </p>
      <p class="muted">
        What you can read here is a sample: a page from each chapter, five of the worked examples,
        the state guide and the reference tables.
      </p>
      <div class="cta">
        <a class="btn btn--forest" [href]="feedbackHref">Email {{ feedbackAddress }}</a>
        <a class="btn btn--outline" routerLink="/">Back to the sample</a>
      </div>
    </div>
  `,
  styles: `
    h1 {
      font-size: 42px;
      margin: 12px 0 16px;
    }

    .cta {
      display: flex;
      gap: 14px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    @media (max-width: 900px) {
      h1 {
        font-size: 30px;
      }
    }
  `,
})
export class ComingSoonPage {
  constructor() {
    inject(Seo).set({
      title: 'Coming soon — Total529',
      description:
        'Understanding, Using, and Maximizing 529 Accounts is in the publishing process. This site carries a sample of the book in the meantime.',
    });
  }

  readonly book = inject(ContentService).book;

  readonly feedbackAddress = FEEDBACK_ADDRESS;
  readonly feedbackHref = `mailto:${FEEDBACK_ADDRESS}?subject=${encodeURIComponent('Total529 — the book')}`;
}
