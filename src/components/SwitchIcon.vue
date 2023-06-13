<template>
  <a-tooltip placement="top" :mouseLeaveDelay="0.01">
    <template #title>
      <span>{{ tip }}</span>
    </template>
    <a-button
      type="primary"
      shape="circle"
      @click="handleToggle"
      :class="{ checked: checked, unchecked: !checked }"
    >
      <template #icon> <component :is="iconName"></component></template>
    </a-button>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined
} from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined
  },
  props: {
    checked: {
      type: Boolean,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    tip: {
      type: String,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const handleToggle = () => {
      emit('change', !props.checked)
    }
    return { handleToggle }
  }
})
</script>

<style scoped>
.checked {
  color: #fff;
  background: #1890ff;
}
.unchecked {
  color: #333333;
  background-color: #fff;
}
</style>
