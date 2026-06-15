// Customização da UI do Storybook (sidebar/topbar) — substitui a marca Storybook
// pela marca MiniBrain. Roda no manager (iframe externo), não no preview.
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
// @ts-expect-error — Storybook manager builder serve SVG como URL string em runtime
import brandImage from './brand-logo.svg';

const minibrain = create({
  base: 'light',
  brandTitle: 'MiniBrain',
  brandUrl: '/',
  brandImage,
  brandTarget: '_self',
});

addons.setConfig({ theme: minibrain });
