<template>
  <div class="layout_container">
    <!--左侧菜单-->
    <div class="layout_slider">
      <Logo></Logo>
      <!--展示菜单-->
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单组件-->
        <!-- :default-active="route.path" 展开激活菜单 这个属性和:index对应 -->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="pink"
        >
          <!--根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div
      class="layout_tabbar"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <!--内容展示区-->
    <div
      class="layout_main"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单Logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
import Tabbar from './tabbar/index.vue'
let route = useRoute()
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'

let userStore = useUserStore()
// 获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
// 组件名称
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        // 取出element-plus的默认样式
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width); // calc计算
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      // 因为原来position: fixed;left: $base-menu-width; 所以要定位
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width); // calc计算
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      // 因为原来position: fixed;left: $base-menu-width; 所以要定位
    }
  }
}
</style>
