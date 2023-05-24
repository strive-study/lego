<template>
  <h1 class="hello">{{ msg }}</h1>
</template>

<script lang="ts" setup>
import {} from 'vue'
const props = defineProps({
  msg: {
    type: String
  }
})
</script>

<style></style>
