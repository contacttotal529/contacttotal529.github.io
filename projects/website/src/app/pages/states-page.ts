import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import type { StateEntry } from '../core/content.models';

type FilterKey = 'all' | 'credit' | 'deduction' | 'none' | 'anyPlan' | 'k12No' | 'gold';

const FILTERS: { key: FilterKey; label: string; test: (s: StateEntry) => boolean }[] = [
  { key: 'all', label: 'All states', test: () => true },
  { key: 'credit', label: 'Tax credit', test: (s) => s.taxBenefit === 'credit' },
  { key: 'deduction', label: 'Tax deduction', test: (s) => s.taxBenefit === 'deduction' },
  { key: 'none', label: 'No contribution benefit', test: (s) => s.taxBenefit === 'none' },
  { key: 'anyPlan', label: "Benefit on any state's plan", test: (s) => s.anyPlanDeduction },
  { key: 'k12No', label: 'K–12 not allowed', test: (s) => s.k12 === 'not-allowed' },
  { key: 'gold', label: 'Morningstar Gold', test: (s) => s.morningstarGold },
];

@Component({
  selector: 'app-states-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './states-page.html',
  styleUrl: './states-page.scss',
})
export class StatesPage {
  private readonly content = inject(ContentService);

  readonly filters = FILTERS;
  readonly active = signal<FilterKey>('all');
  readonly query = signal('');

  readonly states = this.content.states;
  readonly totalPlans = this.content.totalPlans;
  readonly groups = computed(() => {
    const doc = this.content.statesDoc();
    return doc ? Object.entries(doc.groups).map(([key, group]) => ({ key, ...group })) : [];
  });
  readonly sources = computed(() => this.content.statesDoc()?.sources ?? []);

  readonly visible = computed(() => {
    const test = FILTERS.find((f) => f.key === this.active())?.test ?? (() => true);
    const q = this.query().trim().toLowerCase();
    return this.states().filter(
      (s) =>
        test(s) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.plans.some((p) => p.name.toLowerCase().includes(q))),
    );
  });

  benefitLabel(state: StateEntry): string {
    switch (state.taxBenefit) {
      case 'credit':
        return 'Credit';
      case 'deduction':
        return 'Deduction';
      case 'none':
        return 'None';
      default:
        return 'Not stated';
    }
  }

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
