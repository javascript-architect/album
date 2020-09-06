const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');

module.exports = {
  entry: ['./src/app/app.js', './src/app/app.css'],
  output: {
    path: dist,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    contentBase: src,
    compress: true,
    hot: true,
    port: 9000,
  },
};
