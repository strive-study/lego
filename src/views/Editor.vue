<template>
  <div class="container">
    <a-layout-content>
      <a-layout>
        <!-- left -->
        <a-layout-sider width="300" style="background: #fff">
          组件列表
          <components-list
            :list="defaultTextTemplates"
            @on-item-click="handleAddItem"
          ></components-list>
        </a-layout-sider>
        <!-- 画布区域 -->
        <a-layout style="padding: 0 24px 24px">
          <a-layout-content class="preview-container">
            <p>画布区域</p>
            <div class="preview-list" id="canvas-area">
              <edit-wrapper
                v-for="c in components"
                :key="c.id"
                :id="c.id"
                :is-active="c.id === currentElement?.id"
                @set-active="handleSetActive"
              >
                <component v-bind="c.props" :is="c.name" class="item" />
              </edit-wrapper>
            </div>
          </a-layout-content>
        </a-layout>
        <!-- right -->
        <a-layout-sider width="300" style="background: #fff">
          组件属性
          <props-table
            v-if="currentElement?.props"
            :props="currentElement.props"
            @change="handleChange"
          ></props-table>
          <pre>{{ currentElement?.props }}</pre>
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
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import { defaultTextTemplates } from '@/defaultTemplates'
import { ComponentData } from 'strive-lego-bricks'
import PropsTable from '@/components/PropsTable.vue'
import LImage from '@/components/LImage.vue'
// @ts-ignore
// import PropsTable from '@/components/PropsTable.tsx'

export default defineComponent({
  components: {
    'l-text': LText,
    'l-image': LImage,
    'components-list': ComponentsList,
    'edit-wrapper': EditWrapper,
    'props-table': PropsTable
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    )

    const handleAddItem = (component: any) => {
      store.commit('addComponent', component)
    }

    const handleSetActive = (id: string) => {
      store.commit('setActive', id)
    }

    const handleChange = (e: any) => {
      store.commit('updateComponent', e)
    }
    return {
      components,
      defaultTextTemplates,
      currentElement,
      handleAddItem,
      handleSetActive,
      handleChange
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
