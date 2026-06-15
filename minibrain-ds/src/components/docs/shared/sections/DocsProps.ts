import { sanitizeHtml } from '@/lib/sanitize-html';
import { createCard } from '@/components/ui/card';
import { createTable, createTableHeader, createTableBody, createTableRow, createTableHead, createTableCell } from '@/components/ui/table';

export interface DocsPropItem {
  name: string; type: string; defaultValue: string; required: string; description: string;
}
export interface DocsPropsTableDef {
  title?: string;
  cols: { prop: string; type: string; default: string; required: string; description: string };
  items: DocsPropItem[];
}
export interface DocsPropsProps {
  title: string;
  tables: DocsPropsTableDef[];
  interfaceCode?: string;
  extensibilityTitle?: string;
  extensibilityNotes?: string;
  extensibilityCode?: string;
}

function buildTable(def: DocsPropsTableDef): DocumentFragment {
  const frag = document.createDocumentFragment();

  if (def.title) {
    const h3 = document.createElement('h3');
    h3.className = 'mbds-text-base mbds-font-semibold';
    h3.textContent = def.title;
    frag.appendChild(h3);
  }

  const wrapper = createCard({ className: 'mbds-p-4 mbds-overflow-x' });

  const { wrapper: tableWrapper, table } = createTable('mbds-w-full mbds-text-body');

  const thead = createTableHeader();
  const headerRow = createTableRow('mbds-border-b mbds-bg-muted-soft');
  headerRow.appendChild(createTableHead(def.cols.prop, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(def.cols.type, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(def.cols.default, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(def.cols.required, 'mbds-p-2 mbds-font-semibold'));
  headerRow.appendChild(createTableHead(def.cols.description, 'mbds-p-2 mbds-font-semibold'));
  thead.appendChild(headerRow);

  const tbody = createTableBody();
  def.items.forEach(item => {
    const row = createTableRow('mbds-border-b mbds-hover-bg-muted-faint');
    row.appendChild(createTableCell(item.name, 'mbds-p-2 mbds-font-mono mbds-font-bold mbds-text-primary'));
    row.appendChild(createTableCell(item.type, 'mbds-p-2 mbds-font-mono mbds-text-muted-foreground'));
    row.appendChild(createTableCell(item.defaultValue, 'mbds-p-2 mbds-text-muted-foreground'));
    row.appendChild(createTableCell(item.required, 'mbds-p-2 mbds-text-muted-foreground'));
    row.appendChild(createTableCell(item.description, 'mbds-p-2 mbds-text-muted-foreground'));
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  wrapper.appendChild(tableWrapper);
  frag.appendChild(wrapper);

  return frag;
}

export function createDocsProps(props: DocsPropsProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'propriedades';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;
  section.appendChild(h2);

  const container = document.createElement('div');
  container.className = 'mbds-stack';
  container.dataset.spacing = 'xl';

  props.tables.forEach(def => container.appendChild(buildTable(def)));

  if (props.interfaceCode) {
    const codeBlock = document.createElement('pre');
    codeBlock.className = 'mbds-code-block';
    const codeEl = document.createElement('code');
    codeEl.textContent = props.interfaceCode;
    codeBlock.appendChild(codeEl);
    container.appendChild(codeBlock);
  }

  if (props.extensibilityTitle) {
    const extBlock = document.createElement('div');
    extBlock.className = 'mbds-stack';
    extBlock.dataset.spacing = 'sm';
    const extH3 = document.createElement('h3');
    extH3.className = 'mbds-text-base mbds-font-semibold';
    extH3.textContent = props.extensibilityTitle;
    extBlock.appendChild(extH3);
    if (props.extensibilityNotes) {
      const extNotes = document.createElement('div');
      extNotes.className = 'mbds-text-body mbds-text-muted-foreground mbds-leading-relaxed';
      extNotes.innerHTML = sanitizeHtml(props.extensibilityNotes);
      extBlock.appendChild(extNotes);
    }
    if (props.extensibilityCode) {
      const extCode = document.createElement('pre');
      extCode.className = 'mbds-code-block';
      const codeEl = document.createElement('code');
      codeEl.textContent = props.extensibilityCode;
      extCode.appendChild(codeEl);
      extBlock.appendChild(extCode);
    }
    container.appendChild(extBlock);
  }

  section.appendChild(container);
  return section;
}
