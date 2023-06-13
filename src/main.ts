import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import Lego from 'lego-bricks'
import router from './router'
import store from './store'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
import 'lego-bricks/dist/bundle.css'

const app = createApp(App)
app.use(Antd).use(router).use(store).use(Lego).mount('#app')
