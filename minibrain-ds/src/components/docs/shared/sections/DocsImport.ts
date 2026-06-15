export interface DocsImportProps {
  title: string;
  description?: string;
  code: string;
  secondaryCode?: string;
  secondaryDescription?: string;
  /**
   * Slug do componente para tracking GA4 (ex.: "alert"). Informativo — o
   * snippet atualmente é apenas um bloco `<code>` estático, sem botão de
   * "copiar". Se uma futura iteração adicionar o botão, ele deverá receber
   * `data-track="code"` + `data-track-id="{slug}:code:import-primary"` (ou
   * `import-secondary`) + `data-track-label="Copiar import"`.
   */
  componentSlug?: string;
}

export function createDocsImport(props: DocsImportProps): HTMLElement {
  const section = document.createElement('section');
  section.id = 'importacao';

  const h2 = document.createElement('h2');
  h2.className = 'mbds-section-title';
  h2.textContent = props.title;
  section.appendChild(h2);

  if (props.description) {
    const p = document.createElement('p');
    p.className = 'mbds-text-body mbds-text-muted-foreground mbds-mb-4';
    p.textContent = props.description;
    section.appendChild(p);
  }

  const codeBlock = document.createElement('pre');
  codeBlock.className = 'mbds-code-block';
  const codeEl = document.createElement('code');
  codeEl.textContent = props.code;
  codeBlock.appendChild(codeEl);
  section.appendChild(codeBlock);

  if (props.secondaryCode) {
    if (props.secondaryDescription) {
      const p2 = document.createElement('p');
      p2.className = 'mbds-text-body mbds-text-muted-foreground mbds-mt-4 mbds-mb-4';
      p2.textContent = props.secondaryDescription;
      section.appendChild(p2);
    }
    const codeBlock2 = document.createElement('pre');
    codeBlock2.className = 'mbds-code-block mbds-mt-2';
    const codeEl2 = document.createElement('code');
    codeEl2.textContent = props.secondaryCode;
    codeBlock2.appendChild(codeEl2);
    section.appendChild(codeBlock2);
  }

  return section;
}
