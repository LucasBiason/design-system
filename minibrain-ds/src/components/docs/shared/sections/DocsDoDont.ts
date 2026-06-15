import { sanitizeHtml } from '@/lib/sanitize-html';
import { createCard } from '@/components/ui/card';

export interface DocsDoDontPair {
  doLabel: string;
  dontLabel: string;
  doCaption: string;
  dontCaption: string;
  doPreviewFactory: () => HTMLElement;
  dontPreviewFactory: () => HTMLElement;
}

export interface DocsDoDontProps {
  title: string;
  pairs: DocsDoDontPair[];
}

export function createDocsDoDont(props: DocsDoDontProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'do-dont';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;

  const card = createCard({ className: 'mbds-cluster mbds-p-4 mbds-mt-2' });

  const inner = document.createElement('div');
  inner.className = 'mbds-stack mbds-w-full';
  inner.dataset.spacing = 'xl';

  for (const pair of props.pairs) {
    const grid = document.createElement('div');
    grid.className = 'mbds-grid';
    grid.dataset.cols = '2';
    grid.dataset.spacing = 'lg';

    // DO column
    const doCol = document.createElement('div');
    doCol.className = 'mbds-stack';
    doCol.dataset.spacing = 'sm';
    doCol.innerHTML = `
      <div class="mbds-cluster mbds-text-success" data-spacing="sm">
        <span class="mbds-pill" data-tone="success">✓</span>
        <span class="mbds-text-body mbds-font-semibold mbds-uppercase mbds-tracking-wider">${sanitizeHtml(pair.doLabel)}</span>
      </div>`;
    const doBox = createCard({ className: 'mbds-border-success-soft mbds-bg-success-soft mbds-shadow-none mbds-p-4' });
    doBox.appendChild(pair.doPreviewFactory());
    const doCaption = document.createElement('p');
    doCaption.className = 'mbds-text-body mbds-text-muted-foreground mbds-italic mbds-px-1';
    doCaption.textContent = pair.doCaption;
    doCol.append(doBox, doCaption);

    // DON'T column
    const dontCol = document.createElement('div');
    dontCol.className = 'mbds-stack';
    dontCol.dataset.spacing = 'sm';
    dontCol.innerHTML = `
      <div class="mbds-cluster mbds-text-destructive" data-spacing="sm">
        <span class="mbds-pill" data-tone="destructive">✗</span>
        <span class="mbds-text-body mbds-font-semibold mbds-uppercase mbds-tracking-wider">${sanitizeHtml(pair.dontLabel)}</span>
      </div>`;
    const dontBox = createCard({ className: 'mbds-border-destructive-soft mbds-bg-destructive-soft mbds-shadow-none mbds-p-4' });
    dontBox.appendChild(pair.dontPreviewFactory());
    const dontCaption = document.createElement('p');
    dontCaption.className = 'mbds-text-body mbds-text-muted-foreground mbds-italic mbds-px-1';
    dontCaption.textContent = pair.dontCaption;
    dontCol.append(dontBox, dontCaption);

    grid.append(doCol, dontCol);
    inner.appendChild(grid);
  }

  card.appendChild(inner);
  section.append(h2, card);
  return section;
}
