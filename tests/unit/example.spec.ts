import { shallowMount, mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Hello from '@/components/Hello.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
    // const wrapper = mount(HelloWorld, {
    //   props: {
    //     msg
    //   }
    // })
    // console.log(wrapper.html())
    console.log(wrapper.findComponent(Hello).props())
    // expect(wrapper.text()).toMatch(msg)
  })
})
