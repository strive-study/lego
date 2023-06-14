import { Module } from 'vuex'
import { GlobalDataProps } from '.'
import { v4 as uuidv4 } from 'uuid'
import {
  AllComponentProps,
  ComponentData,
  imageDefaultProps,
  textDefaultProps
} from 'strive-lego-bricks'

export interface EditorProps {
  components: ComponentData[]
  currentElementId: string
  page: PageData
}

// 整体页面属性
export interface PageData {
  props: { [key: string]: any }
  title: string
}

export const editorTestComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { ...textDefaultProps, text: 'hello', fontSize: '20px' },
    layerName: '图层1'
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: 'hello2',
      fontSize: '10px',
      fontWeight: 'bold',
      fontStyle: 'italic',
      textDecoration: 'underline',
      lineHeight: '2',
      textAlign: 'center',
      fontFamily: '',
      color: '#000000'
    },
    layerName: '图层2'
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: 'hello3',
      fontSize: '15px',
      actionType: 'url',
      textAlign: 'right',
      url: 'www.baidu.com',
      isEditing: true
    },
    layerName: '图层3'
  },
  {
    id: uuidv4(),
    name: 'l-image',
    layerName: '图层4',
    props: {
      ...imageDefaultProps,
      src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg',
      width: '100px'
    }
  }
]

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: '',
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
    }
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component)
    },
    deleteComponent(state, id: string) {
      state.components = state.components.filter(c => {
        return c.id !== id
      })
    },
    setActive(state, currentElementId: string) {
      state.currentElementId = currentElementId
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
          shouldUpdateComponent.props[key as keyof AllComponentProps] = value
        }
      }
    }
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(c => c.id === state.currentElementId)
    }
  }
}

export default editor
