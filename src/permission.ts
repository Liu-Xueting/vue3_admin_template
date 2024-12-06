// 路由鉴权 ： 某一个路由什么条件下可以访问 什么条件下不可以访问
import router from '@/router'

import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

import useUserStore from '@/store/modules/user'
import pinia from './store'

import setting from './setting'

// 取消掉进度条
nprogress.configure({
  showSpinner: false,
})

// 在组件外部不能拿到小仓库 要先引入大仓库
let userStore = useUserStore(pinia)

// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  //to:将要访问的路由对象  from:从哪个路由来 next:路由放行函数
  // 访问路由之前守卫

  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  // 获取token判断用户是否登录
  let token = userStore.token

  // 获取用户名字
  let username = userStore.username

  if (token) {
    // 用户登录了
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        // 如果没有用户信息 在守卫这里发请求获取到了用户信息在放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期
          // 退出登录
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
          // 用户手动修改本地存储token
        }
      }
    }
  } else {
    // 去的不是登录页
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  next()
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  // 访问路由完毕守卫
  nprogress.done()
})

// 任意路由切换实现进度条业务  ---nprogress
// 路由鉴权
// 全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(3个子路由)|商品管理(4个子路由)nprogress progress

// 用户未登录: 可以访问login 其余不能访问 访问指向login
// 用户登录成功 ：不可以访问login[指向首页] 可以访问其他路由
