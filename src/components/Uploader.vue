<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      :style="{ display: 'none' }"
      ref="inputRef"
      @change="handleFileChange"
    />
    <ul class="upload-list">
      <li
        v-for="file in uploadedFiles"
        :key="file.uid"
        :class="`uploaded-file upload-${file.status}`"
      >
        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined
        /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"
          ><DeleteOutlined
        /></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import axios from 'axios'
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import { v4 as uuidv4 } from 'uuid'
import { last } from 'lodash-es'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
export interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  setup(props) {
    const inputRef = ref<null | HTMLInputElement>()
    // 上传过/正在上传 文件列表
    const uploadedFiles = ref<UploadFile[]>([])

    const isUploading = computed(() => {
      return uploadedFiles.value.some(f => f.status === 'loading')
    })

    const lastFileData = computed(() => {
      const lastFile = last(uploadedFiles.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })

    const removeFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id)
    }

    const triggerUpload = () => {
      if (inputRef.value) {
        inputRef.value.click()
      }
    }

    const Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiIxNTk2NjYzNTAxNSIsInBhc3N3b3JkIjoiM2Q5MjdmMDVkYmQzNzg5YjA5ZDUyMGM1ZDMzZjM0Y2UiLCJwaG9uZU51bWJlciI6IjE1OTY2NjM1MDE1Iiwibmlja05hbWUiOiLkuZDpq5g1MDE1IiwiZ2VuZGVyIjowLCJwaWN0dXJlIjpudWxsLCJjaXR5IjpudWxsLCJsYXRlc3RMb2dpbkF0IjoiMjAyMy0wNS0yNlQxMzowMjoyMS4wMDBaIiwiaXNGcm96ZW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIwLTA5LTIzVDA1OjU5OjQyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTI2VDEzOjAyOjIxLjAwMFoiLCJpYXQiOjE2ODUxMDYzODAsImV4cCI6MTY4NTE5Mjc4MH0.il6L3eBu3TRsDtn6MjUfIbPCPVadciRVNMeC3wArnHA'
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        const fileObj = reactive<UploadFile>({
          uid: uuidv4(),
          size: uploadedFile.size,
          name: uploadedFile.name,
          status: 'loading',
          raw: uploadedFile
        })
        uploadedFiles.value.push(fileObj)
        axios
          .post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization
            }
          })
          .then(res => {
            console.log(res.data)
            fileObj.status = 'success'
            fileObj.resp = res.data
          })
          .catch(() => {
            fileObj.status = 'error'
          })
          .finally(() => {
            if (inputRef.value) {
              inputRef.value.value = ''
            }
          })
      }
    }
    return {
      inputRef,
      isUploading,
      lastFileData,
      uploadedFiles,
      removeFile,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>

<style lang="scss" scoped>
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
