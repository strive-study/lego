import { VNode } from 'vue'
import { AllComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  // 额外配置组件的属性
  extraProps?: {
    [key: string]: any
  }
  text?: string
  options?: {
    text: string | VNode
    value: any
  }[]
  initialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [P in keyof AllComponentProps]?: PropToForm
}
const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }
]
const fontFamilyOptions = fontFamilyArr.map(font => {
  return {
    value: font.value,
    // text: h('span', { style: { fontFamily: font.value } }, font.text)
    text: <span style={{ fontFamily: font.value }}>{font.text}</span>
  }
})
// css属性与组件类型映射Map
export const propsToFormsMap: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: {
      rows: 3,
      style: 'resize:none'
    },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e ? `${e}px` : ''),
    extraProps: {
      style: 'width:80px;'
    }
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: any) => e.toString()
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [{ value: '', text: '无' }, ...fontFamilyOptions],
    extraProps: {
      style: 'width:100px;'
    }
  },
  // TODO More realtion
  color: {
    component: 'color-picker',
    text: '字体颜色'
  },
  textDecoration: {
    component: 'switch-icon',
    valueProp: 'checked',
    extraProps: { iconName: 'ItalicOutlined', tip: '下划线' },
    initialTransform: e => e === 'underline',
    afterTransform: e => (e ? 'underline' : 'none')
  },
  fontStyle: {
    component: 'switch-icon',
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '斜体' },
    initialTransform: e => e === 'italic',
    afterTransform: e => (e ? 'italic' : 'normal')
  },
  fontWeight: {
    component: 'switch-icon',
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' },
    initialTransform: e => e === 'bold',
    afterTransform: e => (e ? 'bold' : 'normal')
  },
  src: {
    component: 'image-processer'
  }
}
