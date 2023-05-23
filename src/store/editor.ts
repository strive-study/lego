import { Module } from 'vuex'
import { GlobalDataProps } from '.'
import { v4 as uuidv4 } from 'uuid'
interface ComponentData {
  props: { [key: string]: any }
  id: string
  name: string //组件名称 l-text l-image
}

export interface EditorProps {
  components: ComponentData[]
  currentElementId: string //对应上面id
}

export const editorTestComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello', fontSize: '20px', color: 'red' }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello2', fontSize: '10px', fontWeight: 'bold' }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3',
      fontSize: '15px',
      actionType: 'url',
      url: 'www.baidu.com'
    }
  }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: editorTestComponents,
    currentElementId: ''
  }
}

export default editor
