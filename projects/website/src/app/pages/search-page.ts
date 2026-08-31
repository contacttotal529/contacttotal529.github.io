import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell shell--narrow stack-md">
      <p class="eyebrow">Search</p>
      <h1>What are you trying to find out?</h1>

      <form class="box" (submit)="submit($event)">
        <label class="visually-hidden" for="q">Search the guide</label>
        <input
          id="q"
          class="field"
          type="search"
          placeholder="tutor, Roth rollover, room and board, Utah…"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
        <button class="btn btn--forest" type="submit">Search</button>
      </form>

      <div class="suggest">
        <p class="suggest__label">Common questions</p>
        @for (item of suggestions; track item) {
          <button class="chip" type="button" (click)="comingSoon()">{{ item }}</button>
        }
      </div>
    </div>
  `,
  styles: `
    h1 {
      font-size: 38px;
      margin: 12px 0 24px;
    }

    .box {
      display: flex;
      gap: 12px;
      margin-bottom: 26px;
      flex-wrap: wrap;
    }

    .box .field {
      flex: 1 1 280px;
    }

    .suggest {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      align-items: center;
    }

    .suggest__label {
      font-size: 12.5px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 800;
      margin: 0 6px 0 0;
      flex-basis: 100%;
    }

    @media (max-width: 900px) {
      h1 {
        font-size: 28px;
      }
    }
  `,
})
export class SearchPage {
  constructor() {
    inject(Seo).set({
      title: 'Search — Total529',
      description: null,
    });
  }

  private readonly router = inject(Router);

  /** Keeps the field controlled; searching the sample is not offered until the book ships. */
  readonly query = signal('');

  readonly suggestions = [
    'tutor',
    'Roth rollover',
    'room and board',
    'student loans',
    'superfunding',
    'financial aid',
    'change the beneficiary',
    'scholarship',
    'apprenticeship',
  ];

  submit(event: Event): void {
    event.preventDefault();
    this.comingSoon();
  }

  comingSoon(): void {
    void this.router.navigate(['/coming-soon']);
  }
}
