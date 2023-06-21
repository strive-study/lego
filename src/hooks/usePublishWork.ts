import { screenshotAndUpload } from '@/helper'
import useSaveWork from './useSaveWork'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '@/store'
import { computed, ref } from 'vue'

const usePublishWork = () => {
  const { saveWork } = useSaveWork(true)
  const route = useRoute()
  const store = useStore<GlobalDataProps>()
  const currentWorkId = route.params.id
  const isPublishing = ref(false)
  const channels = computed(() => store.state.editor.channels)
  const publishWork = async (el: HTMLElement) => {
    try {
      // 截图上传后端
      const res = await screenshotAndUpload(el)
      if (res) {
        // 更新coverImage
        store.commit('updatePage', {
          key: 'coverImg',
          value: res.data.urls[0],
          isRoot: true
        })
        // 保存作品
        await saveWork()
        // 发布
        await store.dispatch('publishWork', {
          urlParams: { id: currentWorkId }
        })
        // 判断是否有渠道,如果没有渠道,创建一个默认渠道
        await store.dispatch('fetchChannel', {
          urlParams: { id: currentWorkId }
        })
        if (channels.value.length === 0) {
          await store.dispatch('createChannel', {
            data: {
              name: '默认',
              workId: parseInt(currentWorkId as string)
            }
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      isPublishing.value = false
    }
  }
  return {
    publishWork,
    isPublishing
  }
}

export default usePublishWork
