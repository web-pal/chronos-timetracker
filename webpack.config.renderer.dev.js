/* eslint global-require: 0, import/no-dynamic-require: 0 */

/**
 * Build config for development electron renderer process that uses
 * Hot-Module-Replacement
 *
 * https://webpack.js.org/concepts/hot-module-replacement/
 */

import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import merge from 'webpack-merge';
import { spawn, execSync } from 'child_process';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dll = path.resolve(process.cwd(), 'dll');
const manifest = path.resolve(dll, 'vendor.json');

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(dll) && fs.existsSync(manifest))) {
  console.log(chalk.black.bgYellow.bold(
    'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"',
  ));
  execSync('npm run build-dll');
}

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  entry: {
    main: [
      'react-hot-loader/patch',
      path.join(__dirname, 'app/index.jsx'),
    ],
    screenPopup: [
      path.join(__dirname, 'app/screenPopup.jsx'),
    ],
    idleTimePopup: [
      path.join(__dirname, 'app/idlePopup.jsx'),
    ],
  },

  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: '[name]-bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: { chrome: 52 },
                modules: false,
                useBuiltIns: true,
              }],
              'stage-0',
              'react',
            ],
            cacheDirectory: true,
            plugins: [
              // Here, we include babel plugins that are only required for the
              // renderer process. The 'transform-*' plugins must be included
              // before react-hot-loader/babel
              //
              'transform-class-properties',
              'transform-es2015-classes',
              'react-hot-loader/babel',
            ],
          },
        },
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader',
        }],
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

  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var',
    }),

    /**
     * https://webpack.js.org/concepts/hot-module-replacement/
     */

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || '"development"'),
      'process.env.DISABLE_MIXPANEL': JSON.stringify(process.env.DISABLE_MIXPANEL || '1'),
    }),

    // Define global vars
    new webpack.ProvidePlugin({
      Immutable: 'immutable',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'app/actions'),
      path.join(__dirname, 'app/types'),
      path.join(__dirname, 'app/components'),
      path.join(__dirname, 'app/utils'),
      path.join(__dirname, 'app/selectors'),
      path.join(__dirname, 'app/styles'),
      path.join(__dirname, 'app/config'),
      'node_modules',
    ],
    // We need it because of atlaskit styled-components version
    alias: {
      'styled-components2': path.resolve(__dirname, 'app/styled-components.min.js'),
    },
  },

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: true,
    },
    setup() {
      if (process.env.START_HOT) {
        console.log('Staring Main Process...');
        spawn(
          'npm',
          ['run', 'start-main-dev'],
          { shell: true, env: process.env, stdio: 'inherit' },
        )
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      }
    },
  },
});
