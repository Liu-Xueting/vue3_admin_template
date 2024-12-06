// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type { UserState } from './types/types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// import type {
//   loginFormData,
//   loginResponseData,
//   userInfoResponseData,
// } from '@/api/user/type'
import type {
  LoginForm,
  LoginResponseData,
  UserInfoResponseData,
} from '@/api/user/type'
// 引入路由(常量路由)
import { constantRouter } from '@/router/routes'

let useUserStore = defineStore('User', {
  // 存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRouter, // 仓库存储生成菜单需要的数组(路由)
      username: '',
      avatar: '',
    }
  },
  // 异步|逻辑的地方
  actions: {
    // // 用户登录的方法 返回promise对象决定是否成功
    // async userLogin(data: loginFormData) {
    //   let result: loginResponseData = await reqLogin(data)
    //   if (result.code == 200) {
    //     // 由于pinia存储数据其实利用js对象
    //     this.token = result.data as string
    //     //本地存储持久化
    //     SET_TOKEN(result.data as string)
    //     // 能保证当前async函数返回一个成功的promise
    //     return 'ok'
    //   } else {
    //     return Promise.reject(new Error(result.data))
    //   }
    // },
    // 用户登录的方法 返回promise对象决定是否成功
    async userLogin(data: LoginForm) {
      let result: LoginResponseData = await reqLogin(data)
      if (result.code == 200) {
        // 由于pinia存储数据其实利用js对象
        // this.token = result.data as string
        this.token = result.data.token as string // result.data
        //本地存储持久化
        SET_TOKEN(result.data.token as string) // result.data
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message)) // result.message
      }
    },
    // 获取用户信息
    async userInfo() {
      // 获取用户信息存储在仓库中[用户头像 名字]
      let result: UserInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.checkUser.name // result.data.name
        this.avatar = result.data.checkUser.avatar // result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message)) // result.message
      }
    },

    // 退出登录
    async userLogout() {
      // 发请求token失效
      // let result: any = await reqLogout()
      // if (result.code == 200) {
      // 目前没有mock接口：退出登录接口(通知服务器本地用户唯一标识失效)
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
      // return 'ok'
      // } else {
      // return Promise.reject(new Error(result.message))
      // }
    },
  },
  // 计算属性
  getters: {},
})

export default useUserStore
