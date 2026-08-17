import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

/** Canonical origin. Pages are prerendered, so absolute URLs have to be spelled out. */
export const SITE_ORIGIN = 'https://total529.com';

export interface PageSeo {
  title: string;
  description?: string | null;
}

/**
 * Sets the per-page tags that survive prerendering. Every route is a static HTML file, so
 * whatever is set during the prerender pass is what a crawler sees without running any script.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  set({ title, description }: PageSeo): void {
    this.title.setTitle(title);

    const summary = trim(description);
    if (summary) {
      this.meta.updateTag({ name: 'description', content: summary });
      this.meta.updateTag({ property: 'og:description', content: summary });
    } else {
      this.meta.removeTag("name='description'");
      this.meta.removeTag("property='og:description'");
    }

    const url = SITE_ORIGIN + this.router.url.split(/[?#]/)[0];
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Total529' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

/** Meta descriptions are truncated by search engines around 160 characters. */
function trim(text: string | null | undefined, limit = 158): string | null {
  if (!text) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : limit)}…`;
}
