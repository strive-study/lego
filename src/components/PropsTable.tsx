import { PropType, VNode, computed, defineComponent } from 'vue'
import { propsToFormsMap } from '@/propsMap'
import { reduce } from 'lodash-es'
import { TextComponentProps } from '@/defaultProps'
import { Input, InputNumber, Slider, Radio, Select } from 'ant-design-vue'
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
const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any

const toUpperCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
      required: true
    }
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
                ['on' + toUpperCase(eventName)]: (e: any) =>
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
    return () => (
      <div class="props-table">
        {Object.keys(finalProps.value).map(key => {
          const item = finalProps.value[key]
          const ComponentName = mapToComponent[item.component]
          const SubComponent = item.subComponent
            ? mapToComponent[item.subComponent]
            : null
          const props = {
            [item.valueProp]: item.value,
            ...item.extraProps,
            ...item.events
          }
          return (
            <div key={key} class="item">
              {item.text && <span class="item-label">{item.text}</span>}
              {item.value && (
                <ComponentName class="item-component" {...props}>
                  {item.options &&
                    item.options.map((option, k) => {
                      return (
                        <SubComponent key={k} value={option.value}>
                          {option.text}
                        </SubComponent>
                      )
                    })}
                </ComponentName>
              )}
            </div>
          )
        })}
      </div>
    )
  }
})

{
  /* <style lang="scss" scoped>
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
</style> */
}
