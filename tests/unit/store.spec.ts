import store from '@/store'
import { templateTestData } from '@/store/templates'
import { ComponentData } from 'strive-lego-bricks'
import { TextComponentProps } from '@/defaultProps'
import { textDefaultProps } from '@/defaultProps'
import { last, clone } from 'lodash-es'
import { editorTestComponents } from '@/store/editor'
const cloneComponents = clone(editorTestComponents)
jest.mock('ant-design-vue')
describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })

  describe('test user module', () => {
    it('test login mutation', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })

    it('test logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })

  describe('test templates module', () => {
    it('should have deafult templates', () => {
      expect(store.state.templates.data).toHaveLength(templateTestData.length)
    })

    it('should get the correct template by Id', () => {
      const selectTemplate = store.getters.getTemplateById(1)
      expect(selectTemplate.title).toBe('前端架构师直播海报')
    })
  })

  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(
        editorTestComponents.length
      )
    })

    it('should get current component when set active one component', () => {
      expect(store.commit('setActive', editorTestComponents[0].id))
      expect(store.state.editor.currentElementId).toBe(
        editorTestComponents[0].id
      )
      const currentElement = store.getters.getCurrentElement
      expect(currentElement.id).toBe(editorTestComponents[0].id)
    })

    it('add component should works fine', () => {
      const payload: ComponentData = {
        name: 'l-text',
        id: '1234',
        props: {
          ...textDefaultProps,
          text: 'text1'
        }
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 1
      )
      const lastComponent = last(store.state.editor.components)
      expect(lastComponent?.props.text).toBe('text1')
      expect(lastComponent?.layerName).toBe('图层2')
    })

    it('copy & paste component should works fine', () => {
      store.commit('copyComponent')
      expect(store.state.editor.copiedComponent).toBeDefined()
      store.commit('pasteCopiedComponent')
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 2
      )
      const lastComponent = last(store.state.editor.components)
      // 拷贝了上面active的component
      expect(lastComponent?.props).toEqual(cloneComponents[0].props)
    })

    it('move component should works', () => {
      const currentElement = store.getters.getCurrentElement as ComponentData
      const oldLeft = parseInt(currentElement.props.left || '0')
      const oldTop = parseInt(currentElement.props.top || '0')
      store.commit('moveComponent', {
        direction: 'Left',
        amount: 5,
        id: currentElement.id
      })
      expect(currentElement.props.left).toBe(oldLeft - 5 + 'px')
      store.commit('moveComponent', {
        direction: 'Right',
        amount: 3,
        id: currentElement.id
      })
      expect(currentElement.props.left).toBe(oldLeft - 5 + 3 + 'px')
      store.commit('moveComponent', {
        direction: 'Up',
        amount: 4,
        id: currentElement.id
      })
      expect(currentElement.props.top).toBe(oldTop - 4 + 'px')
      store.commit('moveComponent', {
        direction: 'Down',
        amount: 1,
        id: currentElement.id
      })
      expect(currentElement.props.top).toBe(oldTop - 4 + 1 + 'px')
    })

    it('update component should works fine', () => {
      const newProps = {
        key: 'text',
        value: 'update'
      }
      store.commit('updateComponent', newProps)
      const currentElement: ComponentData = store.getters.getCurrentElement
      expect(currentElement.props.text).toBe('update')
      const newProps2 = {
        key: 'layerName',
        value: 'new layer',
        isRoot: true
      }
      store.commit('updateComponent', newProps2)
      expect(currentElement.layerName).toBe('new layer')
    })

    it('delete component should works fine', () => {
      const currentElement: ComponentData = store.getters.getCurrentElement
      store.commit('deleteComponent', currentElement.id)
      expect(
        store.state.editor.components.find(c => c.id === currentElement.id)
      ).toBeFalsy()
    })
  })
})
