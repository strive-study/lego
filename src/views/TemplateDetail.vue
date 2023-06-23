<template>
  <div class="container">
    <a-row type="flex" justify="center" class="content" v-if="template">
      <!-- 左侧海报 -->
      <a-col :span="8" class="left">
        <a :href="template.coverImg">
          <img :src="template.coverImg" id="logo-img" alt="" />
        </a>
      </a-col>
      <!-- 右侧信息 -->
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.title }}</p>
        <div class="author-wrapper">
          <a-avatar size="small" class="avatar">
            <!-- <template #icon><UserOutlined /></template> -->
            <template #icon>V</template>
          </a-avatar>
          该模板由 <b>{{ template.author }}</b> 制作
        </div>
        <div class="barcode-wrapper">
          <span>扫一扫，手机预览</span>
          <div ref="container"></div>
        </div>
        <div class="btn-wrapper">
          <router-link :to="`/editor/${template.id}`">
            <a-button type="primary" size="large" shape="round" class="btn">
              使用模版
            </a-button>
          </router-link>
          <a-button size="large" shape="round" @click="download"
            >下载图片海报</a-button
          >
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { TemplateProps } from '@/store/templates'
import { downloadFile } from '@/helper'
const route = useRoute()
const store = useStore<GlobalDataProps>()

const currentId = route.params.id as string
const template = computed<TemplateProps>(() =>
  store.getters.getTemplateById(parseInt(currentId))
)
const download = () => {
  const image = document.getElementById('logo-img') as HTMLImageElement
  downloadFile(image.src, 'test.png')
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 50px;
  .left {
    margin-right: 30px;
    img {
      width: 100%;
    }
  }
  .author-wrapper {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 10px;
    }
  }
  .barcode-wrapper {
    margin: 20px 0;
  }
  .btn-wrapper {
    margin: 30px 0;
    .btn {
      margin-right: 20px;
    }
  }
}
</style>
