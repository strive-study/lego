<template>
  <div class="content-container">
    ><template-list :list="templateTestData"></template-list>
    <a-row type="flex" justify="center">
      <a-button
        type="primary"
        size="large"
        @click="loadMorePage"
        v-if="!isLastPage"
        :loading="isLoading"
        >加载更多</a-button
      >
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import TemplateList from '@/components/TemplateList.vue'
import { computed, onMounted } from 'vue'
import { GlobalDataProps } from '@/store'
import useLoadMore from '../hooks/useLoadMore'
const store = useStore<GlobalDataProps>()
const templateTestData = computed(() => store.state.templates.data)
const total = computed(() => store.state.templates.totalTemplates)
const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'))
const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, {
  pageIndex: 0,
  pageSize: 2
})
onMounted(() => {
  store.dispatch('fetchTemplates', {
    searchParams: { pageSize: 2, pageIndex: 0 }
  })
  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight
    const scrollPoint = window.scrollY + window.innerHeight
    if (scrollPoint >= totalHeight && !isLastPage.value) {
      loadMorePage()
    }
  })
})
onMounted(() => {
  window.onscroll = null
})
</script>

<style lang="scss" scoped>
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
