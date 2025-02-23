module.exports = {
  extends: ["next", "turbo", "prettier"],
  plugins: ["simple-import-sort"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "turbo/no-undeclared-env-vars": "off",
    "simple-import-sort/imports": "error",
    semi: ["error", "always"],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-unused-expressions": "error",
    "eslint-import-resolver-alias": "error",
  },
};
