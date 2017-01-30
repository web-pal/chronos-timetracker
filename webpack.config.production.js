import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  devtool: 'cheap-source-map',

  entry: {
    main: './src/index.js',
    popup: './src/popup.js',
    idlePopup: './src/idlePopup.js',
  },

  output: {
    publicPath: '../dist/',
    filename: '../dist/[name]-bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
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
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v=.*)?$|\.otf|\.woff(\?v=.*)?$|\.ttf(\?v=.*)?$|\.eot(\?v=.*)?$|\.woff?2(\?v=.*)?/, // eslint-disable-line max-len
        loader: 'file-loader?name=[path][name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
      Immutable: 'immutable',
    }),
  ],

  target: 'electron-renderer'
});

export default config;
