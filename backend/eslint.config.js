import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      globals: globals.node,
    },

    plugins: {
      "unused-imports": unusedImports,
      "@stylistic": stylistic,
    },

    rules: {
      // Unused variables
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // Unused imports
      "unused-imports/no-unused-imports": "error",

      // Require curly braces
      curly: ["error", "all"],

      // Formatting
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/indent": ["error", 2],

      // Allow console methods
      "no-console": "off",
    },
  },
];
