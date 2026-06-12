# Plan — Rebrand Nord do Nortear Design System

Referencia: spec.md (mesma pasta). Execucao em fases, commit por fase, na branch `feature/nord-rebrand`.

## Decisao D1 — geracao de tokens

`tokens.css` declara-se "gerado de tokens.json", mas o repo nao tem gerador committado e nenhum stack
o regenera no build (os stacks apenas importam o `tokens.css` ja pronto).

Investigacao (Fase 0) revelou que `tokens.json` e uma FONTE PARCIAL: codifica apenas o modo claro
(`color.semantic`/`chart`/`sidebar`) e nao contem o bloco `.dark`, nem spacing/radius/dimensoes/motion
(que vivem so no `tokens.css`). Um gerador "completo" precisaria remodelar tudo isso no JSON — escopo
desproporcional para um rebrand de cores.

Decisao revisada (D1): SINCRONIZACAO MANUAL dos tokens de cor entre `tokens.json` (claro) e
`tokens.css` (`:root` + `.dark`) + `themes/default.css`, com um GATE deterministico de acessibilidade
em `scripts/check-contrast.mjs` (verifica WCAG 2.1 AA de todos os pares texto/fundo em light e dark).
O gerador determinístico `scripts/build-tokens.mjs` fica DEFERIDO como melhoria futura (exigiria
estender o schema do tokens.json para cobrir dark e tokens nao-cor).

Justificativa: menor superficie de mudanca, reversivel, e o gate de contraste garante a propriedade
que mais importa (AA) de forma automatizada e reproduzivel.

## Abordagem por fase

### Fase 0 — Spec & setup (esta fase)

- Branch criada.
- spec.md / plan.md / tasks.md escritos.
- Investigacao de regeneracao de tokens concluida (D1).
- Sem alteracao em codigo de producao.
- Gate: revisao do plano pelo dono (revisor != autor).

### Fase 1 — Tokens Nord (fonte de verdade)

- Adicionar primitivos `nord0..nord15` em `tokens.json` (`color.base`).
- Reapontar `color.semantic.*` (light) e o bloco dark para os primitivos Nord conforme o mapa da spec.
- Implementar `scripts/build-tokens.mjs`; regenerar `tokens.css`.
- Atualizar `docs/shared/themes/default.css` (`.tema-default` e `.dark.tema-default`) para Nord.
- Ajustar luminosidade de primary/accent/semanticas ate passar AA (verificacao de contraste).
- Gate: build React + Storybook Foundations > Cores e Temas; checagem de contraste.

### Fase 2 — Tipografia

- `docs/shared/themes/fonts.css` e `tokens.json` (font-family-active): Raleway + Open Sans.
- `@import` Google Fonts em cada `globals.css` (React/Vue/Svelte) e `index.html`/`preview-head.html`
  (Nortear). Remover Inter como padrao (manter como opcao se ja existir no seletor de fontes).
- Gate: render de tipografia nas 4 stacks; lint.

### Fase 3 — Identidade visual

- Substituir `branding/{logo-horizontal,simbolo,favicon,og-image}.svg` e
  `<stack>/.storybook/brand-logo.svg` pela identidade da marca (Nord).
- Atualizar referencias de cor de marca em `theme-config.ts` (dominios) e textos de README que citem a
  paleta antiga. Manter o nome "Nortear".
- Gate: Storybook manager exibe novo logo; sem links quebrados.

### Fase 4 — Registro e sincronizacao das 4 stacks

- Conferir `.storybook/preview.ts` de React/Vue/Svelte/Nortear: como Nord e o default, garantir que o
  toolbar e o array de brands refletem a marca (sem tema "nord" extra; default ja e Nord).
- Rodar `node scripts/audit.mjs --all --json` e corrigir divergencias.
- Gate: paridade cross-stack (audit limpo).

### Fase 5 — Validacao final

- `npm run build`, `npm run lint`, `npm run test` (React), `npm run test-storybook` (4 stacks, axe AA).
- Chromatic (se token configurado) para baseline visual.
- Gate: tudo verde; checklist de aceitacao da spec satisfeito.

### Fase 6 — Integracao SecondBrain

- Re-clonar full (sem `--depth 1`) e adicionar como submodulo em `engines/MiniBrainWork` do SecondBrain
  (atualizar `.gitmodules`).
- Atualizar skills `frontend/{nord-theme,react,css,design}` para referenciar este DS como
  implementacao canonica (link + nota de uso). Sincronizar a skill `nord-theme` com os tokens finais.
- Gate: submodulo resolve; skills apontam para paths validos.

## Estrategia de verificacao (gates recorrentes)

- Determinismo: `build-tokens.mjs` reaplicado nao gera diff.
- A11y: axe-playwright nas stories (WCAG 2.1 AA).
- Build/lint/test por stack.
- Auditoria: `scripts/audit.mjs`.
- Visual: Storybook Foundations + Chromatic.

## Rollback

Cada fase e um commit isolado na branch; reverter = `git revert` do commit da fase. Nada e mergeado em
main sem os gates da Fase 5 verdes.
