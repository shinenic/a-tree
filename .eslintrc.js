module.exports = {
  env: {
    browser: true,
    jest: true
  },
  // https://github.com/smooth-code/jest-puppeteer#configure-eslint
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/']
      }
    }
  },
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'simple-import-sort'],
  rules: {
    semi: [2, 'never'],
    'linebreak-style': 'off',
    'function-paren-newline': 'off',
    'no-use-before-define': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    'arrow-body-style': 'off',
    'no-confusing-arrow': 'off',
    'implicit-arrow-linebreak': 'off',
    'comma-dangle': 'off',
    'no-param-reassign': 'warn',
    'no-unused-vars': 'warn',
    'react/jsx-filename-extension': 'off',
    'consistent-return': 'off',
    'no-unused-expressions': 'off',
    'no-console': 'off',
    'no-bitwise': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-await-in-loop': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/no-unescaped-entities': 'off',
    'react/destructuring-assignment': 'off',
    indent: 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-wrap-multilines': 'off',
    'simple-import-sort/exports': 'error',
    'react/jsx-one-expression-per-line': 'off'
  }
}
