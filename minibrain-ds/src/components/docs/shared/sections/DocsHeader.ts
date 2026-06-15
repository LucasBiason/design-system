import { createBadge } from '@/components/ui/badge';
import { createLanguageSwitcher } from '@/components/product/LanguageSwitcher';
import { sanitizeHtml } from '@/lib/sanitize-html';

export interface DocsHeaderProps {
  title: string;
  description: string;
  category: string;
  type: string;
  installNote?: string;
}

export function createDocsHeader(props: DocsHeaderProps): HTMLElement {
  const header = document.createElement('header');
  // ds-docs (tipografia base) + mbds-stack para ritmo interno + borda inferior soft
  header.className = 'ds-docs mbds-stack mbds-border-b-soft';
  header.dataset.spacing = 'md';
  // Padding-bottom via inline style — variável conforme viewport não é trivial em CSS puro
  header.style.paddingBottom = 'var(--spacing-6)';

  // Linha superior: badges à esquerda + language switcher à direita (spacer-start)
  const top = document.createElement('div');
  top.className = 'mbds-cluster';
  top.dataset.spacing = 'sm';
  top.appendChild(createBadge({ text: props.category, variant: 'secondary', className: 'mbds-bg-primary-soft mbds-text-primary mbds-border-primary-soft mbds-font-medium' }));
  top.appendChild(createBadge({ text: props.type, variant: 'outline', className: 'mbds-text-muted-foreground mbds-font-normal' }));
  const switcher = createLanguageSwitcher();
  switcher.classList.add('mbds-spacer-start');
  top.appendChild(switcher);
  header.appendChild(top);

  // Bloco de título + descrição
  const content = document.createElement('div');
  content.className = 'mbds-stack';
  content.dataset.spacing = 'sm';

  const h1 = document.createElement('h1');
  h1.className = 'mbds-text-h1 mbds-text-foreground';
  h1.textContent = props.title;

  const desc = document.createElement('p');
  desc.className = 'mbds-text-lead mbds-text-muted-foreground mbds-max-w-prose';
  desc.textContent = props.description;

  content.append(h1, desc);
  header.appendChild(content);

  if (props.installNote) {
    const installRow = document.createElement('div');
    installRow.className = 'mbds-cluster mbds-text-body mbds-text-muted-foreground';
    installRow.dataset.spacing = 'sm';
    installRow.innerHTML = `<span class="mbds-cluster" data-spacing="xs"><code class="mbds-code-inline">${sanitizeHtml(props.installNote)}</code></span>`;
    header.appendChild(installRow);
  }

  return header;
}
