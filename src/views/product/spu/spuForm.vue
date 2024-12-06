<template>
  <!-- label-width 统一标签长度 -->
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="spuParams.spuName"
        placeholder="请输入SPU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <!-- v-model可以展示又可以收集-->
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="(item, index) in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:file-list展示图片数据 
                  action: 上传图片的而接口地址
                  list-type:展示图片的方式
                  on-preview:点击预览按钮
            -->
      <el-upload
        v-model:file-list="allSpuImageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : `无`
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- table 展示销售属性与属性值-->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row:即为当前spu销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0px 5px"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SpuData } from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpu,
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu/index'
import type {
  SpuSaleAttrValue,
  HasSaleAttr,
  SpuSaleAttr,
  SpuImage,
  Trademark,
  TrademarkResponseData,
  SpuHasImage,
  SaleAttrResponse,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])

// 存储已有的SPU数据
let allTradeMark = ref<Trademark[]>([])
let allSpuImageList = ref<SpuImage[]>([])
let saleAttr = ref<SpuSaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])

// 控制图片对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储图片地址
let dialogImageUrl = ref<string>('')
// 存储已有的SPU对象
let spuParams = ref<SpuData>({
  spuName: '',
  tmId: '', // spu品牌id
  category3Id: '',
  description: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
// 将来还未选择的销售属性的ID与属性值的名字
let saleAttrAndValueName = ref<string>('')
const cancel = () => {
  // 子组件点击取消按钮 通知父组件切换场景
  $emit('changeScene', { flag: 0, params: 'update' })
}

const initHasSpuData = async (spu: SpuData) => {
  spuParams.value = spu
  // spu:父组件传过来的spu对象
  // 获取全部品牌的数据
  let result: TrademarkResponseData = await reqAllTrademark()
  // 获取某一个品牌旗下全部售卖商品图片
  let result2: SpuHasImage = await reqSpuImageList(spu.id)
  // 获取已有SPU的销售属性数据(详细信息)
  let result3: SaleAttrResponse = await reqSpuHasSaleAttr(spu.id)
  // 获取全部的销售属性数据
  let result4: HasSaleAttrResponseData = await reqAllSaleAttr()

  allTradeMark.value = result.data
  allSpuImageList.value = result2.data.map((item: SpuImage) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = result3.data
  allSaleAttr.value = result4.data
}

const handlePictureCardPreview = (file: any) => {
  // 对话框弹出
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙删除按钮
const handleRemove = () => {
  // 自动已经做完了 因为已经收集了allSpuImageList数据 会自动删除
}

// 图片上传成功之前约束文件大小与文件类型
const handlerUpload = (file: any) => {
  // file:上传的文件对象
  // 判断上传文件类型是否合法
  if (
    file.type == 'image/jpeg' ||
    file.type == 'image/png' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传图片大小不能超过3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传图片类型只能是jpeg|png|gif格式的图片',
    })
    return false
  }
}

// TODO:重点！！！计算当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部销售属性 颜色、尺码、版本
  // 已有销售属性 颜色、尺码
  let unSelectedAttr = allSaleAttr.value.filter((item: HasSaleAttr) => {
    return saleAttr.value.every((sale: SpuSaleAttr) => {
      return sale.saleAttrName != item.name
    })
  })
  return unSelectedAttr
})

// 添加属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrAndValueName.value.split(':')
  // 准备一个新的销售属性对象，将来带给服务器
  let newSaleAttr: SpuSaleAttr = {
    baseSaleAttrId: baseSaleAttrId,
    saleAttrName: saleAttrName,
    spuId: spuParams.value.id,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 请控制收集的数据
  saleAttrAndValueName.value = ''
}

const toEdit = (row: SpuSaleAttr) => {
  // 切换编辑模式
  // 因为这个按钮要互不影响 所以直接修改row对象
  row.flag = true
  row.saleAttrValue = ''
}

// 表单失去焦点的回调
const toLook = (row: SpuSaleAttr) => {
  // 整理收集到的属性ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SpuSaleAttrValue = {
    baseSaleAttrId: baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  }
  // 非法情况判断
  if (saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 判断属性值是否重复
  let repeat = row.spuSaleAttrValueList.find((item: SpuSaleAttrValue) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换回查看模式
  row.flag = false
  // 清空收集的数据
  row.saleAttrValue = ''
}

// 保存按钮
const save = async () => {
  // 整理参数
  // 1. 照片墙数据
  spuParams.value.spuImageList = allSpuImageList.value.map((item: any) => {
    return {
      imgName: item.name,
      // item.response && item.response.data新增图片文件地址 否则就是原来的图片地址
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2.整理销售属性数据
  spuParams.value.spuSaleAttrList = saleAttr.value

  // 发请求
  let result = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
    // 切换场景
    $emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加一个新的SPU
const initAddSpu = (c3Id: number | string) => {
  // 清空收集的数据
  Object.assign(spuParams.value, {
    spuName: '',
    tmId: '',
    category3Id: '',
    description: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片
  allSpuImageList.value = []
  saleAttr.value = []
  saleAttrAndValueName.value = ''

  spuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  let result: TrademarkResponseData = await reqAllTrademark()
  // 获取全部的销售属性数据
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  allTradeMark.value = result.data
  allSaleAttr.value = result1.data
}

// 对外暴露 让父亲拿到
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
