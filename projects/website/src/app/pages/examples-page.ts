import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-examples-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">Real situations</p>
        <h1>{{ totalExamples() }} worked examples.</h1>
        <p class="lede">
          Every rule in the book arrives with a family attached to it &mdash; a grandparent
          superfunding in one day, a student protecting his aid eligibility, a parent going back to
          night school on his daughters' accounts. Each one sits on the page of the rule it
          demonstrates.
        </p>
      </header>
    </div>

    @if (featured().length) {
      <section class="shell stack-lg">
        <div class="section-head section-head--left">
          <p class="eyebrow">Start here</p>
          <h2>Five that surprise people</h2>
        </div>
        <div class="cards">
          @for (example of featured(); track example.name) {
            <a class="ex" [routerLink]="example.route">
              <span class="ex__tag" [class]="'ex__tag--' + example.tone">{{ example.tag }}</span>
              <span class="ex__name">{{ example.name }}</span>
              <p>{{ example.text }}</p>
              <span class="ex__more">Read the rule &rarr;</span>
            </a>
          }
        </div>
      </section>
    }

    <section class="index">
      <div class="shell">
        <div class="section-head section-head--left">
          <p class="eyebrow">Every example</p>
          <h2>The rest arrive with the book.</h2>
          <p>
            Those five are the sample; the rest of the families &mdash; and the rules they are
            attached to &mdash; arrive with the book itself.
          </p>
          <a class="btn btn--forest" routerLink="/coming-soon"
            >Total529, the book: Coming Soon &rarr;</a
          >
        </div>
      </div>
    </section>
  `,
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .ex {
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 26px 28px;
      text-decoration: none;
      color: var(--text);
      display: flex;
      flex-direction: column;
    }

    .ex:hover {
      border-color: var(--moss);
    }

    .ex__tag {
      align-self: flex-start;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      padding: 5px 13px;
      border-radius: 999px;
      margin-bottom: 14px;
    }

    .ex__tag--gp {
      background: var(--leaf-pale);
      color: var(--moss);
    }

    .ex__tag--parent {
      background: var(--amber-pale);
      color: #96591a;
    }

    .ex__tag--student {
      background: var(--sky-pale);
      color: var(--sky);
    }

    .ex__tag--business {
      background: var(--plum-pale);
      color: var(--plum);
    }

    .ex__name {
      font-weight: 800;
      font-size: 18px;
      margin-bottom: 8px;
    }

    .ex p {
      margin: 0;
      font-size: 16.5px;
      line-height: 1.65;
    }

    .ex__more {
      margin-top: auto;
      padding-top: 16px;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--moss);
    }

    .index {
      background: var(--sand-2);
      padding: 70px 0;
      margin-top: 56px;
    }

    @media (max-width: 900px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ExamplesPage {
  constructor() {
    inject(Seo).set({
      title: 'Real situations — Total529',
      description:
        'Five worked examples from Understanding, Using, and Maximizing 529 Accounts, each on the page of the rule it demonstrates — grandparents, students, parents and employers.',
    });
  }

  private readonly content = inject(ContentService);

  readonly totalExamples = this.content.totalExamples;

  /**
   * The site publishes five of the examples as a sample; the rest ship with the book, so the rule
   * index that used to live under them now points at /coming-soon.
   */
  readonly featured = computed(() => this.content.site()?.highlights.featured ?? []);
}
