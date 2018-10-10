/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';

module.exports = () => ({
  mode: 'production',
  devtool: 'source-map',
  target: 'electron-main',
  entry: path.join(__dirname, 'app/main/index.js'),

  output: {
    path: path.resolve(__dirname, 'app/dist'),
    filename: 'main.prod.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json'],
    alias: {
      shared: path.resolve(__dirname, 'app/shared'),
    },
  },
  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.DEBUG_PROD': JSON.stringify(process.env.DEBUG_PROD || 'false'),
      'process.env.SENTRY_API_KEY': JSON.stringify(process.env.SENTRY_API_KEY || ''),
      'process.env.SENTRY_LINK': JSON.stringify(process.env.SENTRY_LINK || ''),
      'process.env.MIXPANEL_API_TOKEN': JSON.stringify(process.env.MIXPANEL_API_TOKEN || ''),
      'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || ''),
      'process.env.DISABLE_SENTRY': JSON.stringify(process.env.DISABLE_SENTRY || ''),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
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
            ],
          },
        },
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
