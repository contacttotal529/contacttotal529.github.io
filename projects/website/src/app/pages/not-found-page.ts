import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
      <p class="lede">
        It may have moved, or the link may be wrong. The whole book is still one click away.
      </p>
      <div class="cta">
        <a class="btn btn--forest" routerLink="/guide">Browse the guide</a>
        <a class="btn btn--outline" routerLink="/search">Search instead</a>
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

    @media (max-width: 900px) {
      h1 {
        font-size: 30px;
      }
    }
  `,
})
export class NotFoundPage {
  constructor() {
    inject(Seo).set({
      title: 'Page not found — Total529',
      description: null,
    });
  }
}
