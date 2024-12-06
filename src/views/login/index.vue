<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0">占位文字</el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-form></el-form>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref, triggerRef } from 'vue'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let useStore = useUserStore()
// 获取路由器对象
let $router = useRouter()
let $route = useRoute()

// 定义变量控制按钮加载效果
let loading = ref(false)

// 获取el-form表单对象
let loginForms = ref()

// 收集账号密码数据
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})

const login = async () => {
  // 保证表单项校验通过  返回一个promise对象
  await loginForms.value.validate() // 报错中断
  // 开始加载效果
  loading.value = true
  // 登录逻辑
  // 前端验证
  // 发登录请求
  // 请求成功跳转首页
  try {
    // 保证登陆成功
    await useStore.userLogin(loginForm)
    // 判断路由登录时 路径中有没有query参数 ：有就跳转到query参数指定的路由,没有跳转首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI, ${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    // 登录失败提示信息
    ElNotification({
      type: 'error',
      // (error as Error)类型断言
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则
const ValidatorUserName = (rule: any, value: any, callback: any) => {
  // rule:当前规则对象
  // value:当前表单项的值
  // callback:校验成功或者失败的回调函数 成功放行 失败注入错误信息
  // /^\d{5,10}$/.test(value)
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号必须是5-10位的数字'))
  }
}
const ValidatorPassWord = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}

// 定义表单校验需要的配置对象
/*
    1. 写:model和:rule在el-form上
    2. rules属性名和model绑定属性名一致
    3. prop属性名和model绑定属性名一致
*/
const rules = {
  username: [
    // element-plus自动校验规则
    // { required: true, min: 6, max: 10, message: '账号长度在 6 到 10 个字符', trigger: 'change' }

    // 自定义校验规则
    { trigger: 'change', Validator: ValidatorUserName },
  ],
  password: [
    // change改变时触发  blur 失焦时触发
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', Validator: ValidatorPassWord },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
