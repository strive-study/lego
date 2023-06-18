<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <ul class="ant-menu-light ant-menu-root ant-menu-vertical">
      <li
        v-for="(action, index) in actions"
        :key="index"
        @click="action.action(componentId)"
        class="ant-menu-item"
      >
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, onUnmounted, ref } from 'vue'
import { getParentElement } from '@/helper'
import { ActionItem } from './createContextMenu'

const props = defineProps({
  actions: {
    type: Array as PropType<ActionItem[]>,
    required: true
  },
  triggerClass: {
    type: String,
    default: 'edit-wrapper'
  }
})
const menuRef = ref<HTMLElement | null>(null)
const componentId = ref('')
onMounted(() => {
  document.addEventListener('contextmenu', triggerContextMenu)
  document.addEventListener('click', handleClick)
})
onUnmounted(() => {
  document.removeEventListener('contextmenu', triggerContextMenu)
  document.removeEventListener('click', handleClick)
})
const triggerContextMenu = (e: MouseEvent) => {
  const domElement = menuRef.value as HTMLElement
  const wrapperEle = getParentElement(
    e.target as HTMLElement,
    props.triggerClass
  )
  if (wrapperEle) {
    e.preventDefault()
    domElement.style.display = 'block'
    domElement.style.top = e.clientY + 'px' //pageY
    domElement.style.left = e.clientX + 'px' //pageX
    const cid = wrapperEle.dataset.componentId
    if (cid) {
      componentId.value = cid
    }
  }
}
const handleClick = () => {
  const domElement = menuRef.value as HTMLElement
  domElement.style.display = 'none'
}
</script>

<style scoped lang="scss">
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
  width: 220px;
  border: 1px solid #ccc;
  ul {
    padding-left: 0;
  }
  .ant-menu-item {
    display: flex;
    justify-content: space-between;
    &:hover {
      background: #efefef;
    }
    .item-shortcut {
      color: #ccc;
    }
  }
}
</style>
