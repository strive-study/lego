import { GlobalDataProps } from '@/store'
import { Modal } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const useSaveWork = (disableSideEffects = false) => {
  const route = useRoute()
  const store = useStore<GlobalDataProps>()
  const currentWorkId = route.params.id
  const components = computed(() => store.state.editor.components)
  const page = computed(() => store.state.editor.page)
  const isDirty = computed(() => store.state.editor.isDirty)
  const isSaveLoading = computed(() => store.getters.isOpLoading('saveWork'))
  let timer: any

  const saveWork = () => {
    const { title, props, coverImg } = page.value
    const payload = {
      title,
      coverImg,
      content: {
        components: components.value,
        props
      }
    }
    store.dispatch('saveWork', {
      data: payload,
      urlParams: { id: currentWorkId }
    })
  }
  if (!disableSideEffects) {
    onMounted(() => {
      timer = setInterval(() => {
        if (isDirty.value) {
          saveWork()
        }
      }, 1000 * 60 * 3)
    })
    onUnmounted(() => {
      clearInterval(timer)
      window.onbeforeunload = null
    })
    onBeforeRouteLeave((to, from, next) => {
      if (isDirty.value) {
        Modal.confirm({
          title: '作品还未保存，是否保存？',
          okText: '保存',
          okType: 'primary',
          cancelText: '不保存',
          onOk: async () => {
            await saveWork()
            next()
          },
          onCancel: () => {
            next()
          }
        })
      } else {
        next()
      }
    })

    window.onbeforeunload = e => {
      if (isDirty.value) {
        return ''
      }
    }
  }
  return {
    saveWork,
    isSaveLoading
  }
}

export default useSaveWork
