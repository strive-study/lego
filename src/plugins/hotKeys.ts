import useHotKey from '@/hooks/useHotKey'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { GlobalDataProps } from '@/store'
import { KeyHandler, HotkeysEvent } from 'hotkeys-js'
const wrap = (callback: KeyHandler) => {
  const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    callback(e, event)
  }
  return wrapperFn
}
export default function initHotKeys() {
  const store = useStore<GlobalDataProps>()
  const currentId = computed(() => store.state.editor.currentElementId)
  useHotKey('ctrl+c, command+c', () => {
    store.commit('copyComponent', currentId.value)
  })

  useHotKey('ctrl+v, command+v', () => {
    store.commit('pasteCopiedComponent')
  })

  useHotKey('backspace, delete', () => {
    store.commit('deleteComponent', currentId.value)
  })

  useHotKey('esc', () => {
    store.commit('setActive', '')
  })

  useHotKey(
    'up',
    wrap(() => {
      store.commit('moveComponent', {
        direction: 'Up',
        amount: 1,
        id: currentId.value
      })
    })
  )

  useHotKey(
    'right',
    wrap(() => {
      store.commit('moveComponent', {
        direction: 'Right',
        amount: 1,
        id: currentId.value
      })
    })
  )

  useHotKey(
    'down',
    wrap(() => {
      store.commit('moveComponent', {
        direction: 'Down',
        amount: 1,
        id: currentId.value
      })
    })
  )

  useHotKey(
    'left',
    wrap(() => {
      store.commit('moveComponent', {
        direction: 'Left',
        amount: 1,
        id: currentId.value
      })
    })
  )

  useHotKey('ctrl+z, command+z', () => {
    const checkUndoDisable = store.getters.checkUndoDisable
    !checkUndoDisable && store.commit('undo')
  })

  useHotKey('ctrl+y, command+y', () => {
    const checkUndoDisable = store.getters.checkRedoDisable
    !checkUndoDisable && store.commit('redo')
  })
}
