<template>
  <div class="container">
    <a-modal
      title="发布成功"
      v-model:visible="showPublishForm"
      width="700px"
      :footer="null"
    >
      <publish-form />
    </a-modal>
    <preview-form
      v-model:visible="showPreviewForm"
      v-if="showPreviewForm"
    ></preview-form>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img
              alt="乐高编辑器"
              src="../assets/logo-simple.png"
              class="logo-img"
            />
          </router-link>
          <inline-edit :value="page.title" @change="titleChange" />
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal">
          <a-menu-item key="1">
            <a-button type="primary" @click="preview">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="saveWork" :loading="isSaveLoading"
              >保存</a-button
            >
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="publish" :loading="isPublishing"
              >发布</a-button
            >
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <!-- left -->
      <a-layout-sider width="300" style="background: #fff">
        组件列表
        <components-list
          :list="defaultTextTemplates"
          @on-item-click="handleAddItem"
        ></components-list>
        <img src="" id="test" :style="{ width: '300px' }" alt="" />
      </a-layout-sider>
      <!-- 画布区域 -->
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <history-area></history-area>
          <div
            class="preview-list"
            id="canvas-area"
            :class="{ 'canvas-fix': canvasFix }"
          >
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
            <div v-else>
              <a-empty>
                <template #description>
                  <p>请选择一个编辑元素</p>
                </template>
              </a-empty>
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
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '@/store'
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import LText from '@/components/LText.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import defaultTextTemplates from '@/defaultTemplates'
import { ComponentData } from 'strive-lego-bricks'
import LImage from '@/components/LImage.vue'
import LayerList from '@/components/LayerList.vue'
import EditGroup from '@/components/EditGroup.vue'
import PropsTable from '@/components/PropsTable.vue'
import HistoryArea from './editor/HistoryArea.vue'
import InlineEdit from '@/components/InlineEdit.vue'
import UserProfile from '@/components/UserProfile.vue'
import PublishForm from './editor/PublishForm.vue'
import PreviewForm from './editor/PreviewForm.vue'
import { pickBy } from 'lodash-es'
import initHotKeys from '@/plugins/hotKeys'
import initContextMenu from '@/plugins/contextMenu'
import useSaveWork from '../hooks/useSaveWork'
import usePublishWork from '../hooks/usePublishWork'
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
    'props-table': PropsTable,
    'history-area': HistoryArea,
    'inline-edit': InlineEdit,
    'user-profile': UserProfile,
    'publish-form': PublishForm,
    'preview-form': PreviewForm
  },
  setup() {
    initContextMenu()
    initHotKeys()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentWorkId = route.params.id
    const canvasFix = ref(false)
    const showPublishForm = ref(false)
    const showPreviewForm = ref(false)
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)
    const userInfo = computed(() => store.state.user)
    const { saveWork, isSaveLoading } = useSaveWork()
    const { publishWork, isPublishing } = usePublishWork()
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch('fetchWork', { urlParams: { id: currentWorkId } })
      }
    })
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
      const keysArr = Object.keys(updateData)
      const valueArr = Object.values(updateData).map(v => v + 'px')
      store.commit('updateComponent', { key: keysArr, value: valueArr, id })
    }

    const titleChange = (title: string) => {
      store.commit('updatePage', { key: 'title', value: title, isRoot: true })
    }

    const publish = async () => {
      isPublishing.value = true
      // 置空选中
      store.commit('setActive', '')
      const el = document.getElementById('canvas-area') as HTMLElement
      canvasFix.value = true
      await nextTick()
      try {
        await publishWork(el)
        showPublishForm.value = true
      } catch (error) {
        console.error(error)
      } finally {
        canvasFix.value = false
      }
    }

    const preview = async () => {
      await saveWork()
      await nextTick()
      showPreviewForm.value = true
    }
    return {
      components,
      defaultTextTemplates,
      currentElement,
      activePanel,
      page,
      userInfo,
      isSaveLoading,
      canvasFix,
      isPublishing,
      showPublishForm,
      showPreviewForm,
      handleAddItem,
      handleSetActive,
      handleChange,
      pageChange,
      updatePosition,
      titleChange,
      saveWork,
      publish,
      preview
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  .header {
    line-height: 22px;
    .page-title {
      display: flex;
      align-items: center;
    }
    .inline-edit {
      ::v-deep span {
        font-weight: 500;
        margin-left: 10px;
        font-size: 16px;
        color: #fff;
      }
    }
    ::v-deep .ant-menu-item:hover {
      background-color: transparent;
    }
    /* a-menu 收缩隐藏解决 */
    .ant-menu {
      width: 800px;
      justify-content: flex-end;
    }
  }

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
      /* 截图无法完全，在截图时短暂去掉max-height */
      &.canvas-fix {
        position: absolute;
        max-height: none;
      }
      /* 截取去阴影，黑块问题 */
      &.canvas-fix .edit-wrapper > * {
        box-shadow: none !important;
      }
    }
  }
}
</style>
