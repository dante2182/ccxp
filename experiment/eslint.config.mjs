import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

/** Config local espejo de @ccxp/config/eslint/web, sin imports hacia el padre. */
export default withNuxt({
  ignores: [
    '.output/**',
    '.nuxt/**',
    '**/.nuxt/**',
    '.data/**',
    'node_modules/**',
    'dist/**',
    'src/**',
    'qa/**',
  ],
}).append(prettier)
