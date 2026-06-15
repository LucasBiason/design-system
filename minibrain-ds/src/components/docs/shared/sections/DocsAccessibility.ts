import { sanitizeHtml } from '@/lib/sanitize-html';
import { createCard } from '@/components/ui/card';

export interface DocsKeyboardItem { key: string; description: string }
export interface DocsAccessibilityProps {
  title: string;
  summary: string;
  items: string[];
  keyboardTitle: string;
  keyboardItems: DocsKeyboardItem[];
}

export function createDocsAccessibility(props: DocsAccessibilityProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'acessibilidade';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;
  section.appendChild(h2);

  const container = createCard({ className: 'mbds-p-4 mbds-stack' });
  container.dataset.spacing = 'lg';

  const summaryBlock = document.createElement('div');
  summaryBlock.className = 'mbds-stack';
  summaryBlock.dataset.spacing = 'md';
  summaryBlock.innerHTML = `
    <p class="mbds-text-body mbds-text-muted-foreground mbds-leading-relaxed">${sanitizeHtml(props.summary)}</p>
    <ul class="mbds-stack mbds-text-body mbds-list-disc" data-spacing="sm">
      ${props.items.map(item => `<li class="mbds-leading-relaxed">${sanitizeHtml(item)}</li>`).join('')}
    </ul>`;

  const keyboardBlock = document.createElement('div');
  keyboardBlock.innerHTML = `<h3 class="mbds-text-base mbds-font-semibold mbds-mb-4">${sanitizeHtml(props.keyboardTitle)}</h3>`;
  const kbGrid = document.createElement('div');
  kbGrid.className = 'mbds-grid';
  kbGrid.dataset.cols = '2';
  kbGrid.dataset.spacing = 'sm';
  props.keyboardItems.forEach(item => {
    const card = createCard({ className: 'mbds-row mbds-border-none mbds-shadow-none mbds-bg-muted-soft mbds-p-4' });
    card.dataset.spacing = 'sm';
    card.dataset.align = 'start';
    const kbd = document.createElement('kbd');
    kbd.className = 'mbds-kbd';
    kbd.textContent = item.key;
    const span = document.createElement('span');
    span.className = 'mbds-text-body mbds-text-muted-foreground mbds-leading-relaxed';
    span.textContent = item.description;
    card.append(kbd, span);
    kbGrid.appendChild(card);
  });
  keyboardBlock.appendChild(kbGrid);

  container.append(summaryBlock, keyboardBlock);
  section.appendChild(container);
  return section;
}
