import { Module } from 'vuex'
import { GlobalDataProps } from '.'
import { v4 as uuidv4 } from 'uuid'
import { AllComponentProps, ComponentData } from 'strive-lego-bricks'

export interface EditorProps {
  components: ComponentData[]
  currentElementId: string //对应上面id
}

export const editorTestComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello', fontSize: '20px' }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello2',
      fontSize: '10px',
      fontWeight: 'bold',
      fontStyle: 'italic',
      textDecoration: 'underline',
      lineHeight: '2',
      textAlign: 'center',
      fontFamily: '',
      color: '#000000'
    }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3',
      fontSize: '15px',
      actionType: 'url',
      textAlign: 'right',
      url: 'www.baidu.com',
      isEditing: true
    }
  }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: editorTestComponents,
    currentElementId: ''
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
    updateComponent(state, { key, value }) {
      const shouldUpdateComponent = state.components.find(
        c => c.id === state.currentElementId
      )
      if (shouldUpdateComponent) {
        shouldUpdateComponent.props[key as keyof AllComponentProps] = value
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
