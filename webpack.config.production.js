import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import SentryPlugin from 'webpack-sentry-plugin';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import pjson from './package.json';

const config = merge(baseConfig, {
  devtool: 'source-map',

  entry: {
    main: ['babel-polyfill', './app/index.jsx'],
    screenPopup: ['babel-polyfill', './app/screenPopup.jsx'],
    idleTimePopup: ['babel-polyfill', './app/idlePopup.jsx'],
  },

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/',
    filename: '[name]-bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!less-loader',
        ),
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v=.*)?$|\.otf|\.woff(\?v=.*)?$|\.ttf(\?v=.*)?$|\.eot(\?v=.*)?$|\.woff?2(\?v=.*)?|\.html/, // eslint-disable-line max-len
        loader: 'url-loader',
      },
    ],
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.ProvidePlugin({
      Immutable: 'immutable',
    }),
    new SentryPlugin({
      organisation: 'webpal',
      project: 'chronos-desktop',
      apiKey: '9eacb1fa468a41b29bd005a1a46c039644fe1ca5ea614540b9e6b03db719a5ee',
      release: `${pjson.version}_${process.platform}`,
    }),
  ],

  target: 'electron-renderer',
});

export default config;
