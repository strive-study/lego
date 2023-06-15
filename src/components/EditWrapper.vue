<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: isActive, hidden: hidden }"
    :style="styles"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
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
const emits = defineEmits(['set-active'])

const onItemClick = (id: string) => {
  emits('set-active', id)
}
const styles = computed(() =>
  pick(props.props, ['position', 'top', 'left', 'width', 'height'])
)
</script>

<style scoped lang="scss">
.edit-wrapper {
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  & > * {
    position: static !important;
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
