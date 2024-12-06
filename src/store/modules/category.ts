// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/types'
let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c2Arr: [],
      c3Arr: [],
      // 存储一级分类的Id
      c1Id: '',
      c2Id: '',
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类数据
    async getCategory1() {
      let result: CategoryResponseData = await reqCategory1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },

    // 获取二级分类数据
    async getCategory2() {
      let result: CategoryResponseData = await reqCategory2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },

    // 获取三级分类数据
    async getCategory3() {
      let result: CategoryResponseData = await reqCategory3(this.c2Id)
      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
})

export default useCategoryStore
