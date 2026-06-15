# Spec — Rebrand Nord do MiniBrain Design System

- ID: nord-rebrand
- Status: Draft (Fase 0)
- Branch: feature/nord-rebrand
- Tipo: alteracao brownfield (tematizacao + rebranding visual)
- Constituicao aplicavel: CLAUDE.md (raiz e por stack), docs/shared/guidelines/, scripts/audit.mjs
- Spec de cores (fonte): engines/MiniBrainWork/core/skills/frontend/nord-theme/SKILL.md (paleta Nord canonica)

## 1. Contexto e problema

O repositorio e um fork do template multi-stack "MiniBrain Design System" (React 19, Vue 3, Svelte 5,
Vanilla TS), com tokens compartilhados, Storybook, Chromatic e auditorias. Hoje a identidade visual e
neutra (cinza) com temas alternativos Warm e Cold.

O objetivo do projeto e tornar este design system a REFERENCIA DE LAYOUT do frontend do MiniBrainWork
(parte do SecondBrain). Para isso, a identidade padrao deve adotar a paleta Nord, que ja e a paleta
oficial de frontend do ecossistema (skill `nord-theme`).

## 2. Objetivo

Reposicionar a paleta Nord como identidade PADRAO do design system (light e dark), aplicando tambem a
tipografia e a identidade visual da marca, mantendo o nome "MiniBrain", as 4 stacks sincronizadas e a
conformidade WCAG 2.1 AA.

## 3. Escopo

### Dentro do escopo

- Tokens de cor (light `:root` e dark `.dark`) reapontados para Nord, via `tokens.json` (fonte de
  verdade) regenerando `tokens.css`.
- Tema `default` (`.tema-default` / `.dark.tema-default`) alinhado a Nord (passa a ser a marca).
- Tipografia: Raleway (titulos) + Open Sans (corpo), substituindo Inter, nas 4 stacks.
- Identidade visual: logo, simbolo, favicon e og-image em `branding/` e `.storybook`.
- Registro/validacao do tema nas 4 stacks (`.storybook/preview.ts`).
- Integracao no SecondBrain como submodulo git em `engines/MiniBrainWork`, com as skills
  `frontend/{nord-theme,react,css,design}` apontando para este DS como implementacao de referencia.

### Fora do escopo

- Renomear a marca (mantem "MiniBrain" / slug `minibrain`).
- Criar ou remover componentes; alterar APIs de componentes.
- Mudar a arquitetura de densidades, motion, spacing ou radius.
- Reescrever conteudo trilingue (`translations.json`).

## 4. Mapeamento de cores (Nord -> tokens)

Valores Nord em HSL (`H S% L%`, formato do `tokens.css`). Ajustes finos de luminosidade para garantir
WCAG AA (>=4.5:1 texto normal, >=3:1 texto grande/UI) serao feitos na Fase 1 e verificados; o hue Nord
e preservado.

| Token                     | Light (Snow Storm / Frost)                             | Dark (Polar Night / Frost) |
| ------------------------- | ------------------------------------------------------ | -------------------------- |
| `--background`            | nord6 `218 27% 94%`                                    | nord0 `220 16% 22%`        |
| `--foreground`            | nord0 `220 16% 22%`                                    | nord6 `218 27% 94%`        |
| `--card` / `--popover`    | branco-neve `218 27% 97%`                              | nord1 `222 16% 28%`        |
| `--primary`               | nord10 `213 32% 52%` (escurecer p/ AA com texto claro) | nord8 `193 43% 67%`        |
| `--primary-foreground`    | nord6 `218 27% 94%`                                    | nord0 `220 16% 22%`        |
| `--secondary` / `--muted` | nord4 `219 28% 88%`                                    | nord2 `220 17% 32%`        |
| `--muted-foreground`      | nord3 `220 16% 36%`                                    | nord4 `219 28% 88%`        |
| `--accent`                | nord8 `193 43% 67%`                                    | nord9 `210 34% 63%`        |
| `--border` / `--input`    | nord4 `219 28% 88%`                                    | nord3 `220 16% 36%`        |
| `--ring`                  | nord10 `213 32% 52%`                                   | nord8 `193 43% 67%`        |
| `--sidebar`               | nord5 `218 27% 92%`                                    | nord1 `222 16% 28%`        |
| `--destructive`           | nord11 `354 42% 56%` (escurecer p/ AA)                 | nord11 clareado            |
| `--success`               | nord14 `92 28% 65%` (escurecer p/ AA)                  | nord14                     |
| `--warning`               | nord13 `40 71% 73%` (escurecer p/ AA)                  | nord13                     |
| `--info`                  | nord10 `213 32% 52%`                                   | nord9 `210 34% 63%`        |
| `--chart-1..5`            | gradiente Frost (nord7,8,9,10 + nord15)                | idem clareado              |

Primitivos a adicionar em `tokens.json` (`color.base`): `nord0..nord15`.

## 5. Requisitos

- RF1: O tema padrao (sem classe de marca) renderiza Nord em light e dark.
- RF2: `tokens.json` permanece a fonte de verdade; `tokens.css` e gerado/sincronizado a partir dele.
- RF3: As 4 stacks consomem os mesmos tokens sem divergencia (single source).
- RF4: Tipografia padrao = Raleway (headings) + Open Sans (corpo).
- RNF1: Todos os pares texto/fundo atendem WCAG 2.1 AA (verificado por axe-playwright nas stories).
- RNF2: Nenhuma regressao de build/lint/teste nas 4 stacks.
- RNF3: `node scripts/audit.mjs --all` sem novos erros.
- RNF4: Mudanca aditiva e reversivel (sem quebrar Warm/Cold/densidades/fonts existentes).

## 6. Criterios de aceitacao

1. Storybook React (Foundations > Cores e Temas) exibe a paleta Nord em light e dark.
2. `npm run build` e `npm run lint` passam nas 4 stacks.
3. `npm run test` (React) e `npm run test-storybook` (4 stacks, axe AA) passam.
4. `tokens.json` e `tokens.css` consistentes (gerador determinístico reproduz o css).
5. Contraste AA validado para Button/Input/Alert/Badge nos estados padrao.
6. DS adicionado como submodulo em `engines/MiniBrainWork` e skills frontend referenciando-o.

## 7. Riscos e decisoes em aberto

- D1: Nao ha gerador `tokens.json -> tokens.css` no repo. Decisao proposta: criar
  `scripts/build-tokens.mjs` deterministico (resolve aliases `{color.base.*}` e emite o css). Alternativa:
  edicao manual sincronizada (mais fragil). Decisao final na Fase 1 (ver plan.md).
- D2: Cores Frost mid-tone (nord8/nord10) podem nao bater AA com texto claro; mitigado escurecendo a
  luminosidade preservando o hue.
- D3: Clone atual e shallow (`--depth 1`). Para virar submodulo limpo, re-clonar full ou ajustar.
