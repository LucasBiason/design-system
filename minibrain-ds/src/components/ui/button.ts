import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize-html';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

export type ButtonOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  ariaLabel?: string;
  ariaBusy?: boolean;
  ariaInvalid?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent) => void;
  class?: string;
  children?: HTMLElement | string;
};

// ─── btnClass ─────────────────────────────────────────────────────────────────
//
// Retorna a lista de classes .mbds-button-* aplicáveis. Sempre inclui .mbds-button
// (base) + variante + (opcional) modificador de tamanho/ícone.
//
// Exemplos:
//   btnClass('default', 'default')  → 'mbds-button mbds-button-default'
//   btnClass('outline', 'sm')       → 'mbds-button mbds-button-sm mbds-button-outline'
//   btnClass('ghost',   'icon-lg')  → 'mbds-button mbds-button-icon-lg mbds-button-ghost'

export function btnClass(variant: ButtonVariant | string = 'default', size: ButtonSize | string = 'default'): string {
  const base = 'mbds-button';
  const sizeClass =
    size === 'icon'    ? 'mbds-button-icon' :
    size === 'icon-sm' ? 'mbds-button-icon-sm' :
    size === 'icon-lg' ? 'mbds-button-icon-lg' :
    size === 'sm'      ? 'mbds-button-sm' :
    size === 'lg'      ? 'mbds-button-lg' :
                         '';
  const variantClass = `mbds-button-${variant}`;
  return [base, sizeClass, variantClass].filter(Boolean).join(' ');
}

// ─── createButton ─────────────────────────────────────────────────────────────

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const { variant = 'default', size = 'default', label, ariaLabel, disabled, type = 'button', onClick, children } = options;

  const el = document.createElement('button');
  el.type = type;
  el.className = cn(btnClass(variant, size), options.class);

  if (label) el.textContent = label;
  if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
  if (options.ariaBusy) el.setAttribute('aria-busy', 'true');
  if (options.ariaInvalid) el.setAttribute('aria-invalid', 'true');
  if (disabled) el.disabled = true;

  if (children) {
    if (typeof children === 'string') {
      // PATCH: security — sanitizeHtml obrigatório em innerHTML (ver guideline 09-seguranca-xss.md)
      el.innerHTML = sanitizeHtml(children);
    } else {
      el.appendChild(children);
    }
  }

  if (onClick) el.addEventListener('click', onClick);

  return el;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

import { Plus, Trash2, Pencil, ChevronRight, Download, Loader2, X } from 'lucide';

export type ButtonIconKind = 'plus' | 'trash' | 'pencil' | 'chevron-right' | 'download' | 'loader' | 'x';

type LucideIconNode = [string, Record<string, string>];

const BUTTON_ICON_MAP: Record<ButtonIconKind, LucideIconNode[]> = {
  'plus':          Plus         as unknown as LucideIconNode[],
  'trash':         Trash2       as unknown as LucideIconNode[],
  'pencil':        Pencil       as unknown as LucideIconNode[],
  'chevron-right': ChevronRight as unknown as LucideIconNode[],
  'download':      Download     as unknown as LucideIconNode[],
  'loader':        Loader2      as unknown as LucideIconNode[],
  'x':             X            as unknown as LucideIconNode[],
};

export type ButtonIconSize = 'sm' | 'md' | 'lg';

export function createButtonIcon(
  kind: ButtonIconKind,
  options: { size?: ButtonIconSize; spin?: boolean; className?: string } = {},
): SVGSVGElement {
  const { size = 'md', spin, className } = options;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  // Classes próprias .mbds-* — independentes de Tailwind e de cascade externa.
  // .mbds-button-icon-svg dá width/height base (1rem); modificador -<size> ajusta.
  svg.setAttribute(
    'class',
    cn('mbds-button-icon-svg', `mbds-button-icon-svg-${size}`, spin && 'mbds-spin', className),
  );

  for (const [tag, attrs] of BUTTON_ICON_MAP[kind]) {
    const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) child.setAttribute(k, v);
    svg.appendChild(child);
  }
  return svg;
}
