<template>
  <div class="color-picker">
    <div class="input-container">
      <input
        type="color"
        :value="value"
        @input="onChange($event.target!.value)"
      />
    </div>
    <ul class="color-list">
      <li
        v-for="(item, index) in colors"
        :key="index"
        :class="`item-${index}`"
        :style="{ backgroundColor: item }"
        @click.prevent="onChange(item)"
      >
        <div
          :style="{ backgroundColor: item }"
          class="color-item"
          v-if="item.startsWith('#')"
        ></div>
        <div v-else class="color-item transparent-back"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
const defaultColors = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#8c8c8c',
  '#000000',
  ''
]
export default defineComponent({
  props: {
    value: {
      type: String
    },
    colors: {
      type: Array as PropType<string[]>,
      default: defaultColors
    }
  },
  emits: ['change'],
  setup(_, { emit }) {
    const onChange = (color: string) => {
      emit('change', color)
    }

    return {
      onChange
    }
  }
})
</script>

<style lang="scss" scoped>
.color-picker {
  display: flex;
  align-items: center;
  height: 40px;
  .input-container {
    width: 40%;
    height: 100%;
    input {
      background-color: transparent;
      border: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
  .color-list {
    width: 60%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 0;
    padding-left: 0;
    margin-left: 10px;
    li {
      list-style: none;
      border: 1px solid #eee;
      display: inline-block;
      width: 20%;
      height: 20px;
      flex-shrink: 0;
      box-sizing: border-box;
      .color-item.transparent-back {
        width: 100%;
        height: 100%;
        background: url('@/assets/transparent.png') no-repeat center;
      }
    }
  }
}
</style>
