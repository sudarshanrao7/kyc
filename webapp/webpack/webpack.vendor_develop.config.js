var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


// let extractCSS = new ExtractTextPlugin({filename:'vendor.css',
//             allChunks: true
//     });
// let extractLESS = new ExtractTextPlugin({filename:'vendorless.css',
//             allChunks: true
//     });

// let extractSass = new ExtractTextPlugin({filename:'vendorsass.css',
//             allChunks: true
//     });	


module.exports = {
  context: path.resolve(process.cwd()),
  entry: {
    vendor: ['babel-polyfill','jquery','lodash-es', 'js-cookie','tether','sweetalert2', 'react-dropzone', 'react', 'react-dom', 'react-router-dom', 'axios', 'redux','react-redux','redux-thunk','react-router-redux','redux-form',
		'create-react-class','prop-types',  'react-toastify', 'react-select', 'react-tinymce', 'moment', 'react-hot-loader', 'redux-immutable-state-invariant','react-toolbox','react-toolbox/lib/commons.scss',
        'query-string','history'
	]
  },
  output: {
     crossOriginLoading: 'anonymous', 
      path: path.resolve('./dist/'),
      filename: "[name].bundle.js",
	  library: '[name]_lib',
	  pathinfo: true
  },
  //babelrc: false,
  //presets: options.presets,

  plugins: [
    //new BundleAnalyzerPlugin({analyzerMode: 'static'}),
	 new webpack.ProvidePlugin({
		 	'_': 'lodash-es',
			'jQuery': 'jquery',
			'$': 'jquery',
			'window.jQuery': 'jquery',
			'window.$': 'jquery'
		}),   	  
      new webpack.DefinePlugin({
        'APPVERSION':1,
        '__DEV__':true,
        'DEVICE':JSON.stringify('web'),
        'process.env':{
		 BROWSER: JSON.stringify(true),
		 BABEL_ENV:JSON.stringify('web'),
          'NODE_ENV': JSON.stringify('development'),
        }
     }),    
        // new LodashModuleReplacementPlugin({
        //     shorthands:true,
        //     collections:true,
        //     unicode:true,
        //     paths:true,
        //     cloning:true
        // }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// new CompressionPlugin({
		// 			asset: "[path].gz[query]",
		// 			algorithm: "gzip",
		// 			test: /\.js$|\.css$|\.html$/,
		// 			threshold: 0,
		// 			minRatio: 0
        // }),    

    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: 'dist/[name]-manifest.json',
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib'
    }),
  ],

  module: {
    rules: [
      { test: /\.jsx?$/, include: [ path.join(__dirname, './node_modules') ] , loader: 'babel-loader' , options:{plugins:['lodash','recharts'],presets:[[ "es2015", { "modules": false } ]]}}, // to transform JSX into JS
      { test: /\.rt?$/,include: [ path.join(__dirname, './node_modules') ]  ,use:[{loader:"babel-loader", options:{plugins:['lodash','recharts','es2015' ],presets:[[ "es2015", { "modules": false } ]] }},{loader:"react-templates-loader?modules=es6"}]},  
      {
          test: /(\.scss)$/,
          use: [{loader:"style-loader"},
           {loader:"css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"},
           {loader: 'sass-loader'},
           {loader:'jsontosass-loader?path=theme.json'}]
        },    
        // { test: /\.css$/, use: [{loader:"style-loader"},{loader:"css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"},
        // {
        // loader:"postcss-loader",
        // }]}, 
        { test: /\.css$/, use: [{loader:"style-loader"},{loader:"css-loader"}]}, 
         { test: /\.less$/, use: [{loader:"style-loader"},{loader:"css-loader"},{loader:"less-loader"}]},       
        { test: /\.png$/,  use:[{loader:  "url-loader?limit=100000"}] },
        { test: /\.jpg$/, use:[{loader:  "url-loader?limit=100000"}] },
        {test: /\.(woff|woff2)$/, use:[ {loader: 'url-loader?limit=10000&mimetype=application/font-woff'}]},
        { test: /\.(ttf|otf)$/, use:[ {loader: 'url-loader?limit=10000&mimetype=application/octet-stream' }]},
        {test: /\.eot$/, use:[ {loader: "file-loader"}]},
        {test: /\.gif$/,use:[{loader:  "url-loader?limit=100000"}] },
        {test: /\.svg$/, use:[ {loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}]} ,   
        { test: /\.html$/, use:[ {loader: "raw-loader" }]}
    ],
  }, 


  resolve: {
    modules: [path.resolve('src'),'node_modules'],
    extensions: ['.js', '.jsx','.rt','.css','.ts','.tsx','.less','.scss','.png','.jpg','.gif','.html','.svg']
  },
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  devtool: 'eval',
};