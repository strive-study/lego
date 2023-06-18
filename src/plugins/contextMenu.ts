import { onMounted, onUnmounted } from 'vue'
import createContextMenu, { ActionItem } from '@/components/createContextMenu'
import { useStore } from 'vuex'

const initContextMenu = () => {
  const store = useStore()
  const testActions: ActionItem[] = [
    {
      shortcut: 'Backspace / Delete',
      text: '删除图层',
      action: cid => {
        store.commit('deleteComponent', cid)
      }
    }
  ]
  let desctory: any
  onMounted(() => {
    desctory = createContextMenu(testActions)
  })

  onUnmounted(() => {
    desctory()
  })
}

export default initContextMenu
