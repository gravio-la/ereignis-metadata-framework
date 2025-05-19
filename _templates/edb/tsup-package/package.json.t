---
to: packages/<%= name.split("/")[1] %>/package.json
---
{
  "name": "<%= name %>",
  "version": "1.0.0",
  "description": "<%= description %>",
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
  "scripts": {
    "depcheck": "depcheck",
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint \"**/*.ts*\"",
    "lint-fix": "eslint --fix \"**/*.ts*\"",
    "pack-clean": "bun run clean-package && (bun pm pack || true) ; bun run clean-package restore",
    "publish-clean": "bun run clean-package && npm publish --access public && bun run clean-package restore"
  },
  "devDependencies": {
    "@graviola/edb-tsconfig": "workspace:*",
    "@graviola/edb-tsup-config": "workspace:*",
    "eslint-config-edb": "workspace:*"
  },
  "clean-package": {
    "extends": "../../../clean-package.config.cjs"
  },
  "eslintConfig": {
    "root": true,
    "extends": [
      "eslint-config-edb"
    ]
  }
}

