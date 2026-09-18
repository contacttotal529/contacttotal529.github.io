import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { BOOK_AMAZON_URL, FEEDBACK_ADDRESS } from '../layout/site-footer';
import { Seo } from '../core/seo.service';

/**
 * The sink for every link that would carry a reader further into the book than the sample the
 * site publishes. The site is a teaser for the manuscript, so "keep reading" ends here — and
 * now that the book is out, ends with somewhere to buy it.
 */
@Component({
  selector: 'app-the-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell shell--narrow stack-lg">
      <p class="eyebrow">The book</p>
      <h1>The rest of it is in the book.</h1>
      <p class="lede">
        <em>{{ book()?.subtitle }}</em> &mdash; {{ book()?.edition }}, by {{ book()?.author }}
        &mdash; is published and on sale now. The rest of this rule, and every other rule, worked
        example and appendix table, is in it.
      </p>
      <p class="muted">
        What you can read here is a sample: a page from each chapter, five of the worked examples,
        the state guide and the reference tables.
      </p>
      <div class="cta">
        <a class="btn btn--gold" [href]="amazonUrl" target="_blank" rel="noopener noreferrer"
          >Buy it on Amazon &#8599;</a
        >
        <a class="btn btn--outline" routerLink="/">Back to the sample</a>
      </div>
      <p class="muted">
        Questions, or a figure that has moved? Write to
        <a class="link-more" [href]="feedbackHref">{{ feedbackAddress }}</a
        >.
      </p>
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
export class TheBookPage {
  constructor() {
    inject(Seo).set({
      title: 'Get the book — Total529',
      description:
        'Understanding, Using, and Maximizing 529 Accounts is published and on sale on Amazon. This site carries a sample of it: one page per chapter, the state guide and the reference tables.',
    });
  }

  readonly book = inject(ContentService).book;

  readonly amazonUrl = BOOK_AMAZON_URL;
  readonly feedbackAddress = FEEDBACK_ADDRESS;
  readonly feedbackHref = `mailto:${FEEDBACK_ADDRESS}?subject=${encodeURIComponent('Total529 — the book')}`;
}
