/**
 * Webpack config for production electron main process
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  devtool: 'cheap-source-map',

  target: 'electron-main',

  entry: ['babel-polyfill', './app/main.dev'],

  // 'main.js' in root
  output: {
    path: __dirname,
    filename: './app/main.prod.js',
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

    new webpack.optimize.OccurrenceOrderPlugin(),
  ],

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
