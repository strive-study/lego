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
import { nextTick, ref, watch } from 'vue'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutSide from '@/hooks/useClickOutside'
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['change'])
const wrapper = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)
const innerValue = ref(props.value)
const isEditing = ref(false)
const isOutside = useClickOutSide(wrapper)
let cachedOldValue = ''

const handleClick = () => {
  isEditing.value = true
}
watch(
  () => props.value,
  newVal => {
    innerValue.value = newVal
  }
)
watch(isOutside, newVal => {
  if (newVal && isEditing.value) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
  // handleClick 停止冒泡，document无法感知到点击 手动置为false
  isOutside.value = false
})
watch(isEditing, async isEditing => {
  if (isEditing) {
    cachedOldValue = innerValue.value
    await nextTick()
    inputRef.value?.focus()
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
