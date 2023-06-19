import { ActionContext, Module } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { ResData } from './resType'
import { GlobalDataProps } from './index'
import router from '@/router'
export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: 'get' }
) => {
  return async (context: ActionContext<any, any>, payload?: any) => {
    const newConfig = { ...config, data: payload, opName: commitName }
    const { data } = await axios(url, newConfig)
    context.commit(commitName, data)
    return data
  }
}
export interface UserDataProps {
  username?: string
  nickName?: string
  role?: 'admin' | 'normal'
  createdAt?: Date
  updatedAt?: Date
  picture?: string
  phoneNumber?: string
  type?: 'email' | 'phoneNumber' | 'oauth'
  _id?: string
}
export interface UserProps {
  isLogin: boolean
  token?: string
  data?: UserDataProps // 用户信息
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    fetchToken(state, rawData: ResData<string>) {
      const { data } = rawData
      state.token = data
      localStorage.setItem('token', data)
      axios.defaults.headers.common.Authorization = `Bearer ${data}`
    },
    fetchCurrentUser(state, rawData: ResData<UserDataProps>) {
      state.isLogin = true
      console.log('rawData', rawData)
      state.data = rawData.data
    },
    logout(state) {
      state.isLogin = false
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
      router.push('/login')
    }
  },
  actions: {
    // 手机号+验证码获取token==>token
    fetchToken: actionWrapper('/users/loginByPhoneNumber', 'fetchToken', {
      method: 'post'
    }),
    // 根据token获取用户信息
    fetchCurrentUser: actionWrapper('/users/getUserInfo', 'fetchCurrentUser'),
    // 登录并
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('fetchToken', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  }
}

export default user
