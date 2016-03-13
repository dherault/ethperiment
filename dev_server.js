'use strict';

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const appConfig = require('./config.json');

const port = appConfig.webpackPort;
const url = `http://localhost:${port}`;

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    `webpack-dev-server/client?${url}`,
    'webpack/hot/dev-server',
    './app/client.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      {
        test: /\.json/,
        loaders: ['json'],
        // exclude: /node_modules/,
      },
    ],
  },
};

const compiler = webpack(config);
let t;

compiler.plugin('compile', () => {
  t = Date.now();
  console.log(chalk.green('Bundling...'));
});

compiler.plugin('done', () => {
  console.log(chalk.green(`Bundled in ${Date.now() - t}ms!`));
});

const server = new WebpackDevServer(compiler, {
  contentBase: './dist',
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  noInfo: true,
  stats: {
    colors: true,
  },
});

server.listen(port, '0.0.0.0', (err) => {
  if (err) return console.log(err.stack);
  
  console.log(`WDS listening on port ${port}.`);
});
  