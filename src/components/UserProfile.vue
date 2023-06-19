<template>
  <a-button
    type="primary"
    v-if="!user.isLogin"
    class="user-profile-component"
    @click="login"
  >
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user?.data?.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item>
          <a-menu-item key="1" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '@/store/user'
import axios from 'axios'

const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  }
})
const store = useStore()
const router = useRouter()

const login = () => {
  store.commit('login')
  message.success('登录成功', 2)
}

const logout = () => {
  store.commit('logout')
  message.success('退出登录成功，2秒后跳转到首页', 2)
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
const createDesign = async () => {
  const payload = {
    title: '未命名作品',
    desc: '未命名作品',
    coverImg:
      'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
  }
  const postData = {
    method: 'post',
    data: payload,
    opName: 'createDesign'
  } as any
  const { data } = await axios('/works', postData)
  message.success('创建作品成功', 2)
  router.push(`/editor/${data.data.id}`)
}
</script>
<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}
</style>
