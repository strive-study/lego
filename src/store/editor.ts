import { ActionContext, Module } from 'vuex'
import store, { ActionPayload, GlobalDataProps } from '.'
import { v4 as uuidv4 } from 'uuid'
import {
  // AllComponentProps,
  ComponentData
  // imageDefaultProps,
  // textDefaultProps
} from 'strive-lego-bricks'
import {
  AllComponentProps,
  // ComponentData,
  imageDefaultProps,
  textDefaultProps
} from '../defaultProps'
import { message } from 'ant-design-vue'
import { cloneDeep, isArray } from 'lodash-es'
import { insertAt } from '@/helper'
import { ResData, ResWorkData, WorkData } from './resType'
import { compile } from 'path-to-regexp'
import axios, { AxiosRequestConfig } from 'axios'
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
    console.log('mutation结果', res)
    context.commit(commitName, res.data)
    return res.data
  }
}
export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}
export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
}
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'
export interface EditorProps {
  components: ComponentData[]
  currentElementId: string
  page: PageData
  copiedComponent?: ComponentData
  histories: HistoryProps[] // 历史操作记录栈
  historyIndex: number // 记录栈中所处操作记录位置
  cachedOldValues: any // 开始更新时的缓存值
  maxHistoryNumber: number
}
export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}

// 整体页面属性
export interface PageData {
  props: PageProps
  title: string
  // ----
  id?: string
  desc?: string
  coverImg?: string
}
export type AllFormProps = PageProps & AllComponentProps
export const editorTestComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层1',
    props: {
      ...textDefaultProps,
      text: 'hello',
      fontSize: '20px',
      color: '#000000',
      lineHeight: '1',
      textAlign: 'left',
      fontFamily: '',
      width: '100px',
      height: '100px',
      backgroundColor: '#efefef',
      left: '10px',
      top: '10px'
    }
  }
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello2',
  //     fontSize: '10px',
  //     fontWeight: 'bold',
  //     fontStyle: 'italic',
  //     textDecoration: 'underline',
  //     lineHeight: '2',
  //     textAlign: 'center',
  //     fontFamily: '',
  //     color: '#000000'
  //   },
  //   layerName: '图层2'
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello3',
  //     fontSize: '15px',
  //     actionType: 'url',
  //     textAlign: 'right',
  //     url: 'www.baidu.com',
  //     isEditing: true
  //   },
  //   layerName: '图层3'
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-image',
  //   layerName: '图层4',
  //   props: {
  //     ...imageDefaultProps,
  //     src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg',
  //     width: '100px'
  //   }
  // }
]
const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
  const shouldUpdateComponent = state.components.find(c => c.id === componentId)
  if (shouldUpdateComponent) {
    if (isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        shouldUpdateComponent.props[keyName] =
          type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      shouldUpdateComponent.props[newKey] =
        type === 'undo' ? oldValue : newValue
    }
  }
}
const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'url("https://static.imooc-lego.com/upload-files/%E5%B9%BC%E5%84%BF%E5%9B%AD%E8%83%8C%E6%99%AF%E5%9B%BE-994372.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px'
}
const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer: any = null
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, timeout)
  }
}

const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // 移动过则把当前index之后的记录全部清空
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex)
    state.historyIndex = -1
  }
  // 超过记录栈最大长度 使用LRU缓存模式
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}
const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElementId,
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key }
  })
  state.cachedOldValues = null
}
const pushHistoryDebounce = debounceChange(pushModifyHistory)
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: editorTestComponents,
    currentElementId: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5
  },
  actions: {
    fetchWork: actionWrapper('/works/:id', 'fetchWork'),
    saveWork: actionWrapper('/works/:id', 'saveWork', { method: 'patch' })
  },
  mutations: {
    resetEditor(state) {
      state.components = []
      ;(state.currentElementId = ''), (state.histories = [])
      state.historyIndex = -1
    },
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    },
    deleteComponent(state, id: string) {
      const currentComponent = state.components.find(c => c.id === id)
      if (currentComponent) {
        const currentIndex = state.components.findIndex(c => c.id === id)
        state.components = state.components.filter(c => {
          return c.id !== id
        })
        pushHistory(state, {
          id: uuidv4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: currentComponent,
          index: currentIndex
        })
        message.success('删除当前图层成功', 1)
      }
    },
    setActive(state, currentElementId: string) {
      state.currentElementId = currentElementId
    },
    undo(state) {
      // reset default
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1
      } else {
        state.historyIndex--
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add': {
          state.components = state.components.filter(
            c => c.id !== history.componentId
          )
          break
        }
        case 'delete': {
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          )
          break
        }
        case 'modify': {
          modifyHistory(state, history, 'undo')
          break
        }
      }
    },
    redo(state) {
      // reset default
      if (state.historyIndex === -1) {
        return
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add': {
          state.components.push(history.data)
          break
        }
        case 'delete': {
          state.components = state.components.filter(
            component => component.id !== history.componentId
          )
          break
        }
        case 'modify': {
          modifyHistory(state, history, 'redo')
          break
        }
      }
      state.historyIndex++
    },
    // 防抖更新
    updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
      const shouldUpdateComponent = state.components.find(
        c => c.id === (id || state.currentElementId)
      )
      if (shouldUpdateComponent) {
        if (isRoot) {
          // ts bug issues/31663
          ;(shouldUpdateComponent as any)[key as string] = value
        } else {
          const oldValue = isArray(key)
            ? key.map(key => shouldUpdateComponent.props[key])
            : shouldUpdateComponent.props[key]
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }
          pushHistoryDebounce(state, { key, value, id })
          if (isArray(key) && isArray(value)) {
            key.forEach((keyName, index) => {
              shouldUpdateComponent.props[keyName] = value[index]
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            shouldUpdateComponent.props[key] = value
          }
        }
      }
    },
    updatePage(state, { key, value, isRoot }) {
      if (isRoot) {
        state.page[key as keyof PageData] = value
      } else {
        state.page.props[key as keyof PageProps] = value
      }
    },
    copyComponent(state, id: string) {
      const currentComponent = store.getters.getElement(id)
      if (currentComponent) {
        state.copiedComponent = currentComponent
        message.success('已拷贝当前图层', 1)
      }
    },
    pasteCopiedComponent(state) {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = clone.layerName + '副本'
        state.components.push(clone)
        message.success('已黏贴当前图层', 1)
        pushHistory(state, {
          id: uuidv4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
      }
    },
    moveComponent(
      _state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const { direction, amount, id } = data
      const currentComponent = store.getters.getElement(id)
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id
            })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id
            })
            break
          }
          default:
            break
        }
      }
    },
    fetchWork(state, { data }: ResWorkData) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = content.props
      }
      state.components = content.components
    },
    saveWork(state, { data }: ResData<WorkData>) {
      console.log('saveWork', data)
    }
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(c => c.id === state.currentElementId)
    },
    getElement: state => (id: string) =>
      state.components.find(c => c.id === (id || state.currentElementId)),
    checkUndoDisable: state => {
      // 无历史操作记录 和 到记录栈尽头不能点击
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable: state => {
      // 无历史操作记录 和 到记录栈尽头不能点击
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true
      }
      return false
    }
  }
}

export default editor
