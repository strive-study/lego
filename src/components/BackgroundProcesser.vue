<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @success="onImageUploaded"></styled-uploader>
    <image-processer
      v-else
      :value="value"
      @change="handleUploadUrl"
      :show-delete="true"
    ></image-processer>
  </div>
</template>

<script lang="ts" setup>
import {} from 'vue'
import ImageProcesser from './ImageProcesser.vue'
import StyledUploader from './StyledUploader.vue'
import { UploadRes } from '../extraType'
import { message } from 'ant-design-vue'

defineProps({
  value: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['change'])
const onImageUploaded = (data: UploadRes) => {
  message.success('上传成功')
  emits('change', data.data.urls[0])
}
const handleUploadUrl = (url: string) => {
  emits('change', url)
}
</script>

<style></style>
