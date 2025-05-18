import { resolve, join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const mode = 'development';
export const entry = '../src/index.js';
export const output = {
  path: resolve(__dirname, 'dist'),
  filename: 'bundle.js',
  clean: true, // Clean output folder before build
};
export const devtool = 'source-map';
export const module = {
  rules: [
    {
      test: /\.js$/, // Handles JS and JSX if Babel is set up
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader', // Requires .babelrc or babel.config.js
      },
    },
    {
      test: /\.css$/, // Optional: if you use CSS
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i, // For image assets
      type: 'asset/resource',
    },
  ],
};
export const plugins = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
];
export const devServer = {
  static: {
    directory: join(__dirname, 'public'),
  },
  port: 3000,
  open: true,
  hot: true,
  setupMiddlewares: (middlewares, devServer) => {
    console.log('Dev server middleware is set up.');
    return middlewares;
  },
};
