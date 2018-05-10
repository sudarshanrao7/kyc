var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack/webpack.development.config.js');

for (var key in config.entry) {
  if (config.entry.hasOwnProperty(key) && key !== "vendor" ) {
     config.entry[key].unshift('react-hot-loader/patch','webpack-dev-server/client?http://localhost:3002','webpack/hot/only-dev-server'); 
  }
}

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  inline: true,
  quiet: true,
  contentBase: './',
  historyApiFallback: {
      index: config.output.publicPath
} 
}).listen(3002, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 0.0.0.0:3002');
});