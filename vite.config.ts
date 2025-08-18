import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 配置文件文档: https://vite.dev/config/
export default defineConfig({
  // Plugins Vite 插件
  plugins: [
      vue(),
      AutoImport({
          resolvers: [ElementPlusResolver()],
      }),
      Components({
          resolvers: [ElementPlusResolver()],
      }),
  ],
  // 服务器选项
  server: {
      port: 3000,
      host: '0.0.0.0',
      open: true
  }
})
