import store from '@/store'
import { ComponentData } from 'strive-lego-bricks'
import { last, clone } from 'lodash-es'
import { textDefaultProps } from '@/defaultProps'
import { editorTestComponents } from '@/store/editor'

jest.mock('ant-design-vue')
const cloneComponents = clone(editorTestComponents)
const getLengthAndAssert = (length: number) => {
  expect(store.state.editor.components.length).toBe(length)
}
const getLastAndAssert = (id: string) => {
  const lastItem = last(store.state.editor.components)
  expect(lastItem?.id).toBe(id)
}
const getCurrentAndAssert = (text: string) => {
  const currentElement: ComponentData = store.getters.getCurrentElement
  expect(currentElement.props.text).toBe(text)
}
describe('test editor module', () => {
  it('should have default components', () => {
    expect(store.state.editor.components).toHaveLength(
      editorTestComponents.length
    )
  })

  it('should get current component when set active one component', () => {
    expect(store.commit('setActive', editorTestComponents[0].id))
    expect(store.state.editor.currentElementId).toBe(editorTestComponents[0].id)
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

  it('undo should works fine', () => {
    store.commit('resetEditor')
    const payload: ComponentData = {
      name: 'l-text',
      id: '1234',
      props: {
        ...textDefaultProps,
        text: 'text1'
      }
    }
    // 1.添加payload
    store.commit('addComponent', payload)
    const payload2: ComponentData = {
      name: 'l-text',
      id: '2345',
      props: {
        ...textDefaultProps,
        text: 'text2'
      }
    }
    // 2.添加payload2
    store.commit('addComponent', payload2)
    // 3.删除payload2
    store.commit('deleteComponent', '2345')
    // 4.更新payload1
    store.commit('updateComponent', {
      key: 'text',
      value: 'updated',
      id: '1234'
    })
    store.commit('setActive', '1234')
    getCurrentAndAssert('updated')
    // undo step 1 撤回更新
    store.commit('undo')
    getCurrentAndAssert('text1')
    // undo step 2 撤回删除操作
    getLengthAndAssert(1)
    store.commit('undo')
    getLengthAndAssert(2)
    getLastAndAssert('2345')
    // undo step 3 撤回添加操作
    store.commit('undo')
    getLengthAndAssert(1)
    getLastAndAssert('1234')
    // undo step 4 撤回添加操作
    store.commit('undo')
    getLengthAndAssert(0)
    // redo
    // 1.添加payload 1234
    // 2.添加payload2 2345
    // 3.删除payload2
    // 4.更新payload1
    store.commit('redo')
    getLengthAndAssert(1)
    getLastAndAssert('1234')
    store.commit('redo')
    getLengthAndAssert(2)
    getLastAndAssert('2345')
    store.commit('redo')
    getCurrentAndAssert('text1')
    store.commit('redo')
    getCurrentAndAssert('updated')
  })
})
