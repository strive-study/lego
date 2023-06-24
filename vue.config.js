const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
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
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
      )
    }
  }
})
