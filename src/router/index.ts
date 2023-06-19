import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/Index.vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '欢迎来到乐高编辑器'
        }
      },
      {
        path: 'template/:id',
        name: 'template',
        component: () => import('@/views/TemplateDetail.vue'),
        meta: {
          title: '模板详情'
        }
      }
    ]
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import('@/views/Editor.vue'),
    meta: {
      requiredLogin: true,
      title: '编辑我的设计'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      // disableLoading: true
      redirectAlreadyLogin: true,
      title: '登录乐高'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async to => {
  const { user } = store.state
  const { token, isLogin } = user
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta
  if (title) {
    document.title = title as string
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        await store.dispatch('fetchCurrentUser')
        if (redirectAlreadyLogin) {
          return ''
        }
      } catch (error) {
        message.error('登录状态已过期，请重新登录', 2)
        store.commit('logout')
        return '/login'
      }
    } else {
      if (requiredLogin) {
        return '/login'
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return '/'
    }
  }
})
export default router
