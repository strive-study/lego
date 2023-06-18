<template>
  <div class="login-page">
    <a-row>
      <a-col :span="12" class="aside">
        <div class="aside-inner">
          <h2>这是我用过的最好的建站工具</h2>
          <span class="text-white-70">王铁锤, Google</span>
        </div>
      </a-col>
      <a-col :span="12" class="login-area">
        <a-form
          layout="vertical"
          :model="form"
          :rules="rules"
          ref="loginFormRef"
        >
          <h2>欢迎回来</h2>
          <p class="subTitle">使用手机号码和验证码登录到Strive乐高</p>
          <a-form-item label="手机号码" required name="phoneNumber">
            <a-input placeholder="手机号码" v-model:value="form.phoneNumber">
              <template v-slot:prefix
                ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="验证码" required name="verifyCode">
            <a-input placeholder="四位验证码" v-model:value="form.verifyCode">
              <template v-slot:prefix
                ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" @click="login">
              登录
            </a-button>
            <a-button size="large" :style="{ marginLeft: '20px' }">
              获取验证码
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { useForm } from 'ant-design-vue/lib/form'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { Rule } from 'ant-design-vue/es/form/interface'

interface RuleFormInstance {
  validate: () => Promise<any>
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    const form = reactive({
      phoneNumber: '',
      verifyCode: ''
    })

    const loginFormRef = ref<RuleFormInstance | null>(null)
    const phoneValidator = (rule: Rule, value: string) => {
      return new Promise((resolve, reject) => {
        const passed = /^1[3-9]\d{9}$/.test(value.trim())
        setTimeout(() => {
          if (passed) {
            resolve('')
          } else {
            reject('手机号码格式不正确')
          }
        }, 500)
      })
    }
    const rules = reactive({
      phoneNumber: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        // { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        { asyncValidator: phoneValidator, trigger: 'blur' }
      ],
      verifyCode: [
        { required: true, message: '验证码不能为空', trigger: 'blur' }
      ]
    })
    const { validate, resetFields } = useForm(form, rules)
    const login = () => {
      loginFormRef.value?.validate().then(res => {
        alert('passed')
      })
    }
    return {
      form,
      rules,
      loginFormRef,
      login
    }
  }
})
</script>
<style scoped>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #1a1919;
  background-size: cover;
  background-repeat: no-repeat;
}
.aside .logo-img {
  width: 200px;
  margin-bottom: 20px;
}
.aside h2 {
  color: #cccccc;
  font-size: 29px;
}
.aside-inner {
  width: 60%;
  text-align: center;
}
.login-area {
  height: 100vh;
}
.login-area .ant-form {
  width: 350px;
}
.text-white-70 {
  color: #999;
  display: block;
  font-size: 19px;
}
.aside,
.login-area {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.login-area .ant-form-item-label {
  /* display: none; */
}
.login-area .ant-input-prefix {
  left: auto;
  right: 30px;
  font-size: 19px;
}
.login-area .ant-input {
  font-size: 17px;
  padding: 20px 45px 20px 30px;
}
</style>
