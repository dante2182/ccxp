import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Configuración ESLint compartida para paquetes TypeScript sin framework. */
export default tseslint.config(
  {
    ignores: ['.output/**', '.nitro/**', 'node_modules/**', 'dist/**'],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
)
