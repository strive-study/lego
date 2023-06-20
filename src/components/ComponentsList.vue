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
    <styled-uploader @success="onImageUploaded"></styled-uploader>
  </div>
</template>
<script lang="ts" setup>
import {} from 'vue'
import LText from './LText.vue'
import StyledUploader from './StyledUploader.vue'
import { ComponentData } from 'strive-lego-bricks'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import { UploadRes } from '../extraType'
import { imageDefaultProps } from '@/defaultProps'
import { getImageDimention } from '../helper'

defineProps({
  list: {
    type: Array,
    required: true
  }
})
const emits = defineEmits(['on-item-click'])

const onItemClick = (props: any) => {
  const componentData: ComponentData = {
    id: uuidv4(),
    name: 'l-text',
    props
  }
  componentData.props.isEditing = true
  emits('on-item-click', componentData)
}
const onImageUploaded = (res: UploadRes) => {
  const componentData: ComponentData = {
    name: 'l-image',
    id: uuidv4(),
    props: {
      ...imageDefaultProps
    }
  }
  message.success('上传成功')
  componentData.props.src = res.data.urls[0]
  getImageDimention(componentData.props.src).then(({ width }) => {
    const maxWidth = 373
    componentData.props.width = (width > maxWidth ? maxWidth : width) + 'px'
    emits('on-item-click', componentData)
  })
}
</script>

<style scoped lang="scss">
.components-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
  & > * {
    position: static !important;
  }
}
</style>
