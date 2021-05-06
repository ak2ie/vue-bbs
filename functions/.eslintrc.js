module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/__tests__/**/*",
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quotes": ["warn", "double"],
    "object-curly-spacing": "off",
    "@typescript-eslint/no-var-requires": "off",
    "indent": ["error", 2],
  },
};
