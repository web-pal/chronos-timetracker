const path = require('path');

module.exports = env => ({
  target: 'electron-renderer',
  entry: {
    app: [
      path.join(__dirname, 'app/renderer/index.jsx'),
    ],
    screenPopup: [
      path.join(__dirname, 'app/renderer/screenPopup.jsx'),
    ],
    idleTimePopup: [
      path.join(__dirname, 'app/renderer/idlePopup.jsx'),
    ],
    issueForm: [
      path.join(__dirname, 'app/renderer/issueForm.jsx'),
    ],
    authPreload: [
      path.join(__dirname, 'app/renderer/authPreload.js'),
    ],
    issueFormPreload: [
      path.join(__dirname, 'app/renderer/issueFormPreload.js'),
    ],
    idlePopupPreload: [
      path.join(__dirname, 'app/renderer/idlePopupPreload.js'),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json'],
    alias: {
      actions: path.join(__dirname, 'app/renderer/actions'),
      api: path.join(__dirname, 'app/renderer/api'),
      components: path.join(__dirname, 'app/renderer/components'),
      config: path.resolve(__dirname, 'app/config'),
      sagas: path.join(__dirname, 'app/renderer/sagas'),
      selectors: path.join(__dirname, 'app/renderer/selectors'),
      utils: path.join(__dirname, 'app/renderer/utils'),
      types: path.join(__dirname, 'app/renderer/types'),
      styles: path.join(__dirname, 'app/renderer/styles'),
      shared: path.resolve(__dirname, 'app/shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '3.0.2',
                  },
                  modules: false,
                  useBuiltIns: 'entry',
                },
              ],
              [
                '@babel/preset-react',
                {
                  development: (!env || !env.NODE_ENV)
                    ? 'development'
                    : env.NODE_ENV.toLowerCase() === 'development',
                },
              ],
              '@babel/preset-flow',
            ],
            plugins: [
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-do-expressions',
              [
                // used only for babel helpers
                '@babel/plugin-transform-runtime',
                {
                  // regenerator runtime should be used from global polyfill
                  regenerator: false,
                  // define babel helpers as es modules
                  useESModules: true,
                },
              ],
              [
                'babel-plugin-styled-components',
                {
                  displayName: true,
                },
              ],
            ],
            env: {
              development: {
                plugins: [
                  'react-hot-loader/babel',
                ],
              },
            },
          },
        },
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      // WOFF/WOFF2 Fonts
      {
        test: /\.woff(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Fonts
      {
        test: /\.ttf(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // SVG
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|eot|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});
