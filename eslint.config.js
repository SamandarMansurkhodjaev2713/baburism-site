import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["build/", ".react-router/", "node_modules/", "public/", "app/styles/", "dist/"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
      // React Router routes signal 404s by throwing a Response.
      "@typescript-eslint/only-throw-error": ["error", { allow: [{ from: "lib", name: "Response" }] }],
    },
  },
  {
    files: ["scripts/**/*.mjs", "site.config.mjs", "eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
  },
);
