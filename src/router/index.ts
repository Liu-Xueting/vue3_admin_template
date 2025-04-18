// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRouter } from './routes'

// 创建路由器
let router = createRouter({
  // 路由模式 hash
  history: createWebHashHistory(),
  routes: constantRouter,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
