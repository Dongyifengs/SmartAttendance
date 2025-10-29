import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {resolve} from "path"
import {execSync} from 'child_process'

// 获取 Git 提交哈希值
function getGitHash(): string {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim()
    } catch (error) {
        console.warn('无法获取 Git 提交哈希值，使用默认值')
        return 'unknown'
    }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // 获取当前的 Git 哈希值
    const gitHash = getGitHash()
    
    return {
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
        define: {
            // 在生产环境下，将 Git 哈希值注入到 VITE_TEXT 中
            'import.meta.env.VITE_TEXT': mode === 'production' 
                ? JSON.stringify(`生产环境 (${gitHash})`)
                : JSON.stringify(process.env.VITE_TEXT || '开发环境')
        },
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
        resolve: {
            alias: {
                "@": resolve(__dirname, './src'),
            }
        }
    }
})
