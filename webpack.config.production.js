import webpack from 'webpack';
import BabiliPlugin from 'babili-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  devtool: 'source-map',

  entry: {
    main: ['babel-polyfill', './app/index.js'],
    popup: ['babel-polyfill', './app/popup.js'],
    idleTimePopup: ['babel-polyfill', './app/idlePopup.js'],
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
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!less-loader'
        )
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v=.*)?$|\.otf|\.woff(\?v=.*)?$|\.ttf(\?v=.*)?$|\.eot(\?v=.*)?$|\.woff?2(\?v=.*)?|\.html/, // eslint-disable-line max-len
        loader: 'url-loader',
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    // new BabiliPlugin({
      // // Disable deadcode until https://github.com/babel/babili/issues/385 fixed
      // deadcode: false,
    // }),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.ProvidePlugin({
      Immutable: 'immutable',
    }),
  ],

  target: 'electron-renderer'
});

export default config;
