/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import SentryCliPlugin from '@sentry/webpack-plugin';
import config from './webpack.renderer.base';
import pjson from './app/package.json';

const plugins = [
  new HtmlWebpackPlugin({
    template: 'app/renderer/index.tpl.html',
    inject: 'body',
    filename: 'index.html',
    chunks: ['app'],
  }),
  new HtmlWebpackPlugin({
    template: 'app/trello-renderer/index.tpl.html',
    inject: 'body',
    filename: 'trelloIndex.html',
    chunks: ['trelloApp'],
  }),
  new HtmlWebpackPlugin({
    template: 'app/renderer/screenPopup.tpl.html',
    inject: 'body',
    filename: 'screenPopup.html',
    chunks: ['screenPopup'],
  }),
  new HtmlWebpackPlugin({
    template: 'app/renderer/idlePopup.tpl.html',
    inject: 'body',
    filename: 'idlePopup.html',
    chunks: ['idleTimePopup'],
  }),
  new HtmlWebpackPlugin({
    template: 'app/renderer/attachmentWindow.tpl.html',
    inject: 'body',
    filename: 'attachmentWindow.html',
    chunks: ['attachmentWindow'],
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.BABEL_ENV': JSON.stringify(process.env.BABEL_ENV || 'production'),
    'process.env.DEBUG_PROD': JSON.stringify(process.env.DEBUG_PROD || 'false'),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
    'process.env.MIXPANEL_API_TOKEN': JSON.stringify(process.env.MIXPANEL_API_TOKEN),
  }),
  new SentryCliPlugin({
    include: '.',
    ignore: [
      'node_modules',
      'app/node_modules',
      'app/dist',
      'scripts',
      'release',
      '.eslintrc.js',
      '.cz-config.js',
      'flow-typed',
      'src/config',
      '*.test.js',
      'webpack.*',
    ],
    dryRun: false,
    configFile: 'sentry.properties',
    release: `${pjson.version}_${process.platform}`,
  }),
];


module.exports = env => merge(config(env), {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    publicPath: './',
    filename: '[name].prod.js',
  },
  plugins,
});
