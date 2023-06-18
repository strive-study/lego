<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: isActive, hidden: hidden }"
    :style="styles"
    ref="editWrapper"
    @mousedown="startMove"
    :data-component-id="id"
  >
    <slot></slot>
    <div class="resizers">
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'
import { pick } from 'lodash-es'
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}
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
  const top = e.clientY - gap.y - container.offsetTop + container.scrollTop
  return { left, top }
}

const caculateSize = (
  direction: ResizeDirection,
  e: MouseEvent,
  position: OriginalPositions
) => {
  const { clientX, clientY } = e
  const { left, right, top, bottom } = position
  const container = document.getElementById('canvas-area') as HTMLElement
  const rightWidth = clientX - left
  const leftWidth = right - clientX
  const bottomHeight = clientY - top
  const topHeight = bottom - clientY
  const topOffset = clientY - container.offsetTop + container.scrollTop
  const leftOffset = clientX - container.offsetLeft
  switch (direction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: topOffset,
        left: leftOffset
      }
    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset
      }
    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight
      }
    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset
      }
    default:
      break
  }
}

const startResize = (direction: ResizeDirection) => {
  const currentElement = editWrapper.value as HTMLElement
  const { left, right, top, bottom } = currentElement.getBoundingClientRect()
  const handleMove = (e: MouseEvent) => {
    const size = caculateSize(direction, e, { left, right, top, bottom })
    const { style } = currentElement
    if (size) {
      style.width = size.width + 'px'
      style.height = size.height + 'px'
    }
    size?.top && (style.top = size?.top + 'px')
    size?.left && (style.left = size?.left + 'px')
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    const size = caculateSize(direction, e, { left, right, top, bottom })
    emits('update-position', { ...size, id: props.id })
    // nextTick(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    // })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
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
    // nextTick(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    // })
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
  box-sizing: content-box !important;
  & > ::v-deep *:not(.resizers) {
    position: static !important;
    width: 100% !important;
    height: 100% !important;
  }
  &:hover {
    border: 1px dashed #ccc;
  }
  &.hidden {
    display: none;
  }
  .resizers {
    display: none;
  }
  &.active {
    border: 1px solid #1890ff;
    z-index: 1500;
    .resizers {
      display: block;
      .resizer {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        border: 3px solid #1890ff;
        &.top-left {
          left: -5px;
          top: -5px;
          cursor: nwse-resize;
        }
        &.top-right {
          right: -5px;
          top: -5px;
          cursor: nesw-resize;
        }
        &.bottom-right {
          right: -5px;
          bottom: -5px;
          cursor: nwse-resize;
        }
        &.bottom-left {
          left: -5px;
          bottom: -5px;
          cursor: nesw-resize;
        }
      }
    }
  }
}
</style>
