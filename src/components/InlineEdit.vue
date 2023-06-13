<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input
      type="text"
      v-if="isEditing"
      v-model="innerValue"
      placeholder="文本不能为空"
      ref="inputRef"
    />
    <slot v-else
      ><span>{{ innerValue }}</span></slot
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})
const innerValue = ref(props.value)
const isEditing = ref(false)
const handleClick = () => {
  isEditing.value = true
}
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
