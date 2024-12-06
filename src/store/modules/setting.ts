// 小仓库: 关于layout 组件相关配置
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用于控制菜单折叠收起控制
      refsh: false, // 控制刷新效果
    }
  },
})

export default useLayOutSettingStore
