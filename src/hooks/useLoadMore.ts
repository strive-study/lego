import { ComputedRef, computed, reactive, ref, toRef } from 'vue'
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
  const requestParams = reactive(params)
  const loadPrePage = () => {
    requestParams.pageIndex--
    store.dispatch(actionName, { searchParams: requestParams })
  }
  const toPage = (index: number) => {
    requestParams.pageIndex = index
    store.dispatch('fetchWorks', { searchParams: requestParams.value })
  }
  const loadMorePage = () => {
    requestParams.pageIndex++
    store.dispatch(actionName, { searchParams: requestParams })
  }
  // 总页码数量
  const totalPage = computed(() => Math.ceil(total.value / params.pageSize))
  const isFirstPage = computed(() => {
    return requestParams.pageIndex === 0
  })
  const isLastPage = computed(() => {
    return totalPage.value === requestParams.pageIndex + 1
  })
  const pageIndex = toRef(requestParams, 'pageIndex')
  return {
    isLastPage,
    isFirstPage,
    pageIndex,
    requestParams,
    totalPage,
    loadMorePage,
    loadPrePage,
    toPage
  }
}

export default useLoadMore
