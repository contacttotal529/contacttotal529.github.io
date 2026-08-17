import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { BlockRenderer } from '../shared/block-renderer';

@Component({
  selector: 'app-read-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BlockRenderer],
  templateUrl: './read-page.html',
  styleUrl: './read-page.scss',
})
export class ReadPage implements AfterViewInit, OnDestroy {
  private readonly content = inject(ContentService);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('doc');
  private observer?: IntersectionObserver;

  readonly book = this.content.book;
  readonly chapters = this.content.chapters;
  readonly totalSections = this.content.totalSections;
  readonly totalExamples = this.content.totalExamples;

  readonly activeChapter = signal<string>('');
  readonly activeSection = signal<string>('');
  readonly tocOpen = signal(false);

  readonly numerals = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
  ];
  readonly disclaimerText = this.content.site()?.disclaimer ?? '';

  ngAfterViewInit(): void {
    const targets = this.host().nativeElement.querySelectorAll<HTMLElement>('[data-chapter]');
    if (!targets.length) return;

    // Track the heading nearest the top of the viewport rather than whichever fires last.
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;

        const el = visible.target as HTMLElement;
        this.activeChapter.set(el.dataset['chapter'] ?? '');
        this.activeSection.set(el.dataset['section'] ?? '');
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 },
    );

    targets.forEach((el) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  jump(id: string, event: Event): void {
    event.preventDefault();
    this.tocOpen.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  }

  toTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
