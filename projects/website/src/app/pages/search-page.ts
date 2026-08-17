import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
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

      @if (!query().trim()) {
        <div class="suggest">
          <p class="suggest__label">Common questions</p>
          @for (item of suggestions; track item) {
            <button class="chip" type="button" (click)="run(item)">{{ item }}</button>
          }
        </div>
      } @else {
        <p class="count">
          {{ results().length }} result{{ results().length === 1 ? '' : 's' }} for &ldquo;{{
            query()
          }}&rdquo;
        </p>

        <ul class="results">
          @for (hit of results(); track hit.route.join('/') + hit.title) {
            <li>
              <a [routerLink]="hit.route">
                <span class="results__kind" [class]="'results__kind--' + hit.kind">{{
                  hit.context
                }}</span>
                <strong>{{ hit.title }}</strong>
                <span class="results__snippet">{{ hit.snippet }}</span>
              </a>
            </li>
          } @empty {
            <li class="empty">
              <p>Nothing matched that. Try a plainer word &mdash; the book's own vocabulary.</p>
              <p>
                <a class="link-more" routerLink="/guide">Browse the guide instead &rarr;</a>
              </p>
            </li>
          }
        </ul>
      }
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

    .count {
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--faint);
      font-weight: 700;
      margin-bottom: 12px;
    }

    .results {
      list-style: none;
      margin: 0 0 40px;
      padding: 0;
    }

    .results a {
      display: block;
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 20px 24px;
      margin-bottom: 12px;
      text-decoration: none;
      color: var(--text);
    }

    .results a:hover {
      border-color: var(--moss);
    }

    .results__kind {
      display: inline-block;
      font-size: 11.5px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 800;
      padding: 3px 11px;
      border-radius: 999px;
      margin-bottom: 10px;
      background: var(--leaf-pale);
      color: var(--moss);
    }

    .results__kind--state {
      background: var(--sky-pale);
      color: var(--sky);
    }

    .results__kind--chapter {
      background: var(--amber-pale);
      color: #96591a;
    }

    .results strong {
      display: block;
      font-size: 19px;
      line-height: 1.4;
      margin-bottom: 7px;
    }

    .results__snippet {
      font-size: 15.5px;
      color: var(--muted);
      line-height: 1.6;
    }

    .empty {
      background: var(--cream);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 26px 28px;
    }

    .empty p:last-child {
      margin: 0;
    }

    @media (max-width: 900px) {
      h1 {
        font-size: 28px;
      }
    }
  `,
})
export class SearchPage {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  /** Bound from ?q= by withComponentInputBinding, mirrored into a local signal for typing. */
  readonly query = signal(new URLSearchParams(location.search).get('q') ?? '');

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

  readonly results = computed(() => this.content.search(this.query()));

  submit(event: Event): void {
    event.preventDefault();
    void this.router.navigate([], { queryParams: { q: this.query().trim() || null } });
  }

  run(term: string): void {
    this.query.set(term);
    void this.router.navigate([], { queryParams: { q: term } });
  }
}
