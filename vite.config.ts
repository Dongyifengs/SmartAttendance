import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {resolve} from "path"
import {execSync} from 'child_process'
import dayjs from "dayjs";

// 获取 Git 提交哈希值（8位）
let cachedGitHash: string | null = null
function getGitHash(): string {
    if (cachedGitHash !== null) {
        return cachedGitHash
    }
    try {
        // 使用 --short=8 获取8位哈希值
        const hash = execSync('git rev-parse --short=8 HEAD').toString().trim()
        // 验证哈希值格式（8个十六进制字符）
        if (hash && /^[0-9a-f]{8}$/.test(hash)) {
            cachedGitHash = hash
            return hash
        }
        console.warn('Git 哈希值格式无效，使用默认值')
        cachedGitHash = 'unknown'
    } catch (error) {
        console.warn('无法获取 Git 提交哈希值，使用默认值')
        cachedGitHash = 'unknown'
    }
    return 'unknown'
}

// 获取完整的 Git 提交哈希值（用于GitHub链接）
let cachedFullGitHash: string | null = null
function getFullGitHash(): string {
    if (cachedFullGitHash !== null) {
        return cachedFullGitHash
    }
    try {
        const hash = execSync('git rev-parse HEAD').toString().trim()
        // 验证完整哈希值格式（40个十六进制字符）
        if (hash && /^[0-9a-f]{40}$/.test(hash)) {
            cachedFullGitHash = hash
            return hash
        }
        console.warn('完整 Git 哈希值格式无效，使用默认值')
        cachedFullGitHash = 'unknown'
    } catch (error) {
        console.warn('无法获取完整 Git 提交哈希值，使用默认值')
        cachedFullGitHash = 'unknown'
    }
    return 'unknown'
}

// 获取编译日期
function getBuildDate(): string {
    return dayjs().format("YYYY-MM-DD")
}

// 获取编译时间（包含日期和时间）
function getBuildTimestamp(): string {
    return dayjs().format("YYYY-MM-DD HH:mm:ss")
}

// 获取 Git 提交信息
let cachedCommitMessage: string | null = null
function getCommitMessage(): string {
    if (cachedCommitMessage !== null) {
        return cachedCommitMessage
    }
    try {
        const message = execSync('git log -1 --pretty=format:%s').toString().trim()
        if (message) {
            cachedCommitMessage = message
            return message
        }
        console.warn('Git 提交信息为空，使用默认值')
        cachedCommitMessage = '无提交信息'
    } catch (error) {
        console.warn('无法获取 Git 提交信息，使用默认值')
        cachedCommitMessage = '无提交信息'
    }
    return cachedCommitMessage
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
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
            // 在生产环境下，将编译信息注入到环境变量中
            'import.meta.env.VITE_BUILD_DATE': mode === 'production'
                ? JSON.stringify(getBuildDate())
                : JSON.stringify('开发环境'),
            'import.meta.env.VITE_BUILD_TIMESTAMP': mode === 'production'
                ? JSON.stringify(getBuildTimestamp())
                : JSON.stringify('开发环境'),
            'import.meta.env.VITE_GIT_HASH': mode === 'production'
                ? JSON.stringify(getGitHash())
                : JSON.stringify('开发中'),
            'import.meta.env.VITE_GIT_FULL_HASH': mode === 'production'
                ? JSON.stringify(getFullGitHash())
                : JSON.stringify('开发中'),
            'import.meta.env.VITE_COMMIT_MESSAGE': mode === 'production'
                ? JSON.stringify(getCommitMessage())
                : JSON.stringify('开发环境构建'),
            'import.meta.env.VITE_GITHUB_REPO': JSON.stringify('https://github.com/Dongyifengs/SmartAttendance'),
            // 保留 VITE_TEXT 用于开发环境
            'import.meta.env.VITE_TEXT': mode === 'production'
                ? JSON.stringify('')
                : JSON.stringify(process.env.VITE_TEXT || '开发环境')
        },
        server: {
            port: 25113,
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
