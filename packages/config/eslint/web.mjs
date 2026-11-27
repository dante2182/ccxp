import prettier from 'eslint-config-prettier'

/** Ignores compartidos por la app Nuxt. */
export const webIgnores = [
  '.output/**',
  '.nuxt/**',
  '**/.nuxt/**',
  '.data/**',
  'node_modules/**',
  'dist/**',
  'demo/**',
]

/** Regla final para desactivar reglas de formato que compiten con Prettier. */
export const prettierConfig = prettier

export default { ignores: webIgnores }
