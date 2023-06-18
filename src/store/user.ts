import { ActionContext, Module } from 'vuex'
import { GlobalDataProps } from '.'
import axios, { AxiosRequestConfig } from 'axios'
import { ResData } from './resType'
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
  data?: UserDataProps
}

const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: 'get' }
) => {
  return async (context: ActionContext<any, any>, payload?: any) => {
    const newConfig = { ...config, data: payload }
    const { data } = await axios(url, newConfig)
    context.commit(commitName, data)
    return data
  }
}
const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false
  },
  mutations: {
    fetchToken(state, rawData: ResData<string>) {
      const { data } = rawData
      state.token = data
      axios.defaults.headers.common.Authorization = `Bearer ${data}`
    },
    fetchCurrentUser(state, rawData: ResData<UserDataProps>) {
      state.isLogin = true
      console.log('rawData', rawData)
      state.data = rawData.data
    }
    // logout(state) {
    //   state.isLogin = false
    //   state.username = ''
    // }
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
