/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import SentryPlugin from 'webpack-sentry-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import config from './webpack.renderer.base';
import pjson from './package.json';

const plugins = [
  new HtmlWebpackPlugin({
    template: 'app/renderer/index.tpl.html',
    inject: 'body',
    filename: 'index.html',
    chunks: ['app'],
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
    template: 'app/renderer/issueForm.tpl.html',
    inject: 'body',
    filename: 'issueForm.html',
    chunks: ['issueForm'],
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.BABEL_ENV': JSON.stringify(process.env.BABEL_ENV || 'production'),
    'process.env.SENTRY_LINK': JSON.stringify(process.env.SENTRY_LINK || ''),
    'process.env.SENTRY_API_KEY': JSON.stringify(process.env.SENTRY_API_KEY || '""'),
    'process.env.MIXPANEL_API_TOKEN': JSON.stringify(process.env.MIXPANEL_API_TOKEN || '""'),
    'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || '""'),
    'process.env.DISABLE_SENTRY': JSON.stringify(process.env.DISABLE_SENTRY || '""'),
  }),
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
