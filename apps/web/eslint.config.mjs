import { prettierConfig, webIgnores } from '@ccxp/config/eslint/web'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: webIgnores,
}).append(prettierConfig)
