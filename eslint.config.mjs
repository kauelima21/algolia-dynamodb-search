import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['./src/*.{js,mjs,cjs,ts}'],
        rules: {
            quotes: ['error', 'single'],
            'object-curly-spacing': ['error', 'always']
        }
    },
    {languageOptions: {globals: globals.node}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
