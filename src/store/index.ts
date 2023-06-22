import { ActionContext, createStore } from 'vuex'
import templates, { TemplatesProps } from './templates'
import user, { UserProps } from './user'
import editor, { EditorProps } from './editor'
import global, { GlobalStatus } from './global'
import { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { compile } from 'path-to-regexp'
import { objToQueryStirng } from '@/helper'
import { forEach } from 'lodash-es'
export interface ActionPayload {
  urlParams?: { [key: string]: any }
  data?: any
  searchParams?: { [key: string]: any }
}
export function actionWrapper(
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: 'get' }
) {
  return async (
    context: ActionContext<any, any>,
    payload: ActionPayload = {}
  ) => {
    const { urlParams, data, searchParams } = payload
    const newConfig = { ...config, data, opName: commitName }
    let newURL = url
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent })
      newURL = toPath(urlParams)
    }
    if (searchParams) {
      const search = new URLSearchParams()
      forEach(searchParams, (value, key) => {
        search.append(key, value)
      })
      // newURL += `?${objToQueryStirng(searchParams)}`
      newURL += `?${search.toString()}`
    }
    console.log(newURL)
    const res = await axios(newURL, newConfig)
    context.commit(commitName, { payload, ...res.data })
    return res.data
  }
}
export interface GlobalDataProps {
  user: UserProps
  templates: TemplatesProps
  editor: EditorProps
  global: GlobalStatus
}

const store = createStore({
  modules: {
    user,
    templates,
    editor,
    global
  }
})

export default store
