import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import {
  spawn,
} from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';

import config from './webpack.renderer.base';


module.exports = env => merge(config(env), {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    publicPath: '/',
    filename: '[name].js',
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
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || '1'),
    }),

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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
  ],

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    hot: true,
    lazy: false,
    compress: true,
    stats: 'minimal',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: true,
    },
    before() {
      spawn(
        'npm',
        ['run', 'start-main-dev'],
        {
          shell: true,
          env: {
            ...process.env,
            ...env,
            ELECTRON_ENABLE_LOGGING: 'true',
            ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
          },
          stdio: 'inherit',
        },
      )
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    },
  },
});
