<template>
  <div class="box">
    <h1>App根组件</h1>
  </div>
</template>

<script setup lang="ts">
const str = '我爱你祖国'
const str2 = 'I love China'
</script>

<style scoped lang="scss">
.box {
  width: 600px;
  height: 400px;
  background: black;

  h1 {
    color: white;
  }
}
</style>
