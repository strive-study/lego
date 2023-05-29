<template>
  <div class="file-upload">
    <div
      class="upload-area"
      v-on="events"
      :class="{ 'is-dragover': drag && isDragOver }"
    >
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
    <ul :class="`upload-list upload-list-${listType}`" v-if="showUploadList">
      <li
        v-for="file in filesList"
        :key="file.uid"
        :class="`uploaded-file upload-${file.status}`"
      >
        <img
          :src="file.url"
          :alt="file.name"
          class="upload-list-thumbnail"
          v-if="file.url && listType === 'picture'"
        />
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
import { PropType, computed, defineComponent, reactive, ref } from 'vue'
import axios from 'axios'
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import { v4 as uuidv4 } from 'uuid'
import { last } from 'lodash-es'

type FileListType = 'picture' | 'text'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckUpload = (file: File) => boolean | Promise<File>
export interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
  url?: string
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      defualt: 'text'
    },
    showUploadList: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  emits: ['success', 'error', 'change'],
  setup(props, { emit }) {
    const Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiIxNTk2NjYzNTAxNSIsInBhc3N3b3JkIjoiM2Q5MjdmMDVkYmQzNzg5YjA5ZDUyMGM1ZDMzZjM0Y2UiLCJwaG9uZU51bWJlciI6IjE1OTY2NjM1MDE1Iiwibmlja05hbWUiOiLkuZDpq5g1MDE1IiwiZ2VuZGVyIjowLCJwaWN0dXJlIjpudWxsLCJjaXR5IjpudWxsLCJsYXRlc3RMb2dpbkF0IjoiMjAyMy0wNS0yN1QxNDo0MzoyNi4wMDBaIiwiaXNGcm96ZW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIwLTA5LTIzVDA1OjU5OjQyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTI3VDE0OjQzOjI2LjAwMFoiLCJpYXQiOjE2ODUzNTYwODcsImV4cCI6MTY4NTQ0MjQ4N30.xk_m-V-RtylCzfwRrpLLPwN87X5Ydxw72Wvo3QdHuEI`
    const inputRef = ref<null | HTMLInputElement>()
    // 上传过/正在上传 文件列表
    const filesList = ref<UploadFile[]>([])
    const isDragOver = ref(false)

    const isUploading = computed(() => {
      return filesList.value.some(f => f.status === 'loading')
    })

    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })

    const removeFile = (id: string) => {
      filesList.value = filesList.value.filter(file => file.uid !== id)
    }

    const triggerUpload = () => {
      if (inputRef.value) {
        inputRef.value.click()
      }
    }
    // v-on
    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload
    }
    // @changed
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      beforeUploadCheck(target.files)
    }

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragOver.value = over
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragOver.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }

    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'ready',
        raw: uploadedFile
      })
      if (props.listType === 'picture') {
        try {
          fileObj.url = URL.createObjectURL(uploadedFile)
        } catch (err) {
          console.error('upload file error', err)
        }
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(uploadedFile)
        // fileReader.addEventListener('load', () => {
        //   fileObj.url = fileReader.result as string
        // })
      }
      filesList.value.push(fileObj)
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }
    // 发送文件
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData()
      formData.append(readyFile.name, readyFile.raw)
      readyFile.status = 'loading'
      axios
        .post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization
          },
          onUploadProgress: function (progressEvent) {
            // TODO 处理进度事件
            // console.log(progressEvent)
          }
        })
        .then(res => {
          readyFile.status = 'success'
          console.log(res)
          readyFile.resp = res.data
          emit('success', {
            res: res.data,
            file: readyFile,
            list: filesList.value
          })
        })
        .catch((e: any) => {
          readyFile.status = 'error'
          emit('error', {
            error: e,
            file: readyFile,
            list: filesList.value
          })
        })
        .finally(() => {
          if (inputRef.value) {
            inputRef.value.value = ''
          }
        })
    }

    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          // promise
          if (result && result instanceof Promise) {
            result
              .then(processedFile => {
                if (processedFile instanceof File) {
                  addFileToList(processedFile)
                } else {
                  throw new Error(
                    'beforeUpload Promise should return File object'
                  )
                }
              })
              .catch(e => {
                console.error(e)
              })
            // true
          } else if (result === true) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }
      }
    }

    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => handleDrag(e, true),
        dragleave: (e: DragEvent) => handleDrag(e, false),
        drop: handleDrop
      }
    }

    // 手动上传
    const uploadFiles = () => {
      filesList.value
        .filter(file => file.status === 'ready')
        .forEach(readyFile => {
          return postFile(readyFile)
        })
    }

    return {
      inputRef,
      isUploading,
      lastFileData,
      filesList,
      isDragOver,
      events,
      removeFile,
      handleFileChange,
      handleDrag,
      uploadFiles
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
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
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
