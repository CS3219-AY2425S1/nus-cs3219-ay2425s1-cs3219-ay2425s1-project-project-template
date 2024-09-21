import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        ignores: [
            '**/dist/*',
            '**/node_modules/*',
            '**/jest.config.{ts,js}',
            '**/tailwind.config.{js,ts}',
            '**/postcss.config.{mjs,js}',
        ],
    },
]
