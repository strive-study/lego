<template>
  <div class="image-processer">
    <a-modal
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancle="showModal"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="dataUrl" alt="" />
        <img
          :src="baseImageUrl"
          ref="cropperImgRef"
          id="processed-imaged"
          alt=""
        />
      </div>
    </a-modal>
    <div
      class="image-preview"
      :style="{ backgroundImage: backgroundUrl }"
      :class="{ extraHeight: showDelete }"
    ></div>
    <div class="image-process">
      <styled-uploader @success="handleUploadSuccess"></styled-uploader>
      <a-button @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </a-button>
      <a-button v-if="showDelete" type="danger" @click="handleDelete">
        <template v-slot:icon><DeleteOutlined /></template>删除图片
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, nextTick } from 'vue'
import StyledUploader from './StyledUploader.vue'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import { commonUploadCheck } from '../helper'
import { UploadResp } from '@/extraType'
import Cropper from 'cropperjs'
import axios from 'axios'
import { token } from '@/testToken'
interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    ratio: {
      type: Number
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DeleteOutlined,
    StyledUploader,
    ScissorOutlined
  },
  emits: ['change'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const dataUrl = ref('')
    const backgroundUrl = computed(() => `url(${props.value})`)
    const cropperImgRef = ref<null | HTMLImageElement>(null)
    let cropper: Cropper
    let cropData: CropDataProps | null = null
    let baseImageUrl = computed(() => props.value.split('?')[0])
    watch(showModal, async newVal => {
      if (newVal) {
        await nextTick()
        cropper = new Cropper(cropperImgRef.value!, {
          crop(event) {
            const { x, y, width, height } = event.detail
            cropData = { x, y, width, height }
            for (let i in cropData) {
              let k = i as keyof CropDataProps
              cropData[k] = Math.floor(cropData[k])
            }
            console.log(cropData)
          }
        })
      } else {
        cropper && cropper.destroy()
      }
    })
    const handleOk = () => {
      if (cropData) {
        const { x, y, width, height } = cropData
        const cropperUrl =
          baseImageUrl.value +
          `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        cropper.getCroppedCanvas().toBlob(blob => {
          if (blob) {
            const formData = new FormData()
            formData.append('croppedImage', blob, 'test.png')
            axios
              .post('http://localhost:7001/api/utils/upload-img', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`
                }
              })
              .then(res => {
                emit('change', res.data.data.urls[0])
                showModal.value = false
              })
          }
        })
        // emit('change', cropperUrl)
      }
      // showModal.value = false
    }
    const handleUploadSuccess = (data: { res: UploadResp; file: File }) => {
      emit('change', data.res.data.urls[0])
    }
    const handleDelete = () => {
      emit('change', '')
    }
    return {
      handleUploadSuccess,
      commonUploadCheck,
      handleDelete,
      handleOk,
      backgroundUrl,
      showModal,
      cropperImgRef,
      baseImageUrl,
      dataUrl
    }
  }
})
</script>

<style scoped lang="scss">
.image-processer {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
.image-preview.extraHeight {
  height: 110px;
}
.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
.image-process {
  padding: 5px 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
