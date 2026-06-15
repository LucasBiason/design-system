import { createCard } from '@/components/ui/card';
import { createTable, createTableHeader, createTableBody, createTableRow, createTableHead, createTableCell } from '@/components/ui/table';

export interface DocsStateItem { label: string; trigger: string; behavior: string }

export interface DocsStatesProps {
  title: string;
  cols: { state: string; trigger: string; behavior: string };
  items: DocsStateItem[];
}

export function createDocsStates(props: DocsStatesProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'estados';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;

  const wrapper = createCard({ className: 'mbds-p-4 mbds-overflow-x' });

  const { wrapper: tableWrapper, table } = createTable('mbds-w-full mbds-text-body');

  const thead = createTableHeader();
  const headerRow = createTableRow('mbds-border-b mbds-bg-muted-soft');
  headerRow.appendChild(createTableHead(props.cols.state, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(props.cols.trigger, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(props.cols.behavior, 'mbds-p-2 mbds-font-semibold'));
  thead.appendChild(headerRow);

  const tbody = createTableBody();
  props.items.forEach(item => {
    const row = createTableRow('mbds-border-b mbds-hover-bg-muted-faint');
    row.appendChild(createTableCell(item.label, 'mbds-p-2 mbds-font-medium'));
    row.appendChild(createTableCell(item.trigger, 'mbds-p-2 mbds-text-muted-foreground'));
    row.appendChild(createTableCell(item.behavior, 'mbds-p-2 mbds-text-muted-foreground'));
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  wrapper.appendChild(tableWrapper);

  section.append(h2, wrapper);
  return section;
}
