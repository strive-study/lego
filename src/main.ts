import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
import { ResData } from '@/store/resType'

export type _AxiosRequestConfig = AxiosRequestConfig & {
  opName?: string
}
const baseURL = 'http://localhost:7001'
axios.defaults.baseURL = `${baseURL}/api`
axios.interceptors.request.use(config => {
  const newConfig = config as _AxiosRequestConfig
  store.commit('setError', { status: false, message: '' })
  store.commit('startLoading', { opName: newConfig.opName })
  return config
})
axios.interceptors.response.use(
  (res: AxiosResponse<ResData>) => {
    const { config, data } = res
    const newConfig = config as _AxiosRequestConfig
    store.commit('finishLoading', { opName: newConfig.opName })
    const { errno, message } = data
    if (errno !== 0) {
      store.commit('setError', { status: true, message })
      return Promise.reject(data)
    }
    return res
  },
  (e: AxiosError) => {
    const newConfig = e.config as _AxiosRequestConfig
    store.commit('setError', {
      status: true,
      message: e.message || '服务器错误'
    })
    store.commit('finishLoading', { opName: newConfig.opName })
    return Promise.reject(e)
  }
)
const app = createApp(App)
app.use(Antd).use(router).use(store).mount('#app')
