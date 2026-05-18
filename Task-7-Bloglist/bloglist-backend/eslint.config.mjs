// 1. Import necessary modules for ESLint configuration
import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin";

export default [
  {
    // 2. IGNORES: Skip the folders we don't need to check
    ignores: ["dist/**", "build/**", "node_modules/**", "frontend/**"],
  },

  // 3. BASE CONFIG: Use standard JavaScript recommended rules
  js.configs.recommended,

  {
    // 4. FILE SETTINGS: Apply rules to all JavaScript files
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // We use require() in Node.js
      globals: {
        ...globals.node,
        ...globals.jest, // Added Jest globals so tests don't cause lint errors
      },
      ecmaVersion: "latest",
    },

    // 5. PLUGINS: Add the Stylistic plugin for formatting
    plugins: {
      "@stylistic/js": stylisticJs,
    },

    // 6. RULES: The Helsinki style guide (Single quotes, no semicolons)
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-unused-vars": "off",
    },
  },
];
