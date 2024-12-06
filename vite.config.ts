import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg图标插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //command 用于获取当前开发环境
  // 获取各个环境下对应的变量  process.cwd()项目根目录 mode：环境
  // let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve', // 保证开发阶段可以使用mock接口
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },

    // 代理跨域
    // server: {
    //   proxy: {
    //     [env.VITE_APP_BASE_API]: {
    //       // 服务器地址
    //       target: env.VITE_SERVE_URL,
    //       // 是否代理跨域
    //       changeOrigin: true,
    //       // 路径重写
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  }
})
