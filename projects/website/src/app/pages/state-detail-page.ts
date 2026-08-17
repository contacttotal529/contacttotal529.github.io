import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-state-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './state-detail-page.html',
  styleUrl: './state-detail-page.scss',
})
export class StateDetailPage {
  private readonly content = inject(ContentService);
  private readonly seo = inject(Seo);

  readonly slug = input<string>('');

  readonly state = computed(() => this.content.state(this.slug()));

  constructor() {
    effect(() => {
      const found = this.state();
      const plans = found?.plans.length ?? 0;
      this.seo.set({
        title: found ? `${found.name} 529 plans — Total529` : 'State not found — Total529',
        description: found
          ? `${found.name} has ${plans} 529 plan${plans === 1 ? '' : 's'} in this edition: tax benefit, K–12 conformity, contribution ceiling and the official program description.`
          : null,
      });
    });
  }

  readonly cost = computed(
    () => this.content.costs()?.rows.find((r) => r.slug === this.slug()) ?? null,
  );

  readonly national = computed(() => this.content.costs()?.national ?? null);

  /** Every curated list this state appears on, so nothing is hidden behind one field. */
  readonly memberships = computed(() => {
    const state = this.state();
    const groups = this.content.statesDoc()?.groups;
    if (!state || !groups) return [];
    return Object.values(groups).filter((g) => g.states.includes(state.name));
  });

  readonly neighbours = computed(() => {
    const all = this.content.states();
    const at = all.findIndex((s) => s.slug === this.slug());
    return { prev: at > 0 ? all[at - 1] : null, next: at < all.length - 1 ? all[at + 1] : null };
  });

  readonly disclaimer = computed(() => this.content.site()?.disclaimer ?? '');

  benefitLabel(): string {
    switch (this.state()?.taxBenefit) {
      case 'credit':
        return 'A tax credit';
      case 'deduction':
        return 'A tax deduction';
      case 'none':
        return 'No contribution benefit';
      default:
        return 'Not stated in this edition';
    }
  }
}
