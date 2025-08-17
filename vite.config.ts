import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 配置文件文档: https://vite.dev/config/
export default defineConfig({
  // Plugins Vite 插件
  plugins: [
      vue()
  ],
  // 服务器选项
  server: {
      port: 3000,
      host: '0.0.0.0',
      open: true
  }
})
