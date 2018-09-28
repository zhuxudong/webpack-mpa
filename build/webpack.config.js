const fs = require("fs");
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const portfinder = require('portfinder')
const isDev = process.env.NODE_ENV === "dev"

/**基本参数*/
const base = require('./base')

/**多页面数组 ["home","about"...]*/
const pages =
  fs.readdirSync(path.resolve(__dirname, "../src/page"))
    .filter((filename) => {
      if (filename === "_template")
        return false;
      let stats = fs.statSync(path.resolve(__dirname, "../src/page", filename));
      return stats.isDirectory();
    })

/**每个页面的独立js,babel,压缩，混淆，引入*/
let entry = {}
pages.forEach((pageName) => {
  entry[pageName] = ["babel-polyfill", "./" + pageName + "/index.js"]
})
/**基本配置*/
let config = {
  context: path.resolve(__dirname, '../src/page'),
  entry: entry,
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].[hash].js",
    publicPath: base.publicPath,
    chunkFilename: path.join('js/[id].[chunkhash].js')
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'page': path.resolve(__dirname, '../src/page')
    }
  },
  externals: {
    jquery: "jQuery"
  },
  module: {
    rules: [
      // {test: /\.(htm|html)$/i, loader: "html-withimg-loader"},
      {test: /\.html$/, loader: "html-loader"},
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader"]
        })
      },
      {
        test: /\.less/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader", "less-loader"]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, use: [
          {
            loader: 'url-loader',
            options: {
              limit: base.urlLimit,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: base.urlLimit,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: base.urlLimit,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [].concat.call([],
    new ExtractTextPlugin('css/[name].[contenthash:7].css'),
    pages.map((pageName) => {
      return new HtmlWebpackPlugin({
        template:path.resolve(__dirname, "../src/page/" + pageName + "/index.html"),
        filename: pageName + ".html",
        chunks: ["common", pageName],
        test:"123"
      })
    }))
}
/**开发环境*/
if (isDev) {
  config.devtool = 'eval-source-map'
  config.devServer = {
    hot: true,
    quiet: true,
    host: base.host,
    port: base.port,
    overlay: {
      warnings: false,
      errors: true
    },
    watchOptions: {
      poll: false,
    }
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  )
  module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.devServer.port
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        process.env.PORT = port
        config.devServer.port = port
        config.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${config.devServer.host}:${port}`],
          }
        }))
        resolve(config)
      }
    })
  })
}
/**生产环境*/
else {
  config.plugins.push(
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        compress: base.compress
      }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../', base.copyDir),
      to: base.copyDir,
      ignore: ['.*']
    }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      minChunks: 2,
      minSize: 1
    }))
  module.exports = config;
}
