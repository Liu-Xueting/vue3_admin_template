<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            size="small"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="InfoFilled"
            size="small"
            @click="findSku(row)"
          ></el-button>
          <el-button type="primary" icon="Delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- current-change会自动注入pageNo   size-change 注入当前选的页码-->
    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer" :direction="RTL">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 0px 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <!--这里的sku图片列表有个问题：在添加sku时没有添加图片列表，只是设置了默认图片-->
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
} from '@/api/product/sku/index'
import { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { RTL } from 'element-plus/es/components/virtual-list/src/defaults.mjs'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

let skuInfo = ref<any>({})

// 控制抽屉的显示与隐藏
const drawer = ref<boolean>(false)

onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    skuArr.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉发生变化
const handler = (pageSizes: number) => {
  getHasSku()
}

const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    // 商品正在上架
    await reqCancelSale(row.id)
    ElMessage.success('下架成功')
    getHasSku()
  } else {
    // 商品正在下架
    await reqSaleSku(row.id)
    ElMessage.success('上架成功')
    getHasSku()
  }
}

const updateSku = async (row: SkuData) => {
  ElMessage({
    type: 'success',
    message: '程序员在努力开发中...',
  })
}

// 查看商品详情
const findSku = async (sku: SkuData) => {
  drawer.value = true
  // 获取数据
  let result: SkuInfoData = await reqSkuInfo(sku.id)
  skuInfo.value = result.data
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
