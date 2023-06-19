import { ActionContext, Module } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { ResData } from './resType'
import { ActionPayload, GlobalDataProps } from './index'
import router from '@/router'
import { compile } from 'path-to-regexp'

export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: 'get' }
) => {
  return async (
    context: ActionContext<any, any>,
    payload: ActionPayload = {}
  ) => {
    const { urlParams, data } = payload
    const newConfig = { ...config, data, opName: commitName }
    let newURL = url
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent })
      newURL = toPath(urlParams)
    }
    const res = await axios(newURL, newConfig)
    context.commit(commitName, res.data)
    return res.data
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
      state.data = rawData.data
    },
    logout(state) {
      state.isLogin = false
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
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
