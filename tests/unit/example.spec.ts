import { shallowMount, VueWrapper } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Hello from '@/components/Hello.vue'
import axios from 'axios'
import { flushPromises } from '@vue/test-utils'

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const msg = 'new message'
describe('HelloWorld.vue', () => {
  beforeAll(() => {
    wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
  })
  afterEach(() => {
    mockAxios.get.mockReset()
  })
  it('renders props.msg when passed', () => {
    console.log(wrapper.findComponent(Hello).props())
  })

  it('should update the count when clicking the button', async () => {
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').text()).toBe('2')
  })

  it('should add todo when fill the input and click the add button', async () => {
    const todoConent = 'buy milk'
    await wrapper.get('input').setValue(todoConent)
    expect(wrapper.get('input').element.value).toBe(todoConent)
    await wrapper.get('.addTodo').trigger('click')
    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.get('li').text()).toBe(todoConent)
    expect(wrapper.emitted()).toHaveProperty('send')
    const events = wrapper.emitted('send') as string[][]
    expect(events[0]).toEqual([todoConent])
    await wrapper.get('input').setValue('')
    await wrapper.get('.addTodo').trigger('click')
    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('should load user message when click the load button', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { username: 'xiaoli' } })
    await wrapper.get('.loadUser').trigger('click')
    expect(mockAxios.get).toHaveBeenCalled()
    expect(wrapper.find('.loading').exists()).toBeTruthy()
    await flushPromises()
    expect(wrapper.find('.loading').exists()).toBeFalsy()
    expect(wrapper.get('.username').text()).toBe('xiaoli')
  })
})
