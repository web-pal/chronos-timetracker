/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import SentryPlugin from 'webpack-sentry-plugin';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import pjson from './package.json';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || '"production"'),
    'process.env.BABEL_ENV': JSON.stringify(process.env.BABEL_ENV || '"production"'),
    'process.env.SENTRY_LINK': JSON.stringify(process.env.SENTRY_LINK || ''),
    'process.env.SENTRY_API_KEY': JSON.stringify(process.env.SENTRY_API_KEY || '""'),
    'process.env.MIXPANEL_API_TOKEN': JSON.stringify(process.env.MIXPANEL_API_TOKEN || '""'),
    'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || '""'),
    'process.env.DISABLE_SENTRY': JSON.stringify(process.env.DISABLE_SENTRY || '""'),
  }),

  new ExtractTextPlugin({
    filename: 'name.css',
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),
  // new BundleAnalyzerPlugin(),
];


if (process.env.UPLOAD_SENTRY !== '0' && process.env.DISABLE_SENTRY !== '1') {
  plugins.push(
    new SentryPlugin({
      organisation: 'webpal',
      project: 'chronos-desktop',
      apiKey: process.env.SENTRY_API_KEY,
      release: `${pjson.version}_${process.platform}`,
    }),
  );
}

export default merge.smart(baseConfig, {
  devtool: 'cheap-source-map',

  target: 'electron-renderer',

  entry: {
    main: ['babel-polyfill', './app/index'],
    screenPopup: ['babel-polyfill', './app/screenPopup'],
    idleTimePopup: ['babel-polyfill', './app/idlePopup'],
    issueForm: ['babel-polyfill', './app/issueForm'],
  },

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/',
    filename: '[name]-bundle.js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'app/actions'),
      path.join(__dirname, 'app/types'),
      path.join(__dirname, 'app/components'),
      path.join(__dirname, 'app/utils'),
      path.join(__dirname, 'app/selectors'),
      path.join(__dirname, 'app/styles'),
      'node_modules',
    ],
    // We need it because of atlaskit styled-components version
    alias: {
      'styled-components2': path.resolve(__dirname, 'app/styled-components.min.js'),
    },
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
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
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },
  plugins,
});
