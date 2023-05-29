import { mount, VueWrapper } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'
import { message as _message } from 'ant-design-vue'
import store from '@/store'
const message = _message as jest.Mocked<typeof _message>
let wrapper: VueWrapper<any>
jest.mock('ant-design-vue', () => {
  return {
    message: {
      success: jest.fn()
    }
  }
})
// jest.mock('vuex')
const mockedRoutes: string[] = []
jest.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: (url: string) => mockedRoutes.push(url)
      }
    }
  }
})

const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponent2 = {
  template: "<div><slot></slot><slot name='overlay'></slot></div>"
}
const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent
}

describe('UserProfile component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(window, 'setTimeout')
    // jest.spyOn(global, 'setTimeout')
    wrapper = mount(UserProfile, {
      props: {
        user: {
          isLogin: false
        }
      },
      global: {
        components: globalComponents,
        provide: {
          store
        }
      }
    })
  })

  it('should render login button when login is false', async () => {
    expect(wrapper.get('div').text()).toBe('登录')
    await wrapper.get('div').trigger('click')
    expect(message.success).toHaveBeenCalled()
    expect(store.state.user.username).toBe('xiaoli')
  })

  it('should render username when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        username: 'xiaoli'
      }
    })
    expect(wrapper.get('.user-profile-component').html()).toContain('xiaoli')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })

  it('should call logout and show message,call router.push after timeout', async () => {
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    expect(store.state.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(mockedRoutes).toEqual(['/'])
  })
  afterEach(() => {
    message.success.mockReset()
  })
})
