<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <!-- 图标放#title插槽外面 因为折叠想显示图标 -->
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个子路由 -->
    <el-menu-item
      v-if="
        item.children &&
        item.children.length == 1 &&
        !item.children[0].meta.hidden
      "
      @click="goRoute"
      :index="item.children[0].path"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有子路由且个数大于一个 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!--递归组件-->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])

// 获取路由对象 实现路由跳转
let router = useRouter()

// 点击菜单回调 vc一个路由对象 index就是路由路径
const goRoute = (vc: any) => {
  console.log(vc.index)
  //路由跳转
  router.push(vc.index)
}
</script>

<script lang="ts">
// 递归组件要有名字
export default {
  name: 'Menu',
}
</script>

<style scoped></style>
