/* eslint-disable max-len */
/**
 * Build config for development process that uses Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

import webpack from 'webpack';
import validate from 'webpack-validator';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default validate(merge(baseConfig, {
  debug: true,

  devtool: 'inline-source-map',

  entry: {
    main: [
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
      'babel-polyfill',
      './app/index',
    ],
    popup: [
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
      './app/popup',
    ],
    idleTimePopup: [
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
      './app/idlePopup',
    ],
  },

  output: {
    publicPath: 'http://localhost:3000/dist/',
    filename: '[name]-bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v=.*)?$|\.otf|\.woff(\?v=.*)?$|\.ttf(\?v=.*)?$|\.eot(\?v=.*)?$|\.woff?2(\?v=.*)?/, // eslint-disable-line max-len
        loader: 'file-loader?name=[path][name].[ext]',
      },
    ],
  },
  plugins: [
   // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
    new webpack.HotModuleReplacementPlugin(),

    /**
     * If you are using the CLI, the webpack process will not exit with an error
     * code by enabling this plugin.
     * https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
     */
    new webpack.NoErrorsPlugin(),

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
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // Define global vars 
    new webpack.ProvidePlugin({
      Immutable: 'immutable',
    }),
  ],

  /**
   * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
   */
  target: 'electron-renderer',
}));
