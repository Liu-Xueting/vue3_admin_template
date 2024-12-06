<template>
  <div>
    <h1>我是一级路由登录成功以后的数据</h1>
  </div>
</template>

<script setup lang="ts">
// 引入组合式函数API生命周期函数
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  // 获取用户信息
  userStore.userInfo()
})
</script>

<style scoped></style>
