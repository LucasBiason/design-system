# Tasks — Rebrand Nord do Nortear Design System

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

- [ ] Definir Raleway (headings) + Open Sans (corpo) em `fonts.css` e `tokens.json`
- [ ] Atualizar `@import` Google Fonts: React/Vue/Svelte `globals.css`
- [ ] Atualizar Nortear `index.html` + `preview-head.html`
- [ ] Commit: `feat(nord-rebrand): tipografia Raleway/Open Sans (fase 2)`

## Fase 3 — Identidade visual

- [ ] Substituir `branding/*.svg` (logo, simbolo, favicon, og-image)
- [ ] Substituir `<stack>/.storybook/brand-logo.svg` (4 stacks)
- [ ] Atualizar `theme-config.ts` (dominios) e textos de README sobre paleta
- [ ] Commit: `feat(nord-rebrand): identidade visual Nord (fase 3)`

## Fase 4 — Registro e sincronizacao

- [ ] Revisar `.storybook/preview.ts` das 4 stacks (default = Nord)
- [ ] Rodar `node scripts/audit.mjs --all --json` e corrigir divergencias
- [ ] Commit: `chore(nord-rebrand): sincronizacao cross-stack (fase 4)`

## Fase 5 — Validacao final

- [ ] `npm run build` (4 stacks)
- [ ] `npm run lint` (4 stacks)
- [ ] `npm run test` (React)
- [ ] `npm run test-storybook` (4 stacks, axe AA)
- [ ] Chromatic baseline (se configurado)
- [ ] Checklist de aceitacao da spec satisfeito
- [ ] Commit: `test(nord-rebrand): validacao e baseline (fase 5)`

## Fase 6 — Integracao SecondBrain

- [ ] Re-clonar full e adicionar submodulo em `engines/MiniBrainWork`
- [ ] Atualizar `.gitmodules` do SecondBrain
- [ ] Apontar skills `frontend/{nord-theme,react,css,design}` para o DS
- [ ] Sincronizar skill `nord-theme` com os tokens finais
- [ ] Commit (no SecondBrain): `feat(frontend): DS Nortear como referencia de layout`
