<template>
  <div>
    <el-card class="box-card">
      <!--卡片顶部添加按钮-->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTradeMark"
      >
        添加品牌
      </el-button>
      <!--表格组件-->
      <el-table style="margin: 10px 0px" border :data="trademarkList">
        <!--el-table-column默认用div展示数据-->
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <!--用插槽展示-->
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTradeMark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
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
      <!--分页器组件-->
      <!--
            page-sizes:用于设置下拉菜单数据
            background:按钮的背景颜色
            layout:设置分页器六个子组件布局的调整
        -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>

    <!-- 对话框组件：在添加品牌与修改已有品牌的业务的时候使用结构 -->
    <!--  v-model: 属性用户控制对话框的显示与隐藏 true显示 false隐藏 -->
    <el-dialog
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      v-model="dialogVisible"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="fromRef"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
          <!-- action:请求服务器上传url  上传路径写/api
                          before-upload:上传之前的钩子
                          on-success:
                      -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  TradeMarkResponseData,
  Records,
  TradeMark,
} from '@/api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 每页条数
let pageSize = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌数据
let trademarkList = ref<Records>([])
// 控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  id: 0,
  logoUrl: '',
  tmName: '',
})

// 获取el-from 组件
let formRef = ref()

// 获取已有品牌函数
// 对于当前页码发生变化自定义事件，组件pagination父组件回传了当前页码数据
const getHasTrademark = async (pager = 1) => {
  // 当前每页数据量发生变化时，没有传参，页码默认为1,
  // 当点击页码时 pagination会注入当前点击页数给pager
  pageNo.value = pager
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    pageSize.value,
  )
  /*
        code:
        message
        data:{
            records:[createTime:
                    id:
                    logoUrl:
                    tmName:
                    updateTime:],
            total:
            size
            current
            searchCount
            pages
        }
        ok:
       
    */
  if (result.code == 200) {
    total.value = result.data.total
    trademarkList.value = result.data.records
  }
}
// 组件一挂载 就获取第一页默认
onMounted(() => {
  getHasTrademark()
})

// 分页器页码发生变化时会触发
// 对于当前页码发生变化自定义事件，组件pagination父组件回传了当前页码数据 但是不需要！！！
// const changePageNo = () => {
//     // 当前页码发生变化时再次发请求获取对应已有品牌数据展示
//     getHasTrademark()
// }

// 当下拉菜单发生变化触发方法
// 自定义事件，组件pagination父组件回传了下拉菜单选中数据 但是不需要！！！
const sizeChange = () => {
  // 当前每页数据量发生变化时，页码会变为1，
  // pageNo.value = 1
  getHasTrademark()
}

// 添加品牌按钮
const addTradeMark = () => {
  // 对话框显示
  dialogVisible.value = true
  // 清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 第一次点击添加按钮 el-from组件还没有渲染 所以获取不到
  // 写法一
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // 写法二 使用nextTick获取更新后的el-from组件
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改已有品牌的按钮
// row即为当前已有的品牌
const updateTradeMark = (row: TradeMark) => {
  // 清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogVisible.value = true
  // Es6语法
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // // 展示已有品牌数据
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}

// 对话框底部取消按钮
const cancel = () => {
  // 对话框关闭
  dialogVisible.value = false
}

// 对话框底部确定按钮
const confirm = async () => {
  // 在发请求之前，对整个表单校验 对图片校验
  // 在调用这个方法进行校验 校验全部通过 再执行后面的语法
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    // 对话框关闭
    dialogVisible.value = false
    // 提示
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 刷新列表 添加留在第一页 修改留在当前页
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
    // 对话框关闭
    dialogVisible.value = false
  }
}

// 上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求 ：文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    // /1024 -> K  /1024/1024 -> M
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage.error({
        type: 'error',
        message: '上传图片大小不能超过4M',
      })
      return false
    }
  } else {
    ElMessage.error({
      type: 'error',
      message: '上传图片只能是png|jpg|gif格式的图片',
    })
    return false
  }
}

// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response即为当前上传图片请求服务器返回的数据
  // uploadFile包含response和文件其他详细信息
  // 收集图片地址
  trademarkParams.logoUrl = response.data
  // 图片上传成功 清除对应的图片校验提示
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定义校验规则函数
// rule规则对象 value当前表单项的值 callback校验成功或者失败的回调函数
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    // 校验通过
    callback()
  } else {
    callback(new Error('品牌名称长度不能小于2'))
  }
}
// value图片地址
const ValidatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传品牌logo'))
  }
}

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: ValidatorLogoUrl }],
}

// 气泡确认框确认按钮回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 刷新列表 判断当前页页数 大于1就刷新当前页，否则刷新前一页
    getHasTrademark(
      trademarkList.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage.error('删除品牌失败')
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
