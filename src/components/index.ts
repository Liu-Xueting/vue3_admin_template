// 使用自定义插件 注册全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
// 引入element-plus提供的图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Category from './Category/index.vue'
// k v 一致保留k
// 全局对象
const allGlobalComponents = { SvgIcon, Category }

// 对外暴露插件对象
export default {
  install(app) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key])
    })
    // 注册element-plus提供的图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
