<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: isActive, hidden: hidden }"
    :style="styles"
    ref="editWrapper"
    @mousedown="startMove"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { pick } from 'lodash-es'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  props: {
    type: Object
  }
})
const emits = defineEmits(['set-active', 'update-position'])
const editWrapper = ref<null | HTMLElement>(null)
const onItemClick = (id: string) => {
  emits('set-active', id)
}
const styles = computed(() =>
  pick(props.props, ['position', 'top', 'left', 'width', 'height'])
)
const gap = {
  x: 0,
  y: 0
}
let isMoving = false
const caculateMovePosition = (e: MouseEvent) => {
  const container = document.getElementById('canvas-area') as HTMLElement

  const left = e.clientX - gap.x - container.offsetLeft
  const top = e.clientY - gap.y - container.offsetTop
  return { left, top }
}
const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
    console.log(gap)
    console.log(e.offsetX, e.offsetY)
  }

  const handleMove = (e: MouseEvent) => {
    const { left, top } = caculateMovePosition(e)
    isMoving = true
    if (currentElement) {
      currentElement.style.left = left + 'px'
      currentElement.style.top = top + 'px'
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    if (isMoving) {
      const { left, top } = caculateMovePosition(e)
      emits('update-position', { left, top, id: props.id })
      isMoving = false
    }
    document.removeEventListener('mouseup', handleMouseUp)
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped lang="scss">
.edit-wrapper {
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  & > ::v-deep * {
    position: static !important;
    /* width: 100% !important;
    height: 100% !important; */
  }
  &:hover {
    border: 1px dashed #ccc;
  }
  &.hidden {
    display: none;
  }
  &.active {
    border: 1px solid #1890ff;
    z-index: 1500;
  }
}
</style>
