<template>
  <el-form label-width="100px" `>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="SKU价格(元)">
      <el-input
        placeholder="SKU价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="SKU价格(元)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrvalue.id}`"
              v-for="(attrvalue, index) in item.attrValueList"
              :key="attrvalue.id"
              :label="attrvalue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in saleAttrArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleAttrIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imageArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" width="100px" height="100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="mini" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { SkuData } from '@/api/product/spu/type'
import { ref, reactive } from 'vue'
let $emit = defineEmits(['changeScene'])

// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleAttrArr = ref<any>([])
// 照片墙
let imageArr = ref<any>([])
// 收集SKU参数
let skuParams = reactive<SkuData>({
  // 父组件传递过滤的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  // v-module 收集数据
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [
    // 平台属性
  ],
  skuSaleAttrValueList: [
    // 销售属性
  ],
  skuDefaultImg: '', // 售卖sku图片地址
})

// 获取table组件实例
let table = ref<any>()
// 取消按钮
const cancel = () => {
  // 子组件点击取消按钮 通知父组件切换场景
  $emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  row: any,
) => {
  skuParams.category3Id = row.category3Id
  skuParams.spuId = row.id
  skuParams.tmId = row.tmId
  // 获取平台属性
  let result = await reqAttr(c1Id, c2Id, row.category3Id)
  // 获取对应的销售属性
  let result2 = await reqSpuHasSaleAttr(row.id)
  // 获取照片墙数据
  let result3 = await reqSpuImageList(row.id)

  attrArr.value = result.data
  saleAttrArr.value = result2.data
  imageArr.value = result3.data
}
const handler = (row: any) => {
  // 点击时候让全部复选框不勾选
  table.value.clearSelection()
  // 复选框选中
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

const save = async () => {
  // 整理参数
  // 1.平台属性
  // reduce  起始值[] pre==[] next为这个数组的每个元素
  skuParams.skuAttrValueList = attrArr.value.reduce((pre: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.splice(':')
      pre.push({ attrId, valueId })
    }
    return pre
  }, [])
  // 2.销售属性
  skuParams.skuSaleAttrValueList = saleAttrArr.value.reduce(
    (pre: any, next: any) => {
      if (next.saleAttrIdAndValueId) {
        let [saleAttrId, saleAttrValueId] =
          next.saleAttrIdAndValueId.splice(':')
        pre.push({ saleAttrId, saleAttrValueId })
      }
      return pre
    },
    [],
  )
  let result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    // 通知父组件切换场景
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}

defineExpose({
  initSkuData,
})
</script>

<style scoped></style>
