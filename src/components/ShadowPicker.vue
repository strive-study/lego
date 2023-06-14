<template>
  <div class="component-shadow-picker">
    <div class="shadow-item">
      <span>阴影颜色:</span>
      <div class="shadow-component">
        <color-picker
          :value="values[3]"
          @change="
            v => {
              updateValue(v, 3)
            }
          "
        ></color-picker>
      </div>
    </div>
    <div class="shadow-item">
      <span>阴影大小:</span>
      <div class="shadow-component">
        <a-slider
          :value="parseInt(values[0])"
          :min="0"
          :max="20"
          @change="
            v => {
              updateValue(v, [0, 1])
            }
          "
        ></a-slider>
      </div>
    </div>
    <div class="shadow-item">
      <span>阴影模糊:</span>
      <div class="shadow-component">
        <a-slider
          :value="parseInt(values[2])"
          :min="0"
          :max="20"
          @change="
            v => {
              updateValue(v, 2)
            }
          "
        ></a-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ColorPicker from './ColorPicker.vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    ColorPicker
  },
  emits: ['change'],
  setup(props, context) {
    const values = computed(() => {
      // box shadow css值
      // 10px 10px 0px red;
      // 前两位大小 第三个blur 第四个颜色
      return props.value.split(' ')
    })
    const updateValue = (
      newValue: number | string,
      index: number | number[]
    ) => {
      const newValues = computed(() => {
        return values.value.map((item, i) => {
          if (typeof index === 'number' && i === index) {
            return typeof newValue === 'number' ? newValue + 'px' : newValue
          } else if (Array.isArray(index) && index.includes(i)) {
            return typeof newValue === 'number' ? newValue + 'px' : newValue
          } else {
            return item
          }
        })
      })
      context.emit('change', newValues.value.join(' '))
    }
    return {
      values,
      updateValue
    }
  }
})
</script>

<style scoped lang="scss">
.shadow-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  span {
    width: 28%;
  }
}
.shadow-component {
  width: 70%;
}
</style>
