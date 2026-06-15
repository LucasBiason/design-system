import type { Meta, StoryObj } from '@storybook/html';
import { within, expect, waitFor } from 'storybook/test';
import { createDialog } from './dialog';
import { createButton } from './button';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  tags: ['overlay'],
  title: 'UI/Dialog/Composicoes',
  parameters: {
    actions: { disable: true },
    layout: 'centered',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Composicoes reais do Dialog: confirmação por e-mail, edição de perfil e pré-visualização de mídia.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInputField(labelText: string, type: string, value: string): HTMLLabelElement {
  const label = document.createElement('label');
  label.className = 'mbds-stack mbds-text-body';
  label.dataset.spacing = 'xs';
  const span = document.createElement('span');
  span.className = 'mbds-font-medium';
  span.textContent = labelText;
  const input = document.createElement('input');
  input.className = 'mbds-border-default mbds-rounded-md';
  input.style.padding = '0.5rem 0.75rem';
  input.type = type;
  input.value = value;
  label.append(span, input);
  return label;
}

function buildTextareaField(labelText: string, value: string): HTMLLabelElement {
  const label = document.createElement('label');
  label.className = 'mbds-stack mbds-text-body';
  label.dataset.spacing = 'xs';
  const span = document.createElement('span');
  span.className = 'mbds-font-medium';
  span.textContent = labelText;
  const ta = document.createElement('textarea');
  ta.className = 'mbds-border-default mbds-rounded-md';
  ta.style.padding = '0.5rem 0.75rem';
  ta.rows = 3;
  ta.value = value;
  label.append(span, ta);
  return label;
}

function makeFooter(cancelLabel: string, actionLabel: string): HTMLElement {
  const cancel = createButton({ variant: 'outline', label: cancelLabel });
  const action = createButton({ variant: 'default', label: actionLabel });
  const footer = document.createElement('div');
  footer.className = 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';
  footer.appendChild(cancel);
  footer.appendChild(action);
  return footer;
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ConfirmEmail: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Confirmação de envio de e-mail com mensagem informativa e ação primária neutra.',
      },
    },
  },
  render: () => {
    const body = document.createElement('div');
    body.className = 'mbds-text-body mbds-text-muted-foreground';
    body.textContent = 'Vamos enviar um link para maria@exemplo.com. Confirme o endereço antes de prosseguir.';
    const dialog = createDialog({
      trigger: createButton({ variant: 'default', label: 'Enviar link' }),
      title: 'Confirmar e-mail',
      description: 'Verifique o endereço antes de enviar o link de acesso.',
      content: body,
      footer: makeFooter('Cancelar', 'Enviar link'),
    });
    queueMicrotask(() => dialog.querySelector<HTMLElement>('button')?.click());
    return dialog;
  },
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toHaveAccessibleName(/Confirmar e-mail/i);
  },
};

export const ProfileEdit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Edição de perfil em formulário modal — caso de uso canônico do Dialog. Combina com Form.',
      },
    },
  },
  render: () => {
    const form = document.createElement('form');
    form.className = 'mbds-stack';
    form.dataset.spacing = 'md';
    form.append(
      buildInputField('Nome de exibição', 'text', 'Maria Souza'),
      buildInputField('Função', 'text', 'Designer'),
      buildTextareaField('Bio', 'Apaixonada por design systems.'),
    );
    const dialog = createDialog({
      trigger: createButton({ variant: 'outline', label: 'Editar perfil' }),
      title: 'Editar perfil',
      description: 'Atualize suas informações pessoais. As mudanças são salvas ao confirmar.',
      content: form,
      footer: makeFooter('Cancelar', 'Salvar alterações'),
    });
    queueMicrotask(() => dialog.querySelector<HTMLElement>('button')?.click());
    return dialog;
  },
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await waitFor(() =>
      expect(within(dialog).getByText(/Nome de exibição/i)).toBeVisible(),
    );
  },
};

export const MediaPreview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pré-visualização de mídia com botão Close visível. Bom uso do Dialog quando a ação é apenas "ver".',
      },
    },
  },
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'mbds-w-full mbds-bg-muted mbds-rounded-md mbds-text-caption mbds-text-muted-foreground';
    wrap.style.aspectRatio = '16 / 9';
    wrap.style.display = 'grid';
    wrap.style.placeItems = 'center';
    wrap.textContent = 'Pré-visualização da mídia';
    const dialog = createDialog({
      trigger: createButton({ variant: 'outline', label: 'Pré-visualizar' }),
      title: 'Capa do post',
      description: 'Pré-visualização em tamanho real.',
      content: wrap,
    });
    queueMicrotask(() => dialog.querySelector<HTMLElement>('button')?.click());
    return dialog;
  },
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(within(dialog).getByLabelText('Close')).toBeInTheDocument();
  },
};
