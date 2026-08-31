import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentService } from './content.service';

/**
 * Each chapter's prose is a separate lazy file, so a page that renders prose has to wait for
 * it. Resolving on the route rather than inside the component is what keeps prerendering
 * honest: the router holds activation until the chapter lands, and the static HTML is written
 * with the rule text already in it.
 */
export const chapterContentResolver: ResolveFn<boolean> = async (route) => {
  const id = route.paramMap.get('chapterId');
  if (id) await inject(ContentService).loadChapter(id);
  return true;
};
