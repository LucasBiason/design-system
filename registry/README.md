# MiniBrain registry

JSONs gerados por [`scripts/build-registry.mjs`](../scripts/build-registry.mjs) a partir dos fontes em [`minibrain-ds/`](../minibrain-ds/). Consumidos pelo CLI [`minibrain-ds-cli`](../minibrain-ds-cli/).

```
registry/
└── v1/
    ├── index.json     ← índice (nomes, versões, deps internas)
    ├── init.json      ← camada base (lib/, tokens, themes) — rodar 1x via `minibrain init`
    ├── button.json    ← componente + CSS
    └── alert.json     ← componente + CSS
```

Para regenerar:

```bash
node scripts/build-registry.mjs
```

Para servir em produção: publique `registry/v1/` em qualquer host HTTPS (GitHub Pages, Cloudflare Pages, R2, raw GitHub). O CLI aceita a URL via `--registry` ou no `minibrain.json` do projeto consumidor.

Para incluir mais componentes, adicione o slug em `COMPONENTS` no script gerador. Para alterar a camada base, edite `INIT_FILES` / `INIT_ENTRY_IMPORTS` / `INIT_DEPS`.

Schema completo em [`minibrain-ds-cli/README.md`](../minibrain-ds-cli/README.md#schema-do-manifesto).
