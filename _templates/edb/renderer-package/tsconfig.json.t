---
to: packages/form-renderer/<%= name.split("/")[1] %>/tsconfig.json
---
{
  "extends": "@graviola/edb-tsconfig/react-library.json",
  "include": ["src"],
  "exclude": ["dist", "build", "node_modules"],
  "compilerOptions": {
    "strict": false,
    "resolveJsonModule": true
  }
}
