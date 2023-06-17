import { Module } from 'vuex'
import store, { GlobalDataProps } from '.'
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
import { cloneDeep } from 'lodash-es'
import { insertAt } from '@/helper'
export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'
export interface EditorProps {
  components: ComponentData[]
  currentElementId: string
  page: PageData
  copiedComponent?: ComponentData
  histories: HistoryProps[] // 历史操作记录栈
  historyIndex: number // 记录栈中所处操作记录位置
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

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'url("https://static.imooc-lego.com/upload-files/%E5%B9%BC%E5%84%BF%E5%9B%AD%E8%83%8C%E6%99%AF%E5%9B%BE-994372.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px'
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: editorTestComponents,
    currentElementId: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      state.histories.push({
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
        state.histories.push({
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
          const { componentId, data } = history
          const { key, oldValue } = data
          const updatedComponent = state.components.find(
            c => c.id === componentId
          )
          if (updatedComponent) {
            updatedComponent.props[key as keyof AllComponentProps] = oldValue
          }
          break
        }
      }
    },
    updateComponent(state, { key, value, id, isRoot }) {
      const shouldUpdateComponent = state.components.find(
        c => c.id === (id || state.currentElementId)
      )
      if (shouldUpdateComponent) {
        if (isRoot) {
          // ts bug issues/31663
          ;(shouldUpdateComponent as any)[key] = value
        } else {
          const oldValue =
            shouldUpdateComponent.props[key as keyof AllComponentProps]
          shouldUpdateComponent.props[key as keyof AllComponentProps] = value
          state.histories.push({
            id: uuidv4(),
            componentId: id || state.currentElementId,
            type: 'modify',
            data: {
              oldValue,
              newValue: value,
              key
            }
          })
        }
      }
    },
    updatePage(state, { key, value }) {
      state.page.props[key as keyof PageProps] = value
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
        state.histories.push({
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
    }
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(c => c.id === state.currentElementId)
    },
    getElement: state => (id: string) =>
      state.components.find(c => c.id === (id || state.currentElementId))
  }
}

export default editor
