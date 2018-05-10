var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');



module.exports = (options) => ({
  cache: true,	
  context: path.resolve(process.cwd()),
  entry: {
    webapp: ['./src/js/index']
  },
  output: Object.assign({
      path: path.resolve('./dist/'),
      filename: "[name]/[name].js"
  },options.output),
  //babelrc: false,
  //presets: options.presets,

  plugins: options.plugins,
  //debug:options.debug,
//   externals: {
//   },
  stats: {
        // Nice colored output
        colors: true
  },

  module: {
    rules: options.module.rules,
    noParse: options.module.noParse
  },
  devtool: options.devtool,
  devServer:options.devServer,
  resolve: {
    modules: [path.resolve('src'),'node_modules'],
    extensions: ['.js', '.jsx','.rt','.css','.ts','.tsx','.less','.scss','.png','.jpg','.gif','.html','.svg']
  },
});