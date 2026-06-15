import type { Meta, StoryObj } from '@storybook/html';
import { userEvent, within, expect } from 'storybook/test';
import { createCarousel } from './carousel';
import { createCard, createCardContent } from './card';

// ─── Slide helpers ────────────────────────────────────────────────────────────

function buildSlide(label: string): HTMLElement {
  const card = createCard({ className: 'mbds-w-full mbds-cluster mbds-bg-muted-soft' });
  card.dataset.align = 'center';
  card.dataset.justify = 'center';
  card.style.aspectRatio = '16 / 9';
  const content = createCardContent({ className: 'mbds-cluster' });
  content.dataset.align = 'center';
  content.dataset.justify = 'center';
  const span = document.createElement('span');
  span.className = 'mbds-text-h2 mbds-font-semibold mbds-text-foreground';
  span.textContent = label;
  content.appendChild(span);
  card.appendChild(content);
  return card;
}

function buildSlides(count: number, prefix = 'Slide'): HTMLElement[] {
  return Array.from({ length: count }, (_, i) => buildSlide(`${prefix} ${i + 1}`));
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  tags: ['display'],
  title: 'UI/Carousel/Estados',
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    layout: 'centered',
    docs: {
      description: {
        component: 'Estados extremos do Carousel — primeiro slide (previous aria-disabled) e último slide (next aria-disabled).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const PrimeiroSlide: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'mbds-w-full mbds-max-w-md';
    wrap.appendChild(createCarousel({ items: buildSlides(4) }));
    return wrap;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Previous começa aria-disabled=true no primeiro slide', async () => {
      const prev = canvas.getByRole('button', { name: /previous slide/i });
      await expect(prev).toHaveAttribute('aria-disabled', 'true');
    });

    await step('Next está habilitado', async () => {
      const next = canvas.getByRole('button', { name: /next slide/i });
      await expect(next).toHaveAttribute('aria-disabled', 'false');
    });
  },
};

export const UltimoSlide: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'mbds-w-full mbds-max-w-md';
    wrap.appendChild(createCarousel({ items: buildSlides(3) }));
    return wrap;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Avança até o último slide', async () => {
      const next = canvas.getByRole('button', { name: /next slide/i });
      await userEvent.click(next);
      await userEvent.click(next);
    });

    await step('Next fica aria-disabled=true no último slide', async () => {
      const next = canvas.getByRole('button', { name: /next slide/i });
      await expect(next).toHaveAttribute('aria-disabled', 'true');
    });

    await step('Previous está habilitado no último slide', async () => {
      const prev = canvas.getByRole('button', { name: /previous slide/i });
      await expect(prev).toHaveAttribute('aria-disabled', 'false');
    });
  },
};
