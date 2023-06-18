import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import axios, { AxiosRequestConfig } from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
export type _AxiosRequestConfig = AxiosRequestConfig & {
  opName?: string
}
const baseURL = 'http://localhost:7001'
axios.defaults.baseURL = `${baseURL}/api`
axios.interceptors.request.use(config => {
  const newConfig = config as _AxiosRequestConfig
  store.commit('startLoading', { opName: newConfig.opName })
  return config
})
axios.interceptors.response.use(res => {
  const { config } = res
  const newConfig = config as _AxiosRequestConfig
  store.commit('finishLoading', { opName: newConfig.opName })
  return res
})
const app = createApp(App)
app.use(Antd).use(router).use(store).mount('#app')
