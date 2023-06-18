import { Module } from 'vuex'
import { GlobalDataProps } from '.'
export interface GlobalStatus {
  requestNumber: number
}

const global: Module<GlobalStatus, GlobalDataProps> = {
  state: {
    requestNumber: 0
  },
  mutations: {
    startLoading(state) {
      state.requestNumber++
    },
    finishLoading(state) {
      setTimeout(() => {
        state.requestNumber--
      }, 1000)
    }
  },
  getters: {
    isLoading(state) {
      return state.requestNumber > 0
    }
  }
}

export default global
