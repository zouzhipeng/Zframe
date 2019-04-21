

const path = require ('path');
const webpack = require("webpack");
module.exports = {
  entry: {
    Zframe: ["./src/js/Zframe.js"]
  },
  output: {
    path: path.resolve (__dirname, 'dll'),
    filename: "[name].dll.js",
    library: '[name]_dll_[hash]',
  },
  plugins: [
    new webpack.DllPlugin ({
      path: path.join (__dirname, 'dll', '[name].manifest.json'),
      name: '[name]_dll_[hash]',
      context: __dirname,
    }),
  ],
};