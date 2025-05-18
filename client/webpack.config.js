import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';


// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'development',

  entry: resolve(__dirname, '../src/index.js'),

  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },

  devtool: 'eval-source-map',

module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    },
    {
      enforce: 'pre',
      test: /\.js$/,
      //loader: 'source-map-loader',
      include: /node_modules/,
      exclude: [/webpack/, /react/, /react-dom/, /babel-loader/],
    },
  ],
},


  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  devServer: {
    static: {
      directory: join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      console.log('Dev server middleware is set up.');
      return middlewares;
    },
  },
};
