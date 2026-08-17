import { RenderMode, ServerRoute } from '@angular/ssr';

import bookJson from '../generated/book.json';
import statesJson from '../generated/states.json';

// JSON imports infer structurally, so chapters with no rules land as never[]. Narrow to just
// the identifiers the prerenderer needs.
const book = bookJson as unknown as { chapters: { id: string; sections: { id: string }[] }[] };
const states = statesJson as unknown as { states: { slug: string }[] };

/**
 * Every route is prerendered to a static HTML file, so GitHub Pages can serve real 200s with
 * the rule text already in the markup. Parameterised routes enumerate their paths from the
 * generated content, which means adding a rule to the manuscript adds a page here for free.
 *
 * PrerenderFallback is deliberately left at its default: with `outputMode: 'static'` there is
 * no server to fall back to, and any path we failed to enumerate lands on 404.html, where the
 * router still renders it client-side.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'guide/:chapterId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => book.chapters.map((chapter) => ({ chapterId: chapter.id })),
  },
  {
    path: 'guide/:chapterId/:sectionId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      book.chapters.flatMap((chapter) =>
        chapter.sections.map((section) => ({
          chapterId: chapter.id,
          sectionId: section.id,
        })),
      ),
  },
  {
    path: 'states/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => states.states.map((state) => ({ slug: state.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
