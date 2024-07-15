const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(`!!! Webpack is packing!!!`);

module.exports = {
  entry: './Main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // Change to 'development' for dev mode
  devtool: 'source-map', // Source maps for debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the 'dist' directory
    },
    hot: true, // Enable Hot Module Replacement (HMR)
    liveReload: true, // Enable live reloading
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Ensure this path is correct
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './Assets'), to: path.resolve(__dirname, 'dist/Assets') }
      ],
    }),
  ],
};
