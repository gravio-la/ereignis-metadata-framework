---
to: manifestation/<%= h.inflection.pluralize(name) %>/tsconfig.json
---
{
  "extends": "@slub/edb-tsconfig/base.json",
  "include": ["./src"],
  "exclude": ["dist", "build", "node_modules"],
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
