module.exports = {
  extends: [
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        env: 'development',
        config: '../webpack.renderer.base.js',
      },
    },
  },
  env: {
    'browser': true,
    'shared-node-browser': true,
  },
  globals: {
    "Generator": true,
  },
  plugins: [],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '__CLEAR_ALL_REDUCERS__',
          '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
        ],
      },
    ],
    'function-paren-newline': [
      'error',
      'consistent',
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: 'always',
        ExportDeclaration: 'always'
    }],
  },
};
