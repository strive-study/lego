const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
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
    config.optimization.splitChunks = {
      maxInitialRequests: 30,
      minSize: 0,
      chunks: 'all',
      cacheGroups: {
        antVendor: {
          name: 'ant-design-vue',
          test: /[\\/]node_modules[\\/](ant-design-vue)[\\/]/
        },
        canvasVendor: {
          name: 'html2canvas',
          test: /[\\/]node_modules[\\/](html2canvas)[\\/]/
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/](!html2canvas)(!ant-design-vue)[\\/]/
        }
      }
    }
  }
})
