import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  { ignores: ["**/node_modules/**", "**/dist/**"] },
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "script" },
    rules: {
      "no-undef": "off",
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-unused-vars": "warn",
      "no-console": 0,
    },
  },
  { languageOptions: { globals: globals.node } },
];
