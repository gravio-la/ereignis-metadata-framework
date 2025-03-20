---
to: packages/<%= name.split("/")[1] %>/package.json
---
{
  "name": "<%= name %>",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "CHANGELOG.md",
    "README.md"
  ],
  "scripts": {
    "depcheck": "depcheck",
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/**/*.{ts,tsx}",
    "lint-fix": "eslint --fix src/**/*.{ts,tsx}",
    "pack-clean": "bun run clean-package && (bun pm pack || true) ; bun run clean-package restore",
    "publish-clean": "bun run clean-package && npm publish --access public && bun run clean-package restore"
  },
  "peerDependencies": {
    "@mui/material": "^5",
    "@mui/icons-material": "^5",
    "react": "^18"
  },
  "dependencies": {
  },
  "devDependencies": {
    "@graviola/edb-tsconfig": "workspace:*",
    "@graviola/edb-tsup-config": "workspace:*",
    "eslint-config-edb": "workspace:*",
    "tsup": "^8.0.0",
    "typescript": "^5.8.2"
  },
  "clean-package": {
    "extends": "../../../clean-package.config.cjs"
  },
  "eslintConfig": {
    "root": true,
    "extends": ["eslint-config-edb"]
  }
}

