<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input
      type="text"
      v-if="isEditing"
      v-model="innerValue"
      placeholder="文本不能为空"
      ref="inputRef"
    />
    <slot v-else :text="innerValue"
      ><span>{{ innerValue }}</span></slot
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useKeyPress from '@/hooks/useKeyPress'
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['change'])
const innerValue = ref(props.value)
let cachedOldValue = ''
const isEditing = ref(false)
const handleClick = () => {
  isEditing.value = true
}
watch(isEditing, isEditing => {
  if (isEditing) {
    cachedOldValue = innerValue.value
  }
})
useKeyPress('Enter', () => {
  if (isEditing.value) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
})

useKeyPress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = cachedOldValue
  }
})
</script>

<style scoped>
.inline-edit {
  cursor: pointer;
}
.input-error {
  border: 1px solid #f5222d;
}
.input-error:focus {
  border-color: #f5222d;
}
.input-error::placeholder {
  color: #f5222d;
}
</style>
