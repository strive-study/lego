<template>
  <!-- <Uploader
    action="http://182.92.168.192:8081/api/utils/upload-img"
    drag
    list-type="picture"
  >
    <div class="uploader-container">
      <h4>上传图片</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="{ uploadedData }">
      <div class="uploaded-area">
        <img :src="uploadedData.data.urls" alt="" />
        <h3>点击重新上传</h3>
      </div>
    </template>
  </Uploader> -->
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import Uploader from './components/Uploader.vue'
</script>

<style lang="scss">
/* .file-upload .upload-area {
  width: 360px;
  height: 180px;
  text-align: center;
  padding: 20px;
  cursor: pointer;
  background: #efefef;
  border: 1px dashed #ccc;
  border-radius: 4px;
  &:hover {
    border: 1px dashed #1890ff;
  }
  &.is-dragover {
    border: 2px dashed #1890ff;
    background-color: rgba(#1890ff, 0.2);
  }
}
.uploaded-area img {
  height: 100px;
  width: 100px;
} */
</style>
