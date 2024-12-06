<template>
  <!--将svg封装成一个组件-->
  <!--svg: 图标外层容器节点，内部需要与use标签结合使用-->
  <!-- k v 一致省略 v -->
  <svg :style="{ width, height }">
    <!-- xlink:href 指定用哪个图标 以 #icon- 开头-->
    <!--fill属性设置svg图标颜色-->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收父组件传来的参数
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 使用提供图标的名字
  name: String,
  // 接收父组件传递的颜色
  color: {
    type: String,
    default: '',
  },
  // 接受父组件图标宽度
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
