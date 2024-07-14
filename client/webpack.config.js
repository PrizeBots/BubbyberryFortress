// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(`!!! Webpack is packing!!!`);

module.exports = {
  entry: './Main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // Change to 'production' for production build
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the 'dist' directory
    },
    hot: true, // Enable Hot Module Replacement (HMR)
    performance: {
      hints: false
    },
    devtool: 'source-map',
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Path to your index.html file
    }),
  ],
};
