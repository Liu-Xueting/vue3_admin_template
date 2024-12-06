import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置elemement-plus国际化
// @ts-ignore 忽略类型检查 解决使用国际化打包不成功的问题
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入自定义插件对象：注册整个项目的全局组件
import globalComponent from '@/components'
// 引入路由
import router from './router'
// 引入pinia仓库
import pinia from './store'
// 引入路由鉴权文件
import './permission'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化
})
// 获取环境变量
// console.log(import.meta.env)

// Icon定义为全局组件
// import SvgIcon from '@/components/SvgIcon/index.vue'
// app.component('SvgIcon', SvgIcon)

// 安装自定义插件
app.use(globalComponent)
app.use(router)
app.use(pinia)

// 测试假接口mock能否使用
// import axios from 'axios'
// 登录接口
// axios({
//   url: '/api/user/login',
//   method: 'post',
//   data: {
//     username: 'admin',
//     password: '1112111',
//   },
// })

app.mount('#app')
