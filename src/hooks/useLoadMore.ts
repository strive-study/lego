import { ComputedRef, computed, ref } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  pageIndex: number
  pageSize: number
  [key: string]: any
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { pageIndex: 0, pageSize: 8 }
) => {
  const store = useStore()
  // 变化的参数
  const pageIndex = ref(params.pageIndex)
  // 请求的参数
  const requestParams = computed(() => {
    return {
      ...params,
      pageIndex: pageIndex.value
    }
  })
  const loadPrePage = () => {
    pageIndex.value--
    store.dispatch(actionName, { searchParams: requestParams.value })
  }
  const loadMorePage = () => {
    pageIndex.value++
    store.dispatch(actionName, { searchParams: requestParams.value })
  }
  const isFirstPage = computed(() => {
    return pageIndex.value === 0
  })
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) === pageIndex.value + 1
  })

  return {
    loadMorePage,
    loadPrePage,
    isLastPage,
    isFirstPage,
    pageIndex
  }
}

export default useLoadMore
