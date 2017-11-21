/**
 * Webpack config for production electron main process
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
// import BabelMinify from 'babel-minify-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-main',

  entry: ['babel-polyfill', './app/main.dev'],

  // 'main.js' in root
  output: {
    path: __dirname,
    filename: './app/main.prod.js',
  },

  plugins: [
    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    // Wait when will be resolved:
    // https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
    // https://github.com/webpack/webpack/issues/5931
    // new BabelMinify({
      // mangle: false,
      // evaluate: false,
    // }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

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
      'process.env.MIXPANEL_API_TOKEN': JSON.stringify(process.env.MIXPANEL_API_TOKEN || ''),
      'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || ''),
      'process.env.DISABLE_SENTRY': JSON.stringify(process.env.DISABLE_SENTRY || ''),
    }),
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
