import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({ prefix: 'Icon' })
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({ enabledCollections: ['ep'], })
            ],
        }),
    ],
    server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
        proxy: {
            '/PairAPI': {
                target: 'https://api.anlaxy.com.cn/SerApi/v02',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/PairAPI/, ''),
            }
        }
    },
    base: './',
})
