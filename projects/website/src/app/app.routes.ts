import { Routes } from '@angular/router';

import { chapterContentResolver, resolveChapter } from './core/chapter.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'guide',
    loadComponent: () => import('./pages/guide-page').then((m) => m.GuidePage),
  },
  {
    path: 'guide/:chapterId',
    resolve: { chapterContent: chapterContentResolver },
    loadComponent: () => import('./pages/chapter-page').then((m) => m.ChapterPage),
  },
  {
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
    resolve: { chapterContent: resolveChapter('history') },
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
