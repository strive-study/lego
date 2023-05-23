import { Module } from 'vuex'
import { GlobalDataProps } from '.'

export interface UserProps {
  isLogin: boolean
  username?: string
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    username: ''
  },
  mutations: {
    login(state) {
      state.isLogin = true
      state.username = 'xiaoli'
    },
    logout(state) {
      state.isLogin = false
      state.username = ''
    }
  }
}

export default user
