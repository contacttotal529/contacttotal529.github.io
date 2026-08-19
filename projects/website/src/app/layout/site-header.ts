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
          <span class="leaf" aria-hidden="true">529</span>
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
      background: rgba(246, 241, 230, 0.93);
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

    .leaf {
      width: 38px;
      height: 38px;
      border-radius: 13px;
      background: var(--forest);
      color: var(--amber-lt);
      display: grid;
      place-items: center;
      font-size: 13.5px;
      font-weight: 800;
      flex: 0 0 auto;
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
      background: var(--sand-2);
      color: var(--text);
    }

    .nav a.on {
      background: var(--forest);
      color: #fff;
    }

    .search {
      display: flex;
      align-items: center;
      border: 2px solid var(--line);
      border-radius: 999px;
      background: var(--cream);
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
      color: var(--moss);
      font-size: 17px;
      padding: 0 8px;
      cursor: pointer;
    }

    .menu {
      display: none;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      background: var(--forest);
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
    const q = this.query().trim();
    if (!q) return;
    this.open.set(false);
    void this.router.navigate(['/search'], { queryParams: { q } });
  }
}
