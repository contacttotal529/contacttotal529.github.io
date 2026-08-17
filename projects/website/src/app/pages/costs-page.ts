import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import type { CostRow } from '../core/content.models';

type SortKey = 'state' | 'tuition' | 'room' | 'board' | 'total' | 'vsNational';

@Component({
  selector: 'app-costs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell">
      <header class="page-banner">
        <p class="eyebrow eyebrow--on-dark">Appendix 2</p>
        <h1>What a year of public university costs.</h1>
        <p class="lede">
          In-state cost of attendance at each state's flagship public university, 2025&ndash;26.
          Totals include tuition and fees, room, board, and books. Travel and personal expenses are
          not included.
        </p>
      </header>
    </div>

    <section class="shell stack-md">
      @if (national(); as n) {
        <div class="national">
          <div>
            <p class="eyebrow">National average, all 50 states</p>
            <p class="national__total">{{ money(n.total) }}</p>
            <p class="national__sub">per year, in-state</p>
          </div>
          <dl class="national__split">
            <div>
              <dt>Tuition &amp; fees</dt>
              <dd>{{ money(n.tuition) }}</dd>
            </div>
            <div>
              <dt>Room</dt>
              <dd>{{ money(n.room) }}</dd>
            </div>
            <div>
              <dt>Board</dt>
              <dd>{{ money(n.board) }}</dd>
            </div>
            <div>
              <dt>Books &amp; supplies</dt>
              <dd>{{ money(n.books) }}</dd>
            </div>
          </dl>
        </div>
      }

      <div class="controls">
        <label class="visually-hidden" for="cost-search">Filter by state or school</label>
        <input
          id="cost-search"
          class="field"
          type="search"
          placeholder="Filter by state or school…"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
        <p class="count">{{ rows().length }} of {{ allRows().length }} states</p>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th scope="col" [class.num]="col.numeric">
                  <button type="button" (click)="sortBy(col.key)">
                    {{ col.label }}
                    @if (sort() === col.key) {
                      <span aria-hidden="true">{{ desc() ? '▾' : '▴' }}</span>
                    }
                  </button>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.slug) {
              <tr>
                <th scope="row">
                  <a [routerLink]="['/states', row.slug]">{{ row.state }}</a>
                </th>
                <td>{{ row.school }}</td>
                <td class="num">{{ money(row.tuition) }}</td>
                <td class="num">{{ money(row.room) }}</td>
                <td class="num">{{ money(row.board) }}</td>
                <td class="num total">{{ money(row.total) }}</td>
                <td class="num" [class.over]="(row.vsNational ?? 0) > 0">
                  {{ (row.vsNational ?? 0) > 0 ? '+' : '' }}{{ row.vsNational }}%
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <p class="footnote">
        Figures are 2025&ndash;26 estimates and vary by major, housing choice, and financial aid.
        Staying within a school's published cost of attendance is what keeps a 529 withdrawal
        defensible &mdash; see
        <a routerLink="/guide/post-secondary/room-and-board">room and board</a> and
        <a routerLink="/guide/post-secondary/recordkeeping">keeping documentation</a>. Source:
        Education Data Initiative &amp; College Board Trends in College Pricing 2025.
      </p>
    </section>
  `,
  styles: `
    .national {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 40px;
      align-items: center;
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 28px 32px;
      margin-bottom: 28px;
    }

    .national__total {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--forest);
      margin: 8px 0 0;
      line-height: 1;
    }

    .national__sub {
      font-size: 14.5px;
      color: var(--muted);
      margin: 6px 0 0;
    }

    .national__split {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 0;
    }

    .national__split dt {
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 800;
      margin-bottom: 5px;
    }

    .national__split dd {
      margin: 0;
      font-size: 21px;
      font-weight: 800;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .controls .field {
      flex: 0 1 320px;
    }

    .count {
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 700;
      margin: 0;
    }

    thead button {
      background: none;
      border: 0;
      padding: 0;
      font: inherit;
      color: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      cursor: pointer;
      display: inline-flex;
      gap: 5px;
      align-items: center;
    }

    thead button:hover {
      color: var(--moss);
    }

    tbody th {
      font-size: 16.5px;
      font-weight: 700;
      white-space: nowrap;
    }

    tbody th a {
      text-decoration: none;
    }

    tbody th a:hover {
      color: var(--moss);
    }

    td.total {
      font-weight: 800;
    }

    td.over {
      color: var(--plum);
    }

    .footnote {
      font-size: 14px;
      color: var(--muted);
      margin-top: 18px;
      max-width: 94ch;
      line-height: 1.65;
    }

    .footnote a {
      color: var(--moss);
      font-weight: 700;
    }

    @media (max-width: 900px) {
      .national {
        grid-template-columns: 1fr;
        gap: 22px;
      }

      .national__split {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
})
export class CostsPage {
  private readonly content = inject(ContentService);

  readonly sort = signal<SortKey>('total');
  readonly desc = signal(true);
  readonly query = signal('');

  readonly columns: { key: SortKey; label: string; numeric: boolean }[] = [
    { key: 'state', label: 'State', numeric: false },
    { key: 'state', label: 'Flagship university', numeric: false },
    { key: 'tuition', label: 'Tuition & fees', numeric: true },
    { key: 'room', label: 'Room', numeric: true },
    { key: 'board', label: 'Board', numeric: true },
    { key: 'total', label: 'Total', numeric: true },
    { key: 'vsNational', label: 'vs. national', numeric: true },
  ];

  readonly allRows = computed<CostRow[]>(() => this.content.costs()?.rows ?? []);
  readonly national = computed(() => this.content.costs()?.national ?? null);

  readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const key = this.sort();
    const direction = this.desc() ? -1 : 1;

    return this.allRows()
      .filter((r) => !q || r.state.toLowerCase().includes(q) || r.school.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => {
        if (key === 'state') return a.state.localeCompare(b.state) * (this.desc() ? -1 : 1);
        return ((a[key] ?? 0) - (b[key] ?? 0)) * direction;
      });
  });

  sortBy(key: SortKey): void {
    if (this.sort() === key) {
      this.desc.set(!this.desc());
    } else {
      this.sort.set(key);
      this.desc.set(key !== 'state');
    }
  }

  money(value: number | null): string {
    return value === null ? '—' : `$${value.toLocaleString('en-US')}`;
  }
}
