import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Block } from '../core/content.models';

/** Renders the manuscript block types produced by tools/build-content.mjs. */
@Component({
  selector: 'app-blocks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    @for (block of blocks(); track $index) {
      @switch (block.type) {
        @case ('example') {
          <figure class="example">
            <figcaption>
              <span class="example__dot" aria-hidden="true"></span>
              {{ block.label || 'Example' }}
            </figcaption>
            @for (p of block.paragraphs; track $index) {
              <p>{{ p }}</p>
            }
            <ng-container
              [ngTemplateOutlet]="sources"
              [ngTemplateOutletContext]="{ $implicit: block }"
            />
          </figure>
        }
        @case ('note') {
          <aside class="note">
            <span class="note__label">Note</span>
            @for (p of block.paragraphs; track $index) {
              <p>{{ p }}</p>
            }
            <ng-container
              [ngTemplateOutlet]="sources"
              [ngTemplateOutletContext]="{ $implicit: block }"
            />
          </aside>
        }
        @case ('decision-tree') {
          <section class="tree">
            <p class="tree__label">Decision tree{{ block.label ? ' — ' + block.label : '' }}</p>
            <ol>
              @for (item of block.items; track $index) {
                <li>{{ item }}</li>
              }
            </ol>
          </section>
        }
        @case ('list') {
          <div class="list">
            @if (block.lead) {
              <p>{{ block.lead }}</p>
            }
            <ul>
              @for (item of block.items; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
            <ng-container
              [ngTemplateOutlet]="sources"
              [ngTemplateOutletContext]="{ $implicit: block }"
            />
          </div>
        }
        @case ('table') {
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  @for (cell of block.header; track $index) {
                    <th scope="col">{{ cell }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of block.rows; track $index) {
                  <tr>
                    @for (cell of row; track $index) {
                      <td>{{ cell }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('links') {
          <ng-container
            [ngTemplateOutlet]="sources"
            [ngTemplateOutletContext]="{ $implicit: block }"
          />
        }
        @default {
          <div class="prose">
            @for (p of block.paragraphs; track $index) {
              <p>{{ p }}</p>
            }
            <ng-container
              [ngTemplateOutlet]="sources"
              [ngTemplateOutletContext]="{ $implicit: block }"
            />
          </div>
        }
      }
    }

    <ng-template #sources let-block>
      @if (block.links.length) {
        <ul class="sources">
          @for (link of block.links; track link) {
            <li>
              <a [href]="link" target="_blank" rel="noopener noreferrer">{{ pretty(link) }}</a>
            </li>
          }
        </ul>
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
    }

    .prose p,
    .list p {
      font-size: 18.5px;
      line-height: 1.8;
      margin: 0 0 1.05em;
    }

    .list ul {
      margin: 0 0 1.2em;
      padding: 0;
      list-style: none;
    }

    .list li {
      position: relative;
      padding: 6px 0 6px 26px;
      font-size: 18px;
      line-height: 1.65;
    }

    .list li::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 17px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--sage);
    }

    .example {
      background: var(--leaf-pale);
      border: 1px solid #d5e5da;
      border-radius: var(--radius);
      padding: 24px 28px 18px;
      margin: 30px 0;
    }

    .example figcaption {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--moss);
      font-weight: 800;
      margin-bottom: 12px;
    }

    .example__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--amber);
    }

    .example p {
      font-size: 17.5px;
      line-height: 1.72;
      margin: 0 0 0.9em;
    }

    .note {
      background: var(--amber-pale);
      border-radius: var(--radius);
      padding: 20px 26px 10px;
      margin: 28px 0;
    }

    .note__label {
      display: block;
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #96591a;
      font-weight: 800;
      margin-bottom: 9px;
    }

    .note p {
      font-size: 17px;
      line-height: 1.68;
      margin: 0 0 0.9em;
    }

    .tree {
      background: var(--cream);
      border: 2px solid var(--line);
      border-radius: var(--radius);
      padding: 24px 30px 20px;
      margin: 30px 0;
    }

    .tree__label {
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sky);
      font-weight: 800;
      margin: 0 0 10px;
    }

    .tree ol {
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: step;
    }

    .tree li {
      counter-increment: step;
      position: relative;
      padding: 9px 0 9px 42px;
      font-size: 17.5px;
      line-height: 1.6;
    }

    .tree li::before {
      content: counter(step);
      position: absolute;
      left: 0;
      top: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--sky-pale);
      color: var(--sky);
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: 800;
    }

    .table-scroll {
      margin: 28px 0;
    }

    .sources {
      list-style: none;
      margin: 14px 0 0;
      padding: 12px 0 0;
      border-top: 1px solid var(--line-soft);
    }

    .sources li {
      padding: 3px 0;
    }

    .sources a {
      font-size: 13.5px;
      color: var(--muted);
      text-decoration: none;
      word-break: break-word;
    }

    .sources a::before {
      content: '↗';
      color: var(--amber);
      margin-right: 7px;
    }

    .sources a:hover {
      color: var(--moss);
      text-decoration: underline;
    }
  `,
})
export class BlockRenderer {
  readonly blocks = input.required<Block[]>();

  /** Source links are long; show the host plus a trimmed path. */
  pretty(url: string): string {
    try {
      const parsed = new URL(url);
      const path = decodeURIComponent(parsed.pathname).replace(/\/$/, '');
      const tail = path.length > 44 ? `…${path.slice(-40)}` : path;
      return `${parsed.hostname.replace(/^www\./, '')}${tail}`;
    } catch {
      return url;
    }
  }
}
