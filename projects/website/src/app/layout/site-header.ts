import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="shell bar">
        <a class="logo" routerLink="/" aria-label="Total529 home">
          <svg class="mark" viewBox="50 50 200 200" aria-hidden="true" focusable="false">
            <circle class="mark__disc" cx="150" cy="150" r="90" />
            <path class="mark__sweep" d="M 214.74 87.48 A 90 90 0 1 1 195 72.06" />
            <polygon class="mark__tip" points="210.59,81.06 179.11,75.58 190.11,56.53" />
            <text
              class="mark__num"
              x="150"
              y="150"
              text-anchor="middle"
              dominant-baseline="central"
            >
              529
            </text>
          </svg>
          Total529
        </a>

        <button
          class="menu no-print"
          type="button"
          [attr.aria-expanded]="open()"
          aria-controls="primary-nav"
          (click)="open.set(!open())"
        >
          {{ open() ? 'Close' : 'Menu' }}
        </button>

        <nav id="primary-nav" class="nav no-print" [class.nav--open]="open()">
          @for (item of links; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="on"
              [routerLinkActiveOptions]="{ exact: false }"
              (click)="open.set(false)"
              >{{ item.label }}</a
            >
          }
        </nav>

        <form class="search no-print" (submit)="submit($event)">
          <label class="visually-hidden" for="site-search">Search the guide</label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
          <button type="submit" aria-label="Search">&#9906;</button>
        </form>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    header {
      background: rgba(244, 239, 227, 0.92);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 18px;
      padding-top: 14px;
      padding-bottom: 14px;
      flex-wrap: wrap;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 11px;
      text-decoration: none;
      font-weight: 800;
      font-size: 21px;
      letter-spacing: -0.03em;
      margin-right: auto;
      color: var(--text);
    }

    /* The book jacket's badge: gold disc, navy 529, navy arrow sweeping round it. */
    .mark {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
    }

    .mark__disc {
      fill: var(--gold);
    }

    .mark__sweep {
      fill: none;
      stroke: var(--navy);
      stroke-width: 14;
      stroke-linecap: round;
    }

    .mark__tip {
      fill: var(--navy);
    }

    .mark__num {
      fill: var(--navy);
      font-family: var(--sans);
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -2px;
    }

    .nav {
      display: flex;
      gap: 4px;
      font-size: 15.5px;
      font-weight: 600;
    }

    .nav a {
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 999px;
      color: var(--muted);
      white-space: nowrap;
    }

    .nav a:hover {
      background: var(--cream-2);
      color: var(--text);
    }

    .nav a.on {
      background: var(--navy);
      color: #fff;
    }

    .search {
      display: flex;
      align-items: center;
      border: 2px solid var(--line-strong);
      border-radius: 999px;
      background: var(--paper);
      padding-right: 6px;
    }

    .search input {
      border: 0;
      background: transparent;
      padding: 9px 8px 9px 16px;
      font-family: inherit;
      font-size: 14.5px;
      width: 120px;
      color: var(--text);
    }

    .search input:focus {
      outline: none;
    }

    .search button {
      border: 0;
      background: transparent;
      color: var(--navy-lt);
      font-size: 17px;
      padding: 0 8px;
      cursor: pointer;
    }

    .menu {
      display: none;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      background: var(--navy);
      color: #fff;
      border: 0;
      border-radius: 999px;
      padding: 10px 20px;
      cursor: pointer;
    }

    @media (max-width: 1080px) {
      .menu {
        display: block;
        order: 2;
      }

      .nav {
        order: 4;
        flex-basis: 100%;
        display: none;
        flex-direction: column;
        gap: 2px;
        border-top: 1px solid var(--line);
        padding-top: 10px;
      }

      .nav--open {
        display: flex;
      }

      .search {
        order: 3;
        flex-basis: 100%;
      }

      .search input {
        width: 100%;
      }
    }
  `,
})
export class SiteHeader {
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);

  readonly open = signal(false);
  readonly query = signal('');
  readonly taxYear = () => this.content.book()?.taxYear ?? 2026;

  readonly links = [
    { path: '/examples', label: 'Real situations' },
    { path: '/states', label: 'Your state' },
    { path: '/costs', label: 'College costs' },
    { path: '/history', label: 'History' },
    { path: '/reference', label: 'Reference' },
    { path: '/about', label: 'About' },
  ];

  submit(event: Event): void {
    event.preventDefault();
    if (!this.query().trim()) return;
    this.open.set(false);
    void this.router.navigate(['/the-book']);
  }
}
