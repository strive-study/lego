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
              <div class="body-container" :style="page.props">
                <edit-wrapper
                  v-for="c in components"
                  :key="c.id"
                  :id="c.id"
                  :hidden="c.isHidden"
                  :is-active="c.id === currentElement?.id"
                  :props="c.props"
                  @update-position="updatePosition"
                  @set-active="handleSetActive"
                >
                  <component v-bind="c.props" :is="c.name" class="item" />
                </edit-wrapper>
              </div>
            </div>
          </a-layout-content>
        </a-layout>
        <!-- right -->
        <a-layout-sider width="300" style="background: #fff">
          <a-tabs type="card" v-model:activeKey="activePanel">
            <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
              <div v-if="currentElement">
                <edit-group
                  v-if="!currentElement.isLocked"
                  :props="currentElement.props"
                  @change="handleChange"
                ></edit-group>
                <div v-else>
                  <a-empty>
                    <template #description>
                      <p>该元素被锁定，无法编辑</p>
                    </template>
                  </a-empty>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="layer" tab="图层设置">
              <layer-list
                :list="components"
                :selected-id="currentElement?.id!"
                @select="handleSetActive"
                @change="handleChange"
              >
              </layer-list>
            </a-tab-pane>
            <a-tab-pane key="page" tab="页面设置">
              <props-table :props="page.props" @change="pageChange">
              </props-table>
            </a-tab-pane>
          </a-tabs>
        </a-layout-sider>
      </a-layout>
    </a-layout-content>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { computed, defineComponent, ref } from 'vue'
import LText from '@/components/LText.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import { defaultTextTemplates } from '@/defaultTemplates'
import { ComponentData } from 'strive-lego-bricks'
import LImage from '@/components/LImage.vue'
import LayerList from '@/components/LayerList.vue'
import EditGroup from '@/components/EditGroup.vue'
import PropsTable from '@/components/PropsTable.vue'
import { pickBy, forEach } from 'lodash-es'
// @ts-ignore
// import PropsTable from '@/components/PropsTable.tsx'
export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  components: {
    'l-text': LText,
    'l-image': LImage,
    'components-list': ComponentsList,
    'edit-wrapper': EditWrapper,
    'layer-list': LayerList,
    'edit-group': EditGroup,
    'props-table': PropsTable
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)

    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    )
    const activePanel = ref<TabType>('component')

    const handleAddItem = (component: any) => {
      store.commit('addComponent', component)
    }

    const handleSetActive = (id: string) => {
      store.commit('setActive', id)
    }

    const handleChange = (e: any) => {
      store.commit('updateComponent', e)
    }

    const pageChange = (e: any) => {
      store.commit('updatePage', e)
    }

    const updatePosition = (data: {
      left: number
      top: number
      id: string
    }) => {
      const { id } = data
      const updateData = pickBy(data, (v, k) => k !== 'id')
      forEach(updateData, (v, key) => {
        store.commit('updateComponent', { key, value: v + 'px', id })
      })
    }
    return {
      components,
      defaultTextTemplates,
      currentElement,
      activePanel,
      page,
      handleAddItem,
      handleSetActive,
      handleChange,
      pageChange,
      updatePosition
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
