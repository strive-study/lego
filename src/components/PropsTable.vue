<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="item">
      <span class="item-label" v-if="item.text">{{ item.text }}</span>
      <component
        class="item-component"
        v-if="item.value"
        :is="item.component"
        :[item.valueProp]="item.value"
        v-bind="item.extraProps"
        v-on="item.events"
      >
        <template v-if="item.options">
          <component
            :is="item.subComponent"
            v-for="(option, k) in item.options"
            :key="k"
            :value="option.value"
          >
            <render-vnode :v-node="option.text" />
          </component>
        </template>
      </component>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType, VNode, computed, defineComponent } from 'vue'
import { propsToFormsMap } from '@/propsMap'
import { reduce } from 'lodash-es'
import { TextComponentProps } from '@/defaultProps'
import RenderVnode from './renderVnode'
import ColorPicker from './ColorPicker.vue'
interface FormProps {
  component: string
  subComponent?: string
  value: string
  // 额外配置组件的属性
  extraProps?: {
    [key: string]: any
  }
  text?: string
  options?: {
    text: string | VNode
    value: any
  }[]
  valueProp: string //ts类型报错 应为可选类型?
  eventName?: string
  events: {
    [key: string]: (e: any) => void
  }
}
export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
      required: true
    }
  },
  components: {
    'color-picker': ColorPicker,
    'render-vnode': RenderVnode
  },
  emits: ['change'],
  setup(props, { emit }) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps
          const item = propsToFormsMap[newKey]
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initialTransform,
              afterTransform
            } = item
            const newItem: FormProps = {
              ...item,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) =>
                  emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e
                  })
              }
            }

            result[newKey] = newItem
          }
          return result
        },
        {} as { [key: string]: FormProps }
      )
    })
    return {
      finalProps
    }
  }
})
</script>
<!-- <script lang="ts" setup>
import { PropType, VNode, computed } from 'vue'
import { propsToFormsMap } from '@/propsMap'
import { reduce } from 'lodash-es'
import { TextComponentProps } from '@/defaultProps'
import RenderVnode from './renderVnode'
import ColorPicker from './ColorPicker.vue'
interface FormProps {
  component: string
  subComponent?: string
  value: string
  // 额外配置组件的属性
  extraProps?: {
    [key: string]: any
  }
  text?: string
  options?: {
    text: string | VNode
    value: any
  }[]
  valueProp: string //ts类型报错 应为可选类型?
  eventName?: string
  events: {
    [key: string]: (e: any) => void
  }
}
const props = defineProps({
  props: {
    type: Object as PropType<Partial<TextComponentProps>>,
    required: true
  }
})

const emits = defineEmits(['change'])

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps
      const item = propsToFormsMap[newKey]
      if (item) {
        const {
          valueProp = 'value',
          eventName = 'change',
          initialTransform,
          afterTransform
        } = item
        const newItem: FormProps = {
          ...item,
          value: initialTransform ? initialTransform(value) : value,
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) =>
              emits('change', {
                key,
                value: afterTransform ? afterTransform(e) : e
              })
          }
        }

        result[newKey] = newItem
      }
      return result
    },
    {} as { [key: string]: FormProps }
  )
})
</script> -->

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  &-label {
    width: 28%;
  }
  &-component {
    width: 66%;
  }
}
</style>
