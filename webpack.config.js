const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    'auth0-bundle': './public/app/auth0-bundle.js',
    main: './public/js/main.js',
    auth: './public/js/auth0-client.js',
    supabase: './public/js/supabase-client.js',
    sync: './public/js/sync-manager.js',
    chat: './public/js/chat-client.js'
  },
  output: {
    filename: isProduction ? 'js/[name].[contenthash].min.js' : 'js/[name].js',
    path: path.resolve(__dirname, 'public/dist'),
    clean: true,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    port: 8080,
    proxy: [
      {
        context: ['/api', '/auth'],
        target: 'http://localhost:3000'
      }
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              sourceMap: !isProduction,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main', 'auth', 'supabase', 'sync'],
    }),
    new HtmlWebpackPlugin({
      template: './public/chat.html',
      filename: 'chat.html',
      chunks: ['main', 'auth', 'supabase', 'sync', 'chat'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

// Add service worker in production
module.exports.plugins.push(
  new GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
        },
      },
      {
        urlPattern: /^https:\/\/api\.mapbox\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'mapbox-api',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
    ],
  })
);
