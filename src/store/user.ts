import { Module } from 'vuex'
import { GlobalDataProps } from '.'
import axios from 'axios'
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

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false
  },
  mutations: {
    login(state, rawData: ResData<string>) {
      console.log('------------', rawData)
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
    login({ commit }, payload) {
      return axios.post('/users/loginByPhoneNumber', payload).then(res => {
        console.log(res)
        commit('login', res.data)
      })
    },
    fetchCurrentUser({ commit }) {
      return axios.get('/users/getUserInfo').then(res => {
        commit('fetchCurrentUser', res.data)
      })
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  }
}

export default user
