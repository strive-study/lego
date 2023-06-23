<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <a-card hoverable>
          <template #cover>
            <img :src="item.coverImg" v-if="item.coverImg" />
            <img
              src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"
              v-else
            />
            <div class="hover-item">
              <router-link :to="`/template/${item.id}`">
                <a-button size="large" type="primary">使用该模版创建</a-button>
              </router-link>
            </div>
          </template>
          <a-card-meta :title="item.title">
            <template #description>
              <div class="description-detail">
                <span>作者：{{ item.author }}</span>
                <span class="user-number">{{ item.copiedCount }}</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red" v-if="item.isHot">Hot</a-tag>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import {} from 'vue'
import { TemplateProps } from '@/store/templates'
interface Props {
  list: TemplateProps[]
}
const props = defineProps<Props>()
</script>
<!-- 开始 -->
<style scoped lang="scss">
.poster-item {
  position: relative;
  margin-bottom: 20px;

  ::v-deep .ant-card {
    border-radius: 12px;
  }
  .ant-card-hoverable {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }
  ::v-deep .ant-card-body {
    padding: 0;
  }
  .ant-card-meta {
    margin: 0;
  }
  ::v-deep .ant-card-meta-title {
    color: #333;
    padding: 10px 12px;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 0 !important;
  }
  ::v-deep .ant-card-cover {
    height: 390px;
    position: relative;
    overflow: hidden;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    .hover-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: none;
      background: rgba(0, 0, 0, 0.8);
      align-items: center;
      justify-content: center;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    img {
      width: 100%;
      transition: all ease-in 0.2s;
      /* height: 100%; */
    }
  }
  &:hover {
    img {
      transform: scale(1.25);
    }
    .hover-item {
      display: flex;
    }
  }
}

.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}

.description-detail {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  color: #999;
}
.user-number {
  font-weight: bold;
}
.poster-title {
  height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}

.barcode-container img {
  border-radius: 0;
}
</style>
