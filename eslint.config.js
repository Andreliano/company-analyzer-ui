import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Needed since we need to send HTML from the server
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      // Needed to import certain PrimeVue components
      'vue/no-reserved-component-names': 'off',
      'vue/multi-word-component-names': 'off',
      'import/prefer-default-export': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'import/no-cycle': 'off',
    },
  },
];