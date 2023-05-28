<template>
  <Uploader
    class="styled-uploader"
    action="http://182.92.168.192:8081/api/utils/upload-img"
    :before-upload="commonUploadCheck"
    :show-upload-list="false"
    @success="
      data => {
        handleUploadSuccess(data.res)
      }
    "
  >
    <div class="uploader-container">
      <FileOutlined />
      <h4>上传图片</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>
  </Uploader>
</template>

<script lang="ts" setup>
import {} from 'vue'
import Uploader from './Uploader.vue'
import {
  LoadingOutlined,
  FileOutlined,
  FileImageOutlined
} from '@ant-design/icons-vue'
import { commonUploadCheck } from '../helper'

const emits = defineEmits(['success'])

const handleUploadSuccess = (res: any) => {
  emits('success', res)
}
</script>

<style lang="scss" scoped>
.styled-uploader {
  .uploader-container {
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .uploader-container:hover {
    background: #40a9ff;
  }
  .uploader-container h4 {
    color: #ffffff;
    margin-bottom: 0;
    margin-left: 10px;
  }
}
</style>
