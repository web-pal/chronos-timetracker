import express from 'express';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';

import config from './webpack.config.development';

const app = express();
const bundler = webpack(config);
const PORT = 3000;

const wdm = webpackDevMiddleware(bundler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

app.use(wdm);

app.use(webpackHotMiddleware(bundler));

const server = app.listen(PORT, 'localhost', (err) => {
  if (err) throw err;
  console.log(`Dev server listening at localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
