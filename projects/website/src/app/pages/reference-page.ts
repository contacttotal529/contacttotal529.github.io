import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-reference-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">Reference</p>
        <h1>The tables you'll come back to.</h1>
        <p class="lede">
          Who counts as family, what a 529 will and won't pay for, and the figures that change every
          year.
        </p>
      </header>
    </div>

    <section class="shell stack-lg" id="qualified">
      <div class="section-head section-head--left">
        <p class="eyebrow">Qualified expenses</p>
        <h2>Can a 529 pay for that?</h2>
        <p>Every answer links to the rule it comes from.</p>
      </div>

      <div class="legend">
        <span class="chip chip--yes">Qualified</span>
        <span class="chip chip--amber">Conditions apply</span>
        <span class="chip chip--no">Not qualified</span>
      </div>

      <ul class="answers">
        @for (answer of answers(); track answer.item) {
          <li [class]="'answer answer--' + answer.status">
            <a [routerLink]="['/guide', answer.link[0], answer.link[1]]">
              <span class="answer__mark" aria-hidden="true">
                @switch (answer.status) {
                  @case ('qualified') {
                    &#10003;
                  }
                  @case ('conditional') {
                    ?
                  }
                  @default {
                    &#10007;
                  }
                }
              </span>
              <span>
                <strong>{{ answer.item }}</strong>
                <span class="answer__detail">{{ answer.detail }}</span>
              </span>
            </a>
          </li>
        }
      </ul>
    </section>

    @if (family(); as fam) {
      <section class="family" id="family">
        <div class="shell">
          <div class="section-head section-head--left">
            <p class="eyebrow">Appendix 3</p>
            <h2>Who counts as a "member of my family"?</h2>
            @for (line of fam.lead; track line) {
              <p>{{ line }}</p>
            }
          </div>

          <ul class="family__list">
            @for (item of fam.items; track item) {
              <li>{{ item }}</li>
            }
          </ul>

          <p class="family__note">
            Transfers to anyone on this list are penalty-free. A transfer outside the beneficiary's
            family is not possible &mdash; the account has to be liquidated with a non-qualified
            distribution and restarted in the new name. See
            <a routerLink="/guide/basics/family-transfers">transfers between family members</a> and
            <a routerLink="/guide/after-graduation/transfer-extra-funds">moving extra funds</a>.
          </p>
        </div>
      </section>
    }

    <section class="shell stack-lg" id="figures">
      <div class="section-head section-head--left">
        <p class="eyebrow">{{ book()?.taxYear }} figures</p>
        <h2>Frequently Changing Numbers</h2>
        <p>Check these against the current year before acting on them.</p>
      </div>

      <div class="figures">
        @for (item of keyNumbers(); track item.label) {
          <a class="figure" [routerLink]="['/guide', item.link[0], item.link[1]]">
            <span class="figure__amount">{{ item.amount }}</span>
            <span class="figure__label">{{ item.label }}</span>
            <span class="figure__sub">{{ item.sub }}</span>
          </a>
        }
      </div>

      <p class="page-disclaimer">{{ disclaimer() }}</p>
    </section>
  `,
  styles: `
    .legend {
      display: flex;
      gap: 10px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .answer strong {
      display: block;
      font-size: 17px;
      margin-bottom: 4px;
    }

    .answer__detail {
      font-size: 15px;
      color: var(--muted);
      line-height: 1.55;
    }

    .family {
      background: var(--sand-2);
      padding: 66px 0 70px;
    }

    .family__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px 20px;
    }

    .family__list li {
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 14px 18px 14px 42px;
      position: relative;
      font-size: 16.5px;
      line-height: 1.5;
    }

    .family__list li::before {
      content: '✓';
      position: absolute;
      left: 16px;
      top: 14px;
      color: var(--moss);
      font-weight: 800;
    }

    .family__note {
      margin-top: 24px;
      font-size: 16px;
      color: var(--muted);
      max-width: 80ch;
    }

    .family__note a {
      color: var(--moss);
      font-weight: 700;
    }

    .figures {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .figure {
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 24px 26px;
      text-decoration: none;
      color: var(--text);
    }

    .figure:hover {
      border-color: var(--moss);
    }

    .figure__amount {
      display: block;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--forest);
      line-height: 1;
    }

    .figure__label {
      display: block;
      font-size: 15.5px;
      font-weight: 700;
      margin: 11px 0 6px;
    }

    .figure__sub {
      display: block;
      font-size: 14px;
      color: var(--muted);
      line-height: 1.5;
    }

    @media (max-width: 900px) {
      .family__list,
      .figures {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ReferencePage {
  constructor() {
    inject(Seo).set({
      title: 'Reference tables — Total529',
      description:
        "What a 529 will and won't pay for, who counts as a member of the family, and the figures that change every tax year.",
    });
  }

  private readonly content = inject(ContentService);

  readonly book = this.content.book;
  readonly answers = computed(() => this.content.site()?.quickAnswers ?? []);
  readonly keyNumbers = computed(() => this.content.site()?.figures.keyNumbers ?? []);
  readonly family = computed(() => this.content.book()?.appendices.family ?? null);
  readonly disclaimer = computed(() => this.content.site()?.disclaimer ?? '');
}
