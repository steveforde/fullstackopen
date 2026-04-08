import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      // We merge the standard browser globals with Vitest globals
      globals: {
        ...globals.browser,
        ...globals.vitest  // <--- Add this line!
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      },
    },

    // ========== PLUGINS ==========
    // Plugins add additional rules beyond the base ESLint rules
    plugins: {
      'react-hooks': reactHooks, // React Hooks specific rules
      'react-refresh': reactRefresh, // Fast Refresh compatibility rules
    },

    // ========== RULES ==========
    // Rules are the actual linting checks that run on your code
    rules: {
      // Include all recommended rules from @eslint/js
      // These cover things like no-undef, no-extra-semi, etc.
      ...js.configs.recommended.rules,

      // Include all recommended rules from React Hooks plugin
      // This includes rules-of-hooks and exhaustive-deps
      ...reactHooks.configs.recommended.rules,

      // 'no-unused-vars': Error when variables are declared but never used
      // varsIgnorePattern: '^[A-Z_]' - Ignore unused variables that start with
      // uppercase letter or underscore (useful for React components named with
      // PascalCase that might be exported but not used in the file)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // 'react-refresh/only-export-components': Warn when exporting things that
      // might break Fast Refresh (like exporting a non-component)
      // allowConstantExport: true - Allow exporting constants
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // 'indent': Enforce 2 spaces for indentation (error if wrong)
      indent: ['error', 2],

      // 'linebreak-style': Enforce Unix line endings (LF, not CRLF)
      // 'unix' means LF line endings (standard for Linux/Mac/Git)
      'linebreak-style': ['error', 'unix'],

      // 'quotes': Enforce single quotes instead of double quotes
      // 'error' means violation breaks the build
      quotes: ['error', 'single'],

      // 'semi': Disallow semicolons at end of statements
      // 'never' means no semicolons allowed
      semi: ['error', 'never'],

      // 'eqeqeq': Enforce strict equality (=== and !==) instead of loose (==, !=)
      // Prevents type coercion bugs
      eqeqeq: 'error',

      // 'no-trailing-spaces': Disallow spaces at the end of lines
      'no-trailing-spaces': 'error',

      // 'object-curly-spacing': Enforce spaces inside curly braces
      // 'always' means { foo } not {foo}
      'object-curly-spacing': ['error', 'always'],

      // 'arrow-spacing': Enforce spaces around arrow function arrows
      // before: true means space before =>, after: true means space after =>
      // Example: (x) => x + 1  (not (x)=>x+1)
      'arrow-spacing': ['error', { before: true, after: true }],

      // 'no-console': Turn off the rule that warns about console.log
      // 'off' means console.log is allowed (useful for debugging)
      'no-console': 'off',
    },
  },
]
