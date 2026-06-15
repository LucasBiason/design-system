# Tasks — Rebrand Nord do MiniBrain Design System

Referencia: spec.md, plan.md. Marcar `[x]` ao concluir. Cada fase termina em commit.

## Fase 0 — Spec & setup

- [x] Criar branch `feature/nord-rebrand`
- [x] Escrever spec.md
- [x] Escrever plan.md
- [x] Escrever tasks.md
- [x] Investigar regeneracao tokens.json -> tokens.css (decisao D1)
- [ ] Revisao do plano pelo dono (gate Fase 0)
- [ ] Commit: `docs(nord-rebrand): spec, plan e tasks (fase 0)`

## Fase 1 — Tokens Nord

- [x] Adicionar `nord0..nord15` em `tokens.json` (color.base)
- [x] Reapontar `color.semantic.*` / `chart` / `sidebar` (light) para Nord
- [x] Reapontar bloco dark (`tokens.css` .dark) para Nord
- [x] Atualizar `docs/shared/themes/default.css` (.tema-default / .dark.tema-default)
- [x] Ajustar luminosidade para WCAG AA (primary, accent, destructive, success, warning)
- [x] Criar gate `scripts/check-contrast.mjs` e verificar AA (light+dark, todos OK)
- [~] `scripts/build-tokens.mjs` DEFERIDO (D1: tokens.json e fonte parcial; ver plan.md)
- [ ] Build/preview React (Storybook Foundations > Cores e Temas) — aguardando npm install
- [ ] Commit: `feat(nord-rebrand): tokens Nord como identidade padrao (fase 1)`

## Fase 2 — Tipografia

- [x] Definir Raleway (headings) + Open Sans (corpo) em `fonts.css` e `tokens.json`
- [x] Adicionar token `--font-family-heading` + mapeamento `--font-heading` e regra base h1-h6
- [x] Atualizar `@import` Google Fonts: React/Vue/Svelte `globals.css`
- [x] Atualizar MiniBrain `index.html` + `preview-head.html`
- [x] Commit: `feat(nord-rebrand): tema Nord + tipografia (fases 1-2)`

## Fase 3 — Identidade visual

- [x] Recolorir `branding/*.svg` (logo, simbolo, favicon, og-image) para Nord (Frost)
- [x] Recolorir `<stack>/.storybook/brand-logo.svg` (4 stacks)
- [~] Logo provisorio: portfolio nao tinha SVG; recolorido o simbolo "MiniBrain" existente (lapidar depois)
- [ ] (futuro) `theme-config.ts` dominios / README sobre paleta — opcional
- [x] Commit: `feat(nord-rebrand): branding recolorido para Nord (fase 3)`

## Fase 4 — Registro e sincronizacao

- [x] `.storybook/preview.ts` das 4 stacks: default ja = Nord (sem tema extra, marca e o default)
- [x] Rodar `node scripts/audit.mjs --all` — sem divergencias novas (so avisos pre-existentes de translation)

## Fase 5 — Validacao final

- [x] `npm run build` React (tsc + vite) — VERDE apos fix TS6133
- [x] `scripts/check-contrast.mjs` — WCAG AA OK (light+dark)
- [~] `npm run lint` React — 206 erros PRE-EXISTENTES (lib/motion,i18n,withAutoDocsTab), nao introduzidos pelo rebrand; fora do escopo
- [ ] build/test Vue/Svelte/MiniBrain — pendente (mudancas sao CSS compartilhado; nao adicionam erro de tipo)
- [ ] `npm run test-storybook` (axe AA) — pendente (recomendado antes do merge)
- [ ] Chromatic baseline — pendente (se token configurado)

## Fase 6 — Integracao SecondBrain

- [ ] Re-clonar full e adicionar submodulo em `engines/MiniBrainWork`
- [ ] Atualizar `.gitmodules` do SecondBrain
- [ ] Apontar skills `frontend/{nord-theme,react,css,design}` para o DS
- [ ] Sincronizar skill `nord-theme` com os tokens finais
- [ ] Commit (no SecondBrain): `feat(frontend): DS MiniBrain como referencia de layout`
