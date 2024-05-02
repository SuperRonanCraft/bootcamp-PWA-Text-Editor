const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Webpack Plugin',
      }),
      new MiniCssExtractPlugin(),
      // InjectSW plugin (the naming structure for this plugin STINKS)
      new InjectManifest({ swSrc: './src-sw.js', swDest: 'service-worker.js' }),
      // Add ability to install this webapp
      new WebpackPwaManifest({
        name: 'Text Editor PWS',
        short_name: 'TextEditorPWA',
        description: 'An awesome PWA Text Editor!',
        background_color: '#ffffff',
        publicPath: './',
        fingerprints: false,
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: ['96', '144'], // REQUIRES 144x144 image for manifest to install properly...
            destination: path.join('logo'),
          },
          {
            src: path.resolve('favicon.ico'),
            size: '48x48',
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          //Builds our .css files
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          //Builds our images
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: 'asset/resource',
        },
        {
          //Builds our .js files
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};
