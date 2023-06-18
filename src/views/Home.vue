<template>
  <div class="content-container">
    <template-list :list="templateTestData"></template-list>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import TemplateList from '@/components/TemplateList.vue'
import { computed, onMounted } from 'vue'
import { GlobalDataProps } from '@/store'

const store = useStore<GlobalDataProps>()
const templateTestData = computed(() => store.state.templates.data)
onMounted(() => {
  store.dispatch('fetchTemplates')
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
