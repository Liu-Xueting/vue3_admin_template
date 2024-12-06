<template>
  <el-card>
    <el-form inline="true">
      <el-from-item label="一级分类">
        <!-- <el-select v-model="c1Id"> -->
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!--:value 下拉菜单收集id给c1Id或categoryStore.c1Id -->
          <!-- <el-option v-for="(c1, index) in c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option> -->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-from-item>
      <el-from-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-from-item>
      <el-from-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-from-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 方法一
// 引入分类接口方法
// import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr/index'
// import { onMounted, ref } from 'vue'

// // 存储一级分类数据
// let c1Arr = ref<any>([])
// let c1Id = ref<number | string>('')

// // 组件挂载完毕获取一级分类数据
// onMounted(() => {
//     getC1();
// })
// // 获取一级分类数据
// const getC1 = async () => {
//     const result = await reqCategory1()
//     if (result.code === 200) {
//         c1Arr.value = result.data
//     }
// }

// 方法二 使用全局仓库实现组件通信
import useCategoryStore from '@/store/modules/category'
import { onMounted, ref } from 'vue'
let categoryStore = useCategoryStore()

onMounted(() => {
  getC1()
})

const getC1 = async () => {
  await categoryStore.getCategory1()
}

// 一级菜单当下拉框发生变化时的回调
const handler = async () => {
  // 清除二级三级分类数据
  // 这里不清c2Arr因为在选取一级数据时会根据id得到二级数据 会跟着改变
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  await categoryStore.getCategory2()
}
// 二级菜单当下拉框发生变化时的回调
const handler1 = async () => {
  // 清除三级分类id
  categoryStore.c3Id = ''
  await categoryStore.getCategory3()
}

// 接收父组件传过来的scene场景
defineProps(['scene'])
</script>

<style scoped></style>
