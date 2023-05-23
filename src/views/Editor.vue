<template>
  <div class="container">
    <a-layout-content>
      <a-layout>
        <a-layout-sider width="300" style="background: yellow">
          组件列表
        </a-layout-sider>
        <a-layout style="padding: 0 24px 24px">
          <a-layout-content class="preview-container">
            <p>画布区域</p>
            <div class="preview-list" id="canvas-area">
              <component
                v-for="c in components"
                :key="c.id"
                v-bind="c.props"
                :is="c.name"
              >
                {{ c.props.text }}
              </component>
            </div>
          </a-layout-content>
        </a-layout>
        <a-layout-sider width="300" style="background: purple">
          组件属性
        </a-layout-sider>
      </a-layout>
    </a-layout-content>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { computed, defineComponent } from 'vue'
import LText from '@/components/LText.vue'

export default defineComponent({
  components: {
    'l-text': LText
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    return {
      components
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  .preview-container {
    padding: 24px;
    margin: 0;
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .preview-list {
      padding: 0;
      margin: 0;
      min-width: 375px;
      min-height: 200px;
      border: 1px solid #efefef;
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      position: fixed;
      margin-top: 50px;
      max-height: 80vh;
    }
  }
}
</style>
