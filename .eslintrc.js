module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': ['error', {
      groups: [
        // Side effect imports.
        ['^\\u0000'],
        // Node.js builtins. You could also generate this regex if you use a `.js` config.
        // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
        // Note that if you use the `node:` prefix for Node.js builtins,
        // you can avoid this complexity: You can simply use "^node:".
        [
          '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          '^@?\\w',
          // Packages. `react` related packages come first.
          '^nest',
          // NestJs packages.
          '^@nestjs(/.*|$)',
        ],
        // Ongage packages.
        [
          '^@ongage(/.*|$)',
          // Internal lib packages.
          '^@libs(/.*|$)',
          // Internal packages.
          '^@app(/.*|$)',
          // Parent imports. Put `..` last.
          '^\\.\\.(?!/?$)', '^\\.\\./?$',
          // Other relative imports. Put same-folder imports and `.` last.
          '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$',
        ],
      ],
    }],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'off',
    'import/no-duplicates': 'error',
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],
  },
};
