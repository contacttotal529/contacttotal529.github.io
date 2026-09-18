import { Routes } from '@angular/router';

import { chapterContentResolver } from './core/chapter.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  // The final edition moved three rules out of the comparisons chapter and dropped a fourth
  // that duplicated the estate-planning one. Their old URLs were published and crawled, so
  // they redirect rather than 404. These must stay above `guide/:chapterId/:sectionId`.
  ...[
    ['state-estate-tax', 'estate-planning/state-estate-tax'],
    ['penalty-free-exits', 'maximizing/penalty-free-exits'],
    ['summary', 'maximizing/summary'],
    ['dynasty-plans', 'estate-planning/multigenerational-transfer'],
  ].map(([from, to]) => ({
    path: `guide/comparisons/${from}`,
    redirectTo: `/guide/${to}`,
    pathMatch: 'full' as const,
  })),
  {
    // Rules stand alone and are reached by search or by topic. There is deliberately no table
    // of contents and no chapter page: the site answers a question, it does not serve the book.
    path: 'guide/:chapterId/:sectionId',
    resolve: { chapterContent: chapterContentResolver },
    loadComponent: () => import('./pages/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'examples',
    loadComponent: () => import('./pages/examples-page').then((m) => m.ExamplesPage),
  },
  {
    path: 'states',
    loadComponent: () => import('./pages/states-page').then((m) => m.StatesPage),
  },
  {
    path: 'states/:slug',
    loadComponent: () => import('./pages/state-detail-page').then((m) => m.StateDetailPage),
  },
  {
    path: 'costs',
    loadComponent: () => import('./pages/costs-page').then((m) => m.CostsPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history-page').then((m) => m.HistoryPage),
  },
  {
    path: 'reference',
    loadComponent: () => import('./pages/reference-page').then((m) => m.ReferencePage),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-page').then((m) => m.SearchPage),
  },
  {
    // Every link that would take a reader past the published sample lands here.
    path: 'the-book',
    loadComponent: () => import('./pages/the-book-page').then((m) => m.TheBookPage),
  },
  {
    // The sink was /coming-soon until the book was published. Links to it are in the wild and
    // in the sitemap Google already crawled, so the old path still has to arrive somewhere.
    path: 'coming-soon',
    redirectTo: 'the-book',
    pathMatch: 'full',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
  },
  {
    // Prerendered to /404/index.html, which the Pages build copies to 404.html so unknown
    // URLs return a real not-found page instead of a copy of the home page.
    path: '404',
    loadComponent: () => import('./pages/not-found-page').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found-page').then((m) => m.NotFoundPage),
  },
];
