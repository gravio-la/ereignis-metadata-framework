---
to: manifestation/<%= name %>/tsconfig.json
---
{
  "extends": "@graviola/edb-tsconfig/base.json",
  "include": ["./src"],
  "exclude": ["dist", "build", "node_modules"],
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
