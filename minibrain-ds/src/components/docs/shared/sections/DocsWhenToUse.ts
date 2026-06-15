import { sanitizeHtml } from '@/lib/sanitize-html';
import { createCard } from '@/components/ui/card';
import { createTable, createTableHeader, createTableBody, createTableRow, createTableHead, createTableCell } from '@/components/ui/table';

export interface DocsWhenToUseScenario { s: string; u: string; a: string }
export interface DocsWhenToUseUXRow { element: string; do: string; dont: string; rules?: string }

export interface DocsWhenToUseProps {
  title: string;
  guidelines: { title: string; items: string[] };
  scenarios: { title?: string; cols: { scenario: string; use: string; alternative: string }; items: DocsWhenToUseScenario[] };
  uxWriting?: { title: string; cols: { element: string; do: string; dont: string; rules?: string }; items: DocsWhenToUseUXRow[] };
  do: { title: string; items: string[] };
  dont: { title: string; items: string[] };
}

export function createDocsWhenToUse(props: DocsWhenToUseProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'quando-usar';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;

  const card = createCard({ className: 'mbds-p-4 mbds-stack' });
  card.dataset.spacing = 'lg';

  // ── Guidelines ───────────────────────────────────────────────────────────────
  const guidelinesBlock = createCard({ className: 'mbds-bg-muted-soft mbds-border-soft mbds-p-4 mbds-stack' });
  guidelinesBlock.dataset.spacing = 'sm';
  const guidelinesTitle = document.createElement('h3');
  guidelinesTitle.className = 'mbds-font-medium mbds-text-body';
  guidelinesTitle.textContent = props.guidelines.title;
  guidelinesBlock.appendChild(guidelinesTitle);

  const guidelinesList = document.createElement('ul');
  guidelinesList.className = 'mbds-list-disc mbds-stack mbds-text-body mbds-text-muted-foreground';
  guidelinesList.dataset.spacing = 'sm';
  props.guidelines.items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = sanitizeHtml(item);
    guidelinesList.appendChild(li);
  });
  guidelinesBlock.appendChild(guidelinesList);

  // ── Scenarios table ───────────────────────────────────────────────────────────
  const scenariosBlock = createCard({ className: 'mbds-overflow-x mbds-p-4' });

  const { wrapper: scenariosTableWrapper, table: scenariosTable } = createTable('mbds-w-full mbds-border-collapse mbds-text-body');

  const scenariosThead = createTableHeader();
  const scenariosHeaderRow = createTableRow('mbds-border-b mbds-bg-muted-soft mbds-font-medium');
  scenariosHeaderRow.appendChild(createTableHead(props.scenarios.cols.scenario, 'mbds-p-2'));
  scenariosHeaderRow.appendChild(createTableHead(props.scenarios.cols.use, 'mbds-p-2'));
  scenariosHeaderRow.appendChild(createTableHead(props.scenarios.cols.alternative, 'mbds-p-2'));
  scenariosThead.appendChild(scenariosHeaderRow);

  const scenariosTbody = createTableBody();
  props.scenarios.items.forEach(item => {
    const row = createTableRow('mbds-border-b mbds-hover-bg-muted-faint');
    row.appendChild(createTableCell(item.s, 'mbds-p-2'));
    row.appendChild(createTableCell(item.u, 'mbds-p-2 mbds-font-medium mbds-text-primary'));
    row.appendChild(createTableCell(item.a, 'mbds-p-2 mbds-text-muted-foreground'));
    scenariosTbody.appendChild(row);
  });

  scenariosTable.append(scenariosThead, scenariosTbody);
  scenariosBlock.appendChild(scenariosTableWrapper);

  // ── UX Writing table (optional) ───────────────────────────────────────────────
  let uxBlock: HTMLElement | null = null;
  if (props.uxWriting) {
    const ux = props.uxWriting;
    uxBlock = document.createElement('div');
    uxBlock.className = 'mbds-stack';
    uxBlock.dataset.spacing = 'sm';

    const uxTitle = document.createElement('h3');
    uxTitle.className = 'mbds-font-medium mbds-text-body';
    uxTitle.textContent = ux.title;
    uxBlock.appendChild(uxTitle);

    const uxTableWrap = createCard({ className: 'mbds-overflow-x mbds-p-4' });

    const { wrapper: uxInnerTableWrapper, table: uxTable } = createTable('mbds-w-full mbds-border-collapse mbds-text-body');

    const uxThead = createTableHeader();
    const uxHeaderRow = createTableRow('mbds-border-b mbds-bg-muted-soft');
    uxHeaderRow.appendChild(createTableHead(ux.cols.element, 'mbds-p-2 mbds-font-semibold'));
    if (ux.cols.rules) {
      uxHeaderRow.appendChild(createTableHead(ux.cols.rules, 'mbds-p-2 mbds-font-semibold'));
    }

    const doHead = document.createElement('th');
    doHead.className = 'mbds-p-2 mbds-font-semibold mbds-text-success';
    doHead.innerHTML = `<span class="mbds-cluster" data-spacing="xs"><span class="mbds-pill" data-tone="success">✓</span>${sanitizeHtml(ux.cols.do)}</span>`;
    uxHeaderRow.appendChild(doHead);

    const dontHead = document.createElement('th');
    dontHead.className = 'mbds-p-2 mbds-font-semibold mbds-text-destructive';
    dontHead.innerHTML = `<span class="mbds-cluster" data-spacing="xs"><span class="mbds-pill" data-tone="destructive">✗</span>${sanitizeHtml(ux.cols.dont)}</span>`;
    uxHeaderRow.appendChild(dontHead);

    uxThead.appendChild(uxHeaderRow);

    const uxTbody = createTableBody();
    ux.items.forEach(row => {
      const tr = createTableRow('mbds-border-b mbds-hover-bg-muted-faint');
      tr.appendChild(createTableCell(row.element, 'mbds-p-2 mbds-font-medium'));
      if (ux.cols.rules) {
        tr.appendChild(createTableCell(row.rules ?? '', 'mbds-p-2 mbds-text-muted-foreground'));
      }
      tr.appendChild(createTableCell(row.do, 'mbds-p-2 mbds-font-medium mbds-text-success'));
      tr.appendChild(createTableCell(row.dont, 'mbds-p-2 mbds-font-medium mbds-text-destructive'));
      uxTbody.appendChild(tr);
    });

    uxTable.append(uxThead, uxTbody);
    uxTableWrap.appendChild(uxInnerTableWrapper);
    uxBlock.appendChild(uxTableWrap);
  }

  // ── Do / Don't cards ──────────────────────────────────────────────────────────
  const doBlock = document.createElement('div');
  doBlock.className = 'mbds-grid';
  doBlock.dataset.cols = '2';
  doBlock.dataset.spacing = 'md';

  const doCard = createCard({ className: 'mbds-p-4' });
  const doTitle = document.createElement('h3');
  doTitle.className = 'mbds-mb-4 mbds-text-body mbds-font-semibold mbds-text-success mbds-cluster';
  doTitle.dataset.spacing = 'sm';
  doTitle.innerHTML = `<span class="mbds-pill" data-tone="success">✓</span>${sanitizeHtml(props.do.title)}`;
  const doList = document.createElement('ul');
  doList.className = 'mbds-list-disc mbds-stack mbds-text-body mbds-text-muted-foreground mbds-leading-relaxed';
  doList.dataset.spacing = 'sm';
  props.do.items.forEach(i => {
    const li = document.createElement('li');
    li.innerHTML = sanitizeHtml(i);
    doList.appendChild(li);
  });
  doCard.append(doTitle, doList);

  const dontCard = createCard({ className: 'mbds-p-4' });
  const dontTitle = document.createElement('h3');
  dontTitle.className = 'mbds-mb-4 mbds-text-body mbds-font-semibold mbds-text-destructive mbds-cluster';
  dontTitle.dataset.spacing = 'sm';
  dontTitle.innerHTML = `<span class="mbds-pill" data-tone="destructive">✗</span>${sanitizeHtml(props.dont.title)}`;
  const dontList = document.createElement('ul');
  dontList.className = 'mbds-list-disc mbds-stack mbds-text-body mbds-text-muted-foreground mbds-leading-relaxed';
  dontList.dataset.spacing = 'sm';
  props.dont.items.forEach(i => {
    const li = document.createElement('li');
    li.innerHTML = sanitizeHtml(i);
    dontList.appendChild(li);
  });
  dontCard.append(dontTitle, dontList);

  doBlock.append(doCard, dontCard);

  card.append(guidelinesBlock, scenariosBlock);
  if (uxBlock) card.append(uxBlock);
  card.append(doBlock);
  section.append(h2, card);
  return section;
}
