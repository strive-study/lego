import rgbHex from 'rgb-hex'
import { mount, VueWrapper } from '@vue/test-utils'
import ColorPicker from '@/components/ColorPicker.vue'
let wrapper: VueWrapper<any>
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

describe('ColorPicker component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: '#ffffff',
        colors: defaultColors
      }
    })
  })
  // <div><input></div>
  // <ul class="color-list">
  // <li class="item-0" or class="transparent-back">
  // <div></div>
  // </li></ul>
  it('should render the correct interface', () => {
    // 左侧input
    expect(wrapper.find('input').exists()).toBeTruthy()
    const input = wrapper.get('input').element
    expect(input.type).toBe('color')
    expect(input.value).toBe('#ffffff')
    // 右侧颜色列表
    expect(wrapper.findAll('.color-list li')).toHaveLength(defaultColors.length)
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement
    expect('#' + rgbHex(firstItem.style.backgroundColor)).toBe(defaultColors[0])
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement
    expect(lastItem.classList.contains('transparent-back')).toBeTruthy()
  })

  it('should send the correct event when change input', async () => {
    const blackHex = '#000000'
    const input = wrapper.get('input')
    await input.setValue(blackHex)
    expect(wrapper.emitted()).toHaveProperty('change')
    const events = wrapper.emitted('change') as string[][]
    expect(events[0]).toEqual([blackHex])
  })

  it('should send the correct event when clicking the color list', async () => {
    const firstItem = wrapper.get('li:first-child div')
    await firstItem.trigger('click')
    const events = wrapper.emitted('change') as string[][]
    expect(events[1]).toEqual([defaultColors[0]])
  })
})
