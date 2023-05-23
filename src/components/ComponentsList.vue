<template>
  <div class="components-wrapper">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="components-item"
      @click="onItemClick(item)"
    >
      <l-text v-bind="item"> </l-text>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {} from 'vue'
import LText from './LText.vue'

const props = defineProps({
  list: {
    type: Array,
    required: true
  }
})
const emits = defineEmits(['on-item-click'])

const onItemClick = (data: any) => {
  emits('on-item-click', data)
}
</script>

<style></style>
