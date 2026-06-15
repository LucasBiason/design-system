# minibrain (CLI)

CLI para copiar componentes do **MiniBrain Design System** para o projeto consumidor — modelo *copy, não dependa* (estilo shadcn), mas em **TypeScript puro e sem Tailwind**.

> **Proof of concept.** Não publicado no npm. Para testar localmente, veja [Uso local](#uso-local).

## Comandos

```bash
minibrain init [--registry <url|path>] [--root <dir>] [--overwrite]
minibrain add  <name...> [--registry <url|path>] [--overwrite] [--dry-run]
minibrain list [--registry <url|path>]
```

### `minibrain init`

Roda **uma vez** por projeto. Cria `minibrain.json` com paths default e instala a camada base:

- `src/lib/utils.ts`, `src/lib/sanitize-html.ts`
- `src/styles/tokens/tokens.css`
- `src/styles/themes/{index,default,warm,cold,densities,fonts}.css`
- Anexa `@import "./tokens/tokens.css"` e `@import "./themes/index.css"` no `src/styles/globals.css`
- Instala `clsx` + `tailwind-merge` (deps de `cn`)

Detecta automaticamente pnpm / yarn / bun / npm pelo lockfile.

### `minibrain add <name...>`

Para cada componente: copia o `.ts` factory + o `.css` correspondente, **reescreve imports `@/lib/...` e `@/components/ui/...` para caminhos relativos** baseados nos `paths` do `minibrain.json`, anexa `@import` ao entry CSS e instala deps npm faltantes (`lucide`, etc.).

Resolve `registryDependencies` recursivamente (BFS, dedup).

### `minibrain list`

Lista todos os itens do registry com versão e dependências internas.

## `minibrain.json`

```json
{
  "$schema": "https://minibrain.dev/schema.json",
  "registry": "https://minibrain.dev/v1",
  "paths": {
    "components": "src/components/ui",
    "styles":     "src/styles/components",
    "lib":        "src/lib",
    "tokens":     "src/styles/tokens",
    "themes":     "src/styles/themes",
    "vendor":     "src/styles/vendor"
  },
  "entryCss": "src/styles/globals.css"
}
```

Mude qualquer `paths.X` para outro layout e o CLI passa a escrever lá (e os `@/` viram caminhos relativos consistentes).

## Schema do manifesto

Um JSON por item em `registry/v1/<name>.json`:

```json
{
  "name": "button",
  "version": "1.0.0",
  "dependencies": ["lucide"],
  "registryDependencies": [],
  "files": [
    { "type": "component", "name": "button.ts",  "content": "…" },
    { "type": "style",     "name": "button.css", "content": "…" }
  ]
}
```

`type` ∈ `component | style | lib | tokens | theme | vendor` — mapeia 1-pra-1 para a chave correspondente em `paths` do `minibrain.json` (`component` → `paths.components`, `theme` → `paths.themes` etc.). O CLI compõe o destino e reescreve imports `@/`.

O item `init` tem ainda `entryImports`: array de `{type, name}` que o CLI anexa ao entry CSS como `@import "<relativo-ao-entry>"`.

## Gerar o registry

```bash
node scripts/build-registry.mjs
```

Lê `minibrain-ds/src/components/ui/*` + `src/styles/components/*` + `docs/shared/{tokens,themes}/`, deduz deps npm e `registryDependencies` por análise de imports, e emite `registry/v1/{<name>.json,index.json}`.

Para incluir um componente novo, adicione o slug em `COMPONENTS` em [`scripts/build-registry.mjs`](../scripts/build-registry.mjs). Para mudar a camada base, edite `INIT_FILES` / `INIT_ENTRY_IMPORTS` / `INIT_DEPS` no mesmo arquivo.

## Uso local (sem publicar)

Da raiz do monorepo:

```bash
# 1. Gera o registry
node scripts/build-registry.mjs

# 2. Cria um projeto de teste
mkdir test-project && cd test-project
echo '{"name":"test","version":"1.0.0"}' > package.json

# 3. Init contra o registry local (caminho de filesystem em vez de URL)
node ../minibrain-ds-cli/bin/minibrain.mjs init --registry ../registry/v1

# 4. Add componentes
node ../minibrain-ds-cli/bin/minibrain.mjs add button alert
```

## Hospedagem

Para uso real, basta servir a pasta `registry/v1/` por HTTPS — GitHub Pages, Cloudflare Pages, R2, ou raw GitHub. O CLI aceita qualquer URL HTTPS via `--registry` (ou via `minibrain.json`). Sem servidor próprio.

Versionar por path (`/v1/`, `/v2/`) para upgrades opt-in.

## Como o CLI lida com riscos

| Risco                                                        | Mitigação |
| ------------------------------------------------------------ | --------- |
| Sobrescrever modificações locais do usuário                  | `add` **pula** arquivos existentes; passar `--overwrite` para forçar. `--dry-run` mostra o que faria. |
| Conflito de alias de import                                  | Reescrevemos `@/lib/...` e `@/components/ui/...` para caminhos relativos no install. Nada de alias no código entregue. |
| Diferenças de estrutura de pastas no consumidor              | `minibrain.json` declara onde cada tipo cai. Trocar o path muda para onde o CLI escreve. |
| Deps npm faltantes                                           | `init` / `add` rodam o package manager do projeto (pnpm/yarn/bun/npm via lockfile) para o que faltar no `package.json`. |
| Updates futuros                                              | `minibrain add <name>` re-roda. Sem `--overwrite`, preserva edições locais; com, sobrescreve. |

## Limitações conhecidas (PoC)

- Não detecta dependência recursiva entre componentes ainda — só lê `import` top-level. Componentes do PoC (`button`, `alert`) não usam outros componentes, então não testado.
- `--dry-run` em `init` ainda escreve arquivos da camada base; só simula o `npm install`. Easy fix se virar produção.
- Sem comando `update` ou `remove` ainda.
- Sem checagem de SHA pra detectar arquivos modificados antes de overwrite (shadcn faz isso).
