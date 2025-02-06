---
to: packages/<%= name.split("/")[1] %>/typedoc.js
---
{
  "extends": ["@graviola/edb-tsconfig/typedoc.base.json"],
  "entryPoints": ["src/index.ts"]
}
