import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="shell shell--narrow stack-lg">
      <p class="eyebrow">404</p>
      <h1>That page isn't here.</h1>
      <p class="lede">It may have moved, or the link may be wrong.</p>
      <div class="cta">
        <a class="btn btn--forest" routerLink="/">Return home</a>
        @if (canGoBack()) {
          <button class="btn btn--outline" type="button" (click)="goBack()">
            Return to the last page
          </button>
        }
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
      margin-top: 26px;
      flex-wrap: wrap;
    }

    .cta button {
      font-family: inherit;
      cursor: pointer;
    }

    @media (max-width: 900px) {
      h1 {
        font-size: 30px;
      }
    }
  `,
})
export class NotFoundPage {
  private readonly location = inject(Location);

  /**
   * Rendered false during prerendering and switched on in the browser, so the static 404.html
   * never ships a button that would do nothing. Someone who typed the URL or followed a link
   * from elsewhere has no history to go back to.
   */
  readonly canGoBack = signal(false);

  constructor() {
    inject(Seo).set({ title: 'Page not found — Total529', description: null });

    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.canGoBack.set(true);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
