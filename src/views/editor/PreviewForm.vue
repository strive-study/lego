<template>
  <div class="preview-form" v-if="visible">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewURL"
            width="375"
            frameborder="0"
            :height="pageState.props.height"
          ></iframe>
        </div>
      </div>
    </div>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      :visible="visible"
      @close="handleClose"
    >
      <a-form :model="form" :rules="rules" class="form" ref="formRef">
        <a-form-item label="扫码预览：">
          <canvas class="qrcode-container" id="qrcode"></canvas>
        </a-form-item>
        <a-form-item label="上传封面：">
          <styled-uploader
            @success="onSuccess"
            showUploaded
            :uploaded="form.uploaded"
          ></styled-uploader>
        </a-form-item>
        <a-form-item
          class="required"
          label="标题:"
          v-bind="validateInfos.title"
        >
          <a-input v-model:value="form.title" style="width: 200px"></a-input>
        </a-form-item>
        <a-form-item class="required" label="描述:" v-bind="validateInfos.desc">
          <a-input v-model:value="form.desc" style="width: 200px"></a-input>
        </a-form-item>
      </a-form>
      <div class="btn-group">
        <a-button
          type="primary"
          @click="validateAndSave"
          :loading="isSaveLoading"
          >保存</a-button
        >
        <a-button @click="handleClose">取消</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { baseH5URL } from '@/main'
import { GlobalDataProps } from '@/store'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import StyledUploader from '@/components/StyledUploader.vue'
import { generateQrCode } from '@/helper'
import { UploadRes } from '@/extraType'
import useSaveWork from '@/hooks/useSaveWork'
import { useForm } from 'ant-design-vue/lib/form'
import { message } from 'ant-design-vue'
import { forEach } from 'lodash-es'
const props = defineProps({
  visible: {
    type: Boolean,
    defaults: false
  }
})
const emits = defineEmits(['update:visible'])
const store = useStore<GlobalDataProps>()
const pageState = computed(() => store.state.editor.page)
const previewURL = computed(
  () => `${baseH5URL}/preview/${pageState.value.id}-${pageState.value.uuid}`
)
const { title, desc, setting } = pageState.value
console.log('setting', setting)
const formRef = ref<HTMLElement | null>(null)
const form = reactive({
  title: title || '',
  desc: desc || '',
  uploaded: {
    data: {
      url:
        (setting && setting.shareImg) ||
        'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png'
    }
  }
})
const rules = reactive({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
})
const { saveWork, isSaveLoading } = useSaveWork(true)
const { validate, validateInfos } = useForm(form, rules)
onMounted(() => {
  generateQrCode('qrcode', previewURL.value)
})
const handleClose = () => {
  emits('update:visible', false)
}

const validateAndSave = () => {
  validate().then(async () => {
    forEach(form, (value, key) => {
      if (key === 'uploaded' && typeof value !== 'string') {
        store.commit('updatePage', {
          key: 'shareImg',
          value: value.data.url,
          isSetting: true
        })
      } else {
        store.commit('updatePage', { key, value, isRoot: true })
      }
    })
    await saveWork()
    emits('update:visible', false)
    message.success('保存成功', 2)
  })
}
const onSuccess = (res: UploadRes) => {
  const url = res.data.urls[0]
  form.uploaded = {
    data: { url }
  }
}
</script>

<style scoped lang="scss">
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  top: 0;
  left: 0;
  background: transparent;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  .final-preview-inner {
    width: 430px;
    height: 870px;
    padding: 60px 28px;
    position: relative;
    background: url('@/assets/phone-back.png') no-repeat;
    background-size: cover;
    .preview-title {
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-weight: bold;
    }
    .iframe-container {
      width: 100%;
      height: 706px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
.form {
  .required ::v-deep .ant-form-item-label {
    height: 32px;
  }
  ::v-deep .ant-form-item-label {
    display: flex;
    align-items: center;
  }
  .form-cover-img {
    width: 150px;
    height: 150px;
  }
}
.btn-group {
  text-align: left;
  padding-left: 40px;
  button {
    margin: 0 10px;
  }
}
</style>
