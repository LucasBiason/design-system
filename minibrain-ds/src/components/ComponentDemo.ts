import { createCard } from '@/components/ui/card';
export function createComponentDemo(child?: HTMLElement): HTMLElement {
  const el = createCard({ className: 'mbds-docs-demo' });
  if (child) el.appendChild(child);
  return el;
}
