<template>
  <!-- 路由组件出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'
let layOutSettingStore = useLayOutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)

// 监听仓库数据是否发生变化 发生变化 说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refsh,
  () => {
    // 刷新: 销毁重建组件
    flag.value = false
    // nextTick 当响应式数据发生变化之后 可以获取到更新后的dom
    // 也就是说确认销毁后再创建组件
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
// 组件名称
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
