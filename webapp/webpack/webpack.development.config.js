var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WriteFilePlugin = require('write-file-webpack-plugin');
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
var HappyPack = require('happypack');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


const AUTOPREFIXER_BROWSERS = [
'Android 2.3',
'Android >= 4',
'Chrome >= 35',
'Firefox >= 31',
'Explorer >= 9',
'iOS >= 7',
'Opera >= 12',
'Safari >= 7.1'
];

const buildPath =path.resolve('./dist/');


module.exports = require('./webpack.base.config')({  
  output: {
    crossOriginLoading: 'anonymous', 
    pathinfo: true,
	  path: path.resolve('./dist/'),
      filename: "[name].js",
      publicPath: 'http://localhost:3002/dist/',
  },

  debug:true,

  plugins: [
            //new BundleAnalyzerPlugin({analyzerMode: 'static'}),
			new HappyPack({
				id: 'jsx',
				threads: 4,
				loaders: [ 'babel-loader?plugins=lodash' ]
			}),
			new HappyPack({
				id: 'rt',
				threads: 4,
				loaders: [ "babel-loader?plugins=lodash","react-templates-loader?modules=es6" ]
            }),
            // new LodashModuleReplacementPlugin({
            //     shorthands:true,
            //     collections:true,
            //     unicode:true,
            //     paths:true,
            //     cloning:true
            // }),
			new webpack.DllReferencePlugin({
				context: path.resolve(process.cwd()),
				manifest: require(path.join(buildPath, 'vendor-manifest.json')),
			}),	  
            //new ExtractTextPlugin('bundle.css', { allChunks: true }),
             new webpack.DefinePlugin({
              'APPVERSION':1,
              '__DEV__':true,
              'DEVICE': JSON.stringify('web'),
              'process.env':{
                BROWSER: JSON.stringify(true),
                BABEL_ENV:JSON.stringify('web'),
                'NODE_ENV': JSON.stringify('development'),
              }
            }),    
            new webpack.ProvidePlugin({
              '_': 'lodash-es',
              'jQuery': 'jquery',
              '$': 'jquery',
              'window.jQuery': 'jquery',
              'window.$': 'jquery'
            }),
            new webpack.optimize.CommonsChunkPlugin({name: "common",filename: "common.bundle.js"}),    
            //new WriteFilePlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error     
           //new HtmlWebpackPlugin({template: './src/index.html'}), 
            new DashboardPlugin(dashboard.setData),     
            new BundleTracker({filename: './webpack-dev-stats.json'}),
            new WebpackNotifierPlugin({ alwaysNotify: true })
  ],

            
  module: {
    rules: [
        { test: /\.rt?$/,exclude: /node_modules/ , use: [{ loader:'happypack/loader?id=rt' }] 
		},      
        //{ test: /(\.ts|\.tsx)$/,   loaders:['babel','ts-loader'] },
         { test: /\.jsx?$/, exclude: /node_modules/, use: [ {loader:'happypack/loader?id=jsx' }] },
        {
          test: /(\.scss)$/,
          use: [{loader:"style-loader"},
           {loader:"css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"},
           {loader: 'sass-loader'},
           {loader:'jsontosass-loader?path=theme.json'}]},    
           { test: /\.css$/, use: [{loader:"style-loader"},{loader:"css-loader"}]}, 
         { test: /\.less$/, use: [{loader:"style-loader"},{loader:"css-loader"},{loader:"less-loader"}]}, 
          { test: /\.png$/,  use:[{loader:  "url-loader?limit=100000"}] },
          { test: /\.(jpg|jpeg)$/, use:[{loader:  "url-loader?limit=100000"}] },
          {test: /\.(woff|woff2)$/, use:[ {loader: 'url-loader?limit=10000&mimetype=application/font-woff'}]},
	  	  { test: /\.(ttf|otf)$/, use:[ {loader: 'url-loader?limit=10000&mimetype=application/octet-stream' }]},
          {test: /\.eot$/, use:[ {loader: "file-loader"}]},
          {test: /\.gif$/,use:[{loader:  "url-loader?limit=100000"}] },
          {test: /\.svg$/, use:[ {loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}]} ,   
          { test: /\.html$/, use:[ {loader: "raw-loader" }]}
    ],
  },
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  devtool: 'eval',
});