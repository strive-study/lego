<template>
  <div class="app-container">
    <a-spin v-if="showLoading" tip="读取中" class="spin"></a-spin>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import { computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const store = useStore<GlobalDataProps>()
const isLoading = computed(() => store.getters.isLoading)
const error = computed(() => store.state.global.error)
const showLoading = computed(
  () => isLoading.value && !route.meta.disableLoading
)
const route = useRoute()
watch(
  () => error.value.status,
  e => {
    if (e) message.error(error.value.message || '未知错误', 2)
  }
)
</script>

<style lang="scss" scoped>
.spin {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
