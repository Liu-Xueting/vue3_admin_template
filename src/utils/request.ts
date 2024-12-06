// 进行axios二次封装 ： 使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 第一步：利用axios对象的方法create，去创建一个axios实例(其他配置：基础路径 超时的时间)
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径
  timeout: 5000, // 超时的时间
})

// 第二步：request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // config配置对象，headers属性请求头，经常给服务器发请求携带公共参数

  // 获取仓库token
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // 要返回配置对象
  return config
})

// 第三步：响应拦截器
request.interceptors.response.use(
  (response) => {
    // 响应成功的回调
    // 响应拦截器可以检测到请求是否成功，请求成功返回的数据是什么
    // console.log(response)
    return response.data
  },
  (error) => {
    // 响应失败的回调:处理http网络错误
    // 定义一个变量:存储网络错误信息
    let message = ''
    let status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
    }
    // 提示错误信息
    ElMessage({
      message, // kv一致省略v
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default request
