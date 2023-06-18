import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'

const baseURL = 'http://localhost:7001'
axios.defaults.baseURL = `${baseURL}/api`
const app = createApp(App)
app.use(Antd).use(router).use(store).mount('#app')
