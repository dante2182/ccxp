import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt({
  ignores: ['.output/**', '.nuxt/**', '.data/**', 'node_modules/**', 'dist/**'],
}).append(prettier)
