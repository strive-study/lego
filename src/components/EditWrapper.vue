<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: isActive }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {} from 'vue'
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['set-active'])

const onItemClick = (id: string) => {
  emits('set-active', id)
}
</script>

<style scoped lang="scss">
.edit-wrapper {
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  &:hover {
    border: 1px dashed #ccc;
  }
  &.active {
    border: 1px solid #1890ff;
    z-index: 1500;
  }
}
</style>
