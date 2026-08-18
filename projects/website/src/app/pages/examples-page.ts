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
          <h2>Which rules come with a worked example?</h2>
          <p>
            {{ rulesWithExamples() }} of the guide's {{ totalSections() }} rules do. Open the rule
            to read its example in full.
          </p>
        </div>

        @for (group of groups(); track group.chapterId) {
          <section class="group">
            <h3>
              <a [routerLink]="['/guide', group.chapterId]">{{ group.chapterTitle }}</a>
              <span class="group__count">{{ group.total }} examples</span>
            </h3>
            <ol class="rules">
              @for (rule of group.rules; track rule.id) {
                <li>
                  <a [routerLink]="['/guide', group.chapterId, rule.id]">
                    <span class="rules__title">{{ rule.title }}</span>
                    <span class="rules__count">{{ rule.exampleCount }}</span>
                  </a>
                </li>
              }
            </ol>
          </section>
        }
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

    .group {
      border-top: 1px solid var(--line);
      padding: 26px 0;
    }

    .group h3 {
      display: flex;
      align-items: baseline;
      gap: 14px;
      font-size: 22px;
      margin: 0 0 14px;
    }

    .group h3 a {
      text-decoration: none;
    }

    .group h3 a:hover {
      color: var(--moss);
    }

    .group__count {
      font-size: 12.5px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 700;
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
      align-items: baseline;
      text-decoration: none;
      color: var(--text);
      padding: 9px 12px;
      border-radius: var(--radius-sm);
    }

    .rules a:hover {
      background: var(--cream);
      color: var(--moss);
    }

    .rules__title {
      font-size: 16px;
      line-height: 1.45;
    }

    .rules__count {
      margin-left: auto;
      font-size: 13px;
      font-weight: 700;
      color: var(--faint);
    }

    @media (max-width: 900px) {
      .cards,
      .rules {
        grid-template-columns: 1fr;
        columns: 1;
      }
    }
  `,
})
export class ExamplesPage {
  constructor() {
    inject(Seo).set({
      title: 'Real situations — Total529',
      description:
        'Every worked example in Understanding, Using, and Maximizing 529 Accounts, indexed by the rule it demonstrates — grandparents, students, parents and employers.',
    });
  }

  private readonly content = inject(ContentService);

  readonly totalExamples = this.content.totalExamples;
  readonly totalSections = this.content.totalSections;
  readonly featured = computed(() => this.content.site()?.highlights.featured ?? []);

  /**
   * An index rather than the examples themselves: the prose lives in the per-chapter files, and
   * lifting all of it here would make this page a copy of the book.
   */
  readonly groups = computed(() =>
    this.content
      .chapters()
      .map((chapter) => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        rules: chapter.sections.filter((section) => section.exampleCount > 0),
      }))
      .filter((group) => group.rules.length > 0)
      .map((group) => ({
        ...group,
        total: group.rules.reduce((n, rule) => n + rule.exampleCount, 0),
      })),
  );

  readonly rulesWithExamples = computed(() =>
    this.groups().reduce((n, group) => n + group.rules.length, 0),
  );
}
