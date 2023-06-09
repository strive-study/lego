import store from '@/store'
import { templateTestData } from '@/store/templates'
import { ComponentData } from 'strive-lego-bricks'
import { TextComponentProps } from '@/defaultProps'
import { last, clone } from 'lodash-es'
import { editorTestComponents } from '@/store/editor'
const cloneComponents = clone(editorTestComponents)

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
          text: 'text1'
        }
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 1
      )
      const lastComponent = last(store.state.editor.components)
      expect(lastComponent?.props.text).toBe('text1')
    })

    it('update component should works fine', () => {
      const newProps = {
        key: 'text',
        value: 'update'
      }
      store.commit('updateComponent', newProps)
      const currentElement: ComponentData = store.getters.getCurrentElement
      expect(currentElement.props.text).toBe('update')
    })
  })
})
