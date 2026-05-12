import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/*.config.{js,cjs,mjs}",
    ],
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "no-console": ["warn", { allow: ["error"] }],
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "react/jsx-key": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "error",

      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "off",

      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/ui/*", "@gradlly/utils/*", "@gradlly/hooks/*"],
              message: "Import from package roots only (e.g. @gradlly/ui).",
            },
            {
              group: ["**/packages/**"],
              message:
                "Do not import using package filesystem paths. Use workspace package aliases.",
            },
          ],
        },
      ],

      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
