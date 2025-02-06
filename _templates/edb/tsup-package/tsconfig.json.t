---
to: packages/<%= name.split("/")[1] %>/tsconfig.json
---
{
  "extends": "@graviola/edb-tsconfig/base.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"],
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
