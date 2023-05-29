<template>
  <div class="image-processer">
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
        <UploadOutlined />
        <h4>更换图片</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <LoadingOutlined spin />
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded>
        <div class="uploader-container">
          <UploadOutlined />
          <h4>更换图片</h4>
        </div>
      </template>
    </Uploader>
    <a-button shape="round" size="large" @click="handleDelete">
      <template #icon>
        <CloseOutlined />
      </template>
      删除图片
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  UploadOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '../helper'
import { UploadResp } from '@/extraType'

export default defineComponent({
  props: {
    // src: {
    //   type: String,
    //   required: true
    // }
  },
  components: {
    CloseOutlined,
    UploadOutlined,
    LoadingOutlined,
    Uploader
  },
  setup(props, { emit }) {
    const handleUploadSuccess = (res: UploadResp) => {
      console.log('更改', res)
      emit('change', res.data.urls[0])
    }
    const handleDelete = () => {
      emit('change', '')
    }
    return {
      handleUploadSuccess,
      commonUploadCheck,
      handleDelete
    }
  }
})
</script>

<style scoped lang="scss">
.image-processer {
  display: flex;
  gap: 20px;
}
.styled-uploader {
  .uploader-container {
    width: 130px;
    height: 40px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
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
