import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Total529 — Understanding, Using, and Maximizing 529 Accounts',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'guide',
    title: 'The Guide — Total529',
    loadComponent: () => import('./pages/guide-page').then((m) => m.GuidePage),
  },
  {
    path: 'guide/:chapterId',
    loadComponent: () => import('./pages/chapter-page').then((m) => m.ChapterPage),
  },
  {
    path: 'guide/:chapterId/:sectionId',
    loadComponent: () => import('./pages/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'read',
    title: 'Read the Book — Total529',
    loadComponent: () => import('./pages/read-page').then((m) => m.ReadPage),
  },
  {
    path: 'states',
    title: 'State Plan Guide — Total529',
    loadComponent: () => import('./pages/states-page').then((m) => m.StatesPage),
  },
  {
    path: 'states/:slug',
    loadComponent: () => import('./pages/state-detail-page').then((m) => m.StateDetailPage),
  },
  {
    path: 'costs',
    title: 'Cost of Attendance — Total529',
    loadComponent: () => import('./pages/costs-page').then((m) => m.CostsPage),
  },
  {
    path: 'history',
    title: 'Thirty Years of 529 Plans — Total529',
    loadComponent: () => import('./pages/history-page').then((m) => m.HistoryPage),
  },
  {
    path: 'reference',
    title: 'Reference — Total529',
    loadComponent: () => import('./pages/reference-page').then((m) => m.ReferencePage),
  },
  {
    path: 'search',
    title: 'Search — Total529',
    loadComponent: () => import('./pages/search-page').then((m) => m.SearchPage),
  },
  {
    path: 'about',
    title: 'About — Total529',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
  },
  {
    path: '**',
    title: 'Page not found — Total529',
    loadComponent: () => import('./pages/not-found-page').then((m) => m.NotFoundPage),
  },
];
