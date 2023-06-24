const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const isStaging = !!process.env.VUE_APP_STAGING
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyzeMode = process.env.ANALYZE_MODE
module.exports = defineConfig({
  transpileDependencies: true,
  // 生产环境使用OSS(staging不使用)
  // 其他环境使用绝对路径
  publicPath: isProduction && !isStaging ? 'oss' : '/',
  devServer: {
    client: {
      overlay: false
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // #3E7FFF
            // 'primary-color': 'red'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    )
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
      )
    }
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240 // 文件超过10k大小进行压缩
        })
      )
    }
    // config.optimization.splitChunks = {
    //   maxInitialRequests: 30,
    //   minSize: 300 * 1024,
    //   chunks: 'all',
    //   cacheGroups: {
    //     antVendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         // const packageName = module.context.match(
    //         //   /[\\/]node_modules[\\/](.*?)[\\/]|$/
    //         // )[1]
    //         const packageName = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //         )[1]
    //         return `npm/${packageName.replace('@', '')}`
    //       }
    //     }
    //   }
    // }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Strive乐高'
      return args
    })
  }
})
