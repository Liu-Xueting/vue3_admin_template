<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0px;">
            <div v-show="scene == 0">
                <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                    @click="addSpu">添加SPU</el-button>
                <el-table style="margin: 10px 0px;" border :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作">
                        <!-- row:即为已有的SPU对象 -->
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Plus" title="添加SKU"
                                @click="addSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Edit" title="修改SPU"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="primary" size="small" icon="View" title="查看SKU列表"
                                @click="findSku(row)"></el-button>
                            <el-popconfirm :title="`你确定删除${row.spuName}吗？`" width="200px" @confirm="removeSpu(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                    @current-change="getHasSpu" @size-change="changeSize" />
            </div>
            <!-- v-if v-show都可以显示与隐藏 但是v-show只挂载一次 -->
            <!-- 添加|修改 SPU -->
            <!-- 自定义事件向父组件传值changeScene -->
            <SpuForm ref="SpuForm" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
            <!-- 添加SKU -->
            <SkuForm ref="SkuForm" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
            <!-- dialog对话框展示sku列表 -->
            <el-dialog v-model="show" title="SKU列表">
                <el-table :data="skuArr" border>
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column prop="price" label="SKU价格(元)"></el-table-column>
                    <el-table-column prop="weight" label="SKU重量(g)"></el-table-column>
                    <el-table-column label="图片">
                        <template #="{ row }">
                            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;" />
                        </template>
                    </el-table-column>

                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
let categoryStore = useCategoryStore()
// 场景的数据
let scene = ref<number>(0)   // 0:显示已有SPU 1:添加|修改SPU 2:添加SKU
// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据量
let pageSize = ref<number>(3)

// 响应的spu数据列表
let records = ref<Records>([])
let total = ref<number>(0)

// 存储全部的sku数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
// 获取子组件实例
let spu = ref<any>()
let sku = ref<any>()

// 监听三级分类改变
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) {
        return;
    }
    // 获取已有品牌数据
    getHasSpu()
})

// 获取已有品牌数据
const getHasSpu = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code == 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}
// 分页器下拉菜单发生变化触发
const changeSize = () => {
    getHasSpu()
}

const addSpu = (row: SpuData) => {
    scene.value = 1
    // 点击添加按钮 调用子组件方法初始化数据
    spu.value.initSpuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 子组件SpuForm向父组件传值
const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.params == 'update') {
        //留在当前页
        getHasSpu(pageNo.value)
    } else {
        // 添加留在第一页
        getHasSpu()
    }

}

const updateSpu = (row: SpuData) => {
    scene.value = 1
    spu.value.initSpuData(row)
}

// 添加SKU
const addSku = () => {
    scene.value = 2
    sku.value.initSkuData()

}

// 查找sku列表
const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList(row.id)
    if (result.code === 200) {
        skuArr.value = result.data
        // 显示对话框
        show.value = true
    }
}

const removeSpu = async (row: SpuData) => {
    let result = await reqRemoveSpu(row.id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getSpuList(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}

// 路由组件销毁前，清空仓库
onBeforeUnmount(() => {
    categoryStore.$reset()
})
</script>

<style scoped></style>