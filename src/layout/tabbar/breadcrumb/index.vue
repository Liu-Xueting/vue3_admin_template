<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!--component动态加载渲染组件-->
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!--左侧买包屑-->
  <el-breadcrumb separator-icon="ArrowRight">
    <!--动态展示路由名字  router.matched可以获取一级路由 二级路由...-->
    <el-breadcrumb-item
      v-for="(item, index) in router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0px 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
// 获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore()

// 获取路由对象
let router = useRoute()

// 控制图标切换 默认展开
// 由于这个值要传给祖父组件 layout 需要存储到仓库中共享
// let fold = ref(false);
// 点击图标方法
const changeIcon = () => {
  // fold.value = !fold.value;
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<script lang="ts">
// 组件名称
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped></style>
