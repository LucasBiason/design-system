import { sanitizeHtml } from '@/lib/sanitize-html';
import { createComponentDemo } from '@/components/ComponentDemo';
import { createCard } from '@/components/ui/card';

export interface DocsAnatomyProps {
  title: string;
  items: string[];
  structureCode: string;
  structureLabel?: string;
}

export function createDocsAnatomy(props: DocsAnatomyProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'anatomia';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;

  const inner = document.createElement('div');
  inner.className = 'mbds-stack mbds-w-full';
  inner.dataset.spacing = 'md';

  const ol = document.createElement('ol');
  ol.className = 'mbds-stack mbds-text-body mbds-list-none';
  ol.dataset.spacing = 'sm';
  props.items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'mbds-row list-none';
    li.dataset.spacing = 'sm';
    li.dataset.align = 'start';
    li.innerHTML = `
      <span class="mbds-pill" data-tone="primary">${i + 1}</span>
      <span>${sanitizeHtml(item)}</span>`;
    ol.appendChild(li);
  });

  const codeBlock = createCard({ className: 'mbds-bg-muted-soft mbds-border-soft mbds-shadow-none mbds-p-4 mbds-overflow-x' });
  if (props.structureLabel) {
    const label = document.createElement('p');
    label.className = 'mbds-text-caption mbds-text-muted-foreground mbds-mb-2';
    label.textContent = props.structureLabel;
    codeBlock.appendChild(label);
  }
  const pre = document.createElement('pre');
  pre.className = 'mbds-font-mono mbds-text-body mbds-whitespace-pre';
  pre.textContent = props.structureCode;
  codeBlock.appendChild(pre);

  inner.append(ol, codeBlock);
  const demo = createComponentDemo(inner);
  section.append(h2, demo);
  return section;
}
