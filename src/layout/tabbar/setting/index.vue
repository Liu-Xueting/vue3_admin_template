<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!--下拉菜单-->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取组件小仓库
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
// 获取路由器对象
let router = useRouter()
// 获取路由对象
let route = useRoute()
// 更新回调
const updateRefsh = () => {
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}

// 全屏按钮回调
const fullScreen = () => {
  // DOM对象的一个属性 用来判断当前是否是全屏
  let full = document.fullscreenElement
  if (!full) {
    // 文档的根节点的requestFullscreen方法实现全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}

// 退出登录
const logout = async () => {
  // 1. 向服务器发请求[退出登录] ...
  // 2. 清除仓库中用户数据[token|username|avatar]
  await userStore.userLogout()
  // 3. 跳转到登录页
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<script lang="ts">
// 组件名称
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
