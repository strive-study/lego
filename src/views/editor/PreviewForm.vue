<template>
  <div class="preview-form" v-if="visible">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewURL"
            width="375"
            frameborder="0"
            :height="pageState.props.height"
          ></iframe>
        </div>
      </div>
    </div>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      :visible="visible"
      @close="handleClose"
    ></a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { baseH5URL } from '@/main'
import { GlobalDataProps } from '@/store'
import { computed } from 'vue'
import { useStore } from 'vuex'
const props = defineProps({
  visible: {
    type: Boolean,
    defaults: false
  }
})
const emits = defineEmits(['update:visible'])
const store = useStore<GlobalDataProps>()
const pageState = computed(() => store.state.editor.page)
const previewURL = computed(
  () => `${baseH5URL}/preview/${pageState.value.id}-${pageState.value.uuid}`
)
const handleClose = () => {
  emits('update:visible', false)
}
</script>

<style scoped lang="scss">
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  top: 0;
  left: 0;
  background: transparent;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  .final-preview-inner {
    width: 430px;
    height: 870px;
    padding: 60px 28px;
    position: relative;
    background: url('@/assets/phone-back.png') no-repeat;
    background-size: cover;
    .preview-title {
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-weight: bold;
    }
    .iframe-container {
      width: 100%;
      height: 706px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
