import { createCard } from '@/components/ui/card';
import { createTable, createTableHeader, createTableBody, createTableRow, createTableHead, createTableCell } from '@/components/ui/table';

export interface DocsTokenItem { token: string; value: string; description: string }
export interface DocsTokensProps {
  title: string;
  cols: { token: string; value: string; description: string };
  items: DocsTokenItem[];
  customizationTitle?: string;
  customizationCode?: string;
}

export function createDocsTokens(props: DocsTokensProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'tokens';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;
  section.appendChild(h2);

  const container = document.createElement('div');
  container.className = 'mbds-stack';
  container.dataset.spacing = 'lg';

  const tableWrapper = createCard({ className: 'mbds-p-4 mbds-overflow-x' });

  const { wrapper: innerTableWrapper, table } = createTable('mbds-w-full mbds-text-body');

  const thead = createTableHeader();
  const headerRow = createTableRow('mbds-border-b mbds-bg-muted-soft');
  headerRow.appendChild(createTableHead(props.cols.token, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(props.cols.value, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(props.cols.description, 'mbds-p-2 mbds-font-semibold'));
  thead.appendChild(headerRow);

  const tbody = createTableBody();
  props.items.forEach(item => {
    const row = createTableRow('mbds-border-b mbds-hover-bg-muted-faint');
    row.appendChild(createTableCell(item.token, 'mbds-p-2 mbds-font-mono mbds-text-primary'));
    row.appendChild(createTableCell(item.value, 'mbds-p-2 mbds-font-mono mbds-text-muted-foreground'));
    row.appendChild(createTableCell(item.description, 'mbds-p-2 mbds-text-muted-foreground'));
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  tableWrapper.appendChild(innerTableWrapper);
  container.appendChild(tableWrapper);

  if (props.customizationTitle) {
    const customBlock = document.createElement('div');
    customBlock.className = 'mbds-stack';
    customBlock.dataset.spacing = 'sm';
    const customH3 = document.createElement('h3');
    customH3.className = 'mbds-text-base mbds-font-semibold';
    customH3.textContent = props.customizationTitle;
    customBlock.appendChild(customH3);
    if (props.customizationCode) {
      const codeBlock = document.createElement('pre');
      codeBlock.className = 'mbds-code-block';
      const codeEl = document.createElement('code');
      codeEl.textContent = props.customizationCode;
      codeBlock.appendChild(codeEl);
      customBlock.appendChild(codeBlock);
    }
    container.appendChild(customBlock);
  }

  section.appendChild(container);
  return section;
}
