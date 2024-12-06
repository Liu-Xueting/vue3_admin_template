<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <!-- 场景切换 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row:回传的属性对象Attr 相当于给了v-module=attrArr 
                             插槽相当于将一个数组传给子组件 子组件循环后将每个对象和索引传给父组件
                         -->
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row:已有的属性对象 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`你确定要删除${row.valueName}？}`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改属性的结构 -->
        <!-- inline="true"行内展示 -->
        <el-form inline="true">
          <el-form-item label="属性名称">
            <!-- 收集数据 -->
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- row:即为当前属性值对象 -->
              <el-input
                size="small"
                ref="(vc:any)=>inputArr[$index]=vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">
                {{ attrParams.attrName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 组合式api函数watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
// 获取分类仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()

// 存储已有的属性和属性值
let attrArr = ref<Attr[]>([]) // Attr[] 类型
// 定义卡片内容切换变量
let scene = ref<number>(0) // scene=0 显示table scene=1 显示添加与修改表单

// 准备一个数组存储 el-input实例
let inputArr = ref<any>([])

// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: <AttrValue>[],
})

// 监听仓库三级分类id变化
watch(
  () => categoryStore.c3Id,
  async () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类得有才能发请求
    if (!categoryStore.c3Id) {
      return
    }
    getAttrList()
  },
)

// 获取已有的属性与属性值方法
const getAttrList = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 添加属性
const addAttr = () => {
  // 每次点击添加属性按钮时，清空收集的数据
  Object.assign(attrParams, {
    attrName: '',
    categoryId: categoryStore.c3Id, // 当点击添加属性按钮时，收集新增属性三级分类的id
    categoryLevel: 3,
    attrValueList: <AttrValue>[],
  })
  // 切换添加或修改场景
  scene.value = 1
}

// 修改属性
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给attrParams对象
  // Object.assign(attrParams, row)
  // 浅拷贝使用同一个对象  当修改attrParams时 row也会变化 所以即使没有修改点击取消也会显示 但是服务器没有
  // 深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮
const addAttrValue = () => {
  // 当点击添加属性值按钮时，添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每个属性值编辑模式与显示模式切换
  })
  // 获取最后的el-input实例聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

const save = async () => {
  // 检查attrParams.attrValueList是否有空数据或者重复 防止没有blur直接保存
  // DOTO: 但是本项目没有做 BUG
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 获取所有属性
    getAttrList()
  } else {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 属性值表单元素失去焦点
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况的判断
  if (row.valueName.trim() == '') {
    // 删除空串
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法二 属性值不能重复
  let repest = attrParams.attrValueList.find((item) => {
    // 切记把当前失去焦点属性值对象从当前数组扣除
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repest) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 展示div
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // 获取更新后的dom
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除属性
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取所有属性
    getAttrList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁时，把仓库分类相关数据清空
onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset()
})
</script>

<style scoped></style>
