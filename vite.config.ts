// Vite 配置文件
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';
import { execSync } from 'child_process';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 配置 dayjs 使用时区插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 获取 Git 提交哈希值（8位）
let cachedGitHash: string | null = null;
function getGitHash(): string {
  if (cachedGitHash !== null) {
    return cachedGitHash;
  }
  try {
    // 使用 --short=8 获取8位哈希值
    const hash = execSync('git rev-parse --short=8 HEAD').toString().trim();
    // 验证哈希值格式（8个十六进制字符）
    if (hash && /^[0-9a-f]{8}$/.test(hash)) {
      cachedGitHash = hash;
      return hash;
    }
    console.warn('Git 哈希值格式无效，使用默认值');
    cachedGitHash = 'unknown';
  } catch (error) {
    console.warn('无法获取 Git 提交哈希值，使用默认值', error);
    cachedGitHash = 'unknown';
  }
  return 'unknown';
}

// 获取完整的 Git 提交哈希值（用于GitHub链接）
let cachedFullGitHash: string | null = null;
function getFullGitHash(): string {
  if (cachedFullGitHash !== null) {
    return cachedFullGitHash;
  }
  try {
    const hash = execSync('git rev-parse HEAD').toString().trim();
    // 验证完整哈希值格式（40个十六进制字符）
    if (hash && /^[0-9a-f]{40}$/.test(hash)) {
      cachedFullGitHash = hash;
      return hash;
    }
    console.warn('完整 Git 哈希值格式无效，使用默认值');
    cachedFullGitHash = 'unknown';
  } catch (error) {
    console.warn('无法获取完整 Git 提交哈希值，使用默认值', error);
    cachedFullGitHash = 'unknown';
  }
  return 'unknown';
}

// 获取编译日期
function getBuildDate(): string {
  return dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD');
}

// 获取编译时间（包含日期和时间）
function getBuildTimestamp(): string {
  return dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

// 获取 Git 提交信息
let cachedCommitMessage: string | null = null;
function getCommitMessage(): string {
  if (cachedCommitMessage !== null) {
    return cachedCommitMessage;
  }
  try {
    const message = execSync('git log -1 --pretty=format:%s').toString().trim();
    if (message) {
      cachedCommitMessage = message;
      return message;
    }
    console.warn('Git 提交信息为空，使用默认值');
    cachedCommitMessage = '无提交信息';
  } catch (error) {
    console.warn('无法获取 Git 提交信息，使用默认值', error);
    cachedCommitMessage = '无提交信息';
  }
  return cachedCommitMessage;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
      }),
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ['ep'] })],
      }),
      // Compression plugin for gzip and brotli
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240, // 仅压缩大于 10KB 的文件
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
    ],
    // 构建优化
    build: {
      // 启用代码压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log'] : [],
        },
      },
      // 代码分割以改善缓存
      rollupOptions: {
        output: {
          manualChunks: {
            // 为更好的缓存进行分块
            'vue-vendor': ['vue', 'vue-router'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'utils': ['dayjs', 'axios', 'js-base64', 'jsencrypt'],
          },
          // 使用 hash 命名资源以实现缓存破坏
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash].[ext]';
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash].[ext]';
            } else if (ext === 'css') {
              return 'assets/css/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
        },
      },
      // 生产环境调试的 Source maps（可禁用以减小构建体积）
      sourcemap: false,
      // 分块大小警告限制
      chunkSizeWarningLimit: 1000,
      // 报告压缩后的大小
      reportCompressedSize: true,
    },
    // 定义环境变量
    define: {
      // 在生产环境下，将编译信息注入到环境变量中
      'import.meta.env.VITE_BUILD_DATE':
        mode === 'production' ? JSON.stringify(getBuildDate()) : JSON.stringify('开发环境'),
      'import.meta.env.VITE_BUILD_TIMESTAMP':
        mode === 'production' ? JSON.stringify(getBuildTimestamp()) : JSON.stringify('开发环境'),
      'import.meta.env.VITE_GIT_HASH':
        mode === 'production' ? JSON.stringify(getGitHash()) : JSON.stringify('开发中'),
      'import.meta.env.VITE_GIT_FULL_HASH':
        mode === 'production' ? JSON.stringify(getFullGitHash()) : JSON.stringify('开发中'),
      'import.meta.env.VITE_COMMIT_MESSAGE':
        mode === 'production' ? JSON.stringify(getCommitMessage()) : JSON.stringify('开发环境构建'),
      'import.meta.env.VITE_GITHUB_REPO': JSON.stringify(
        'https://github.com/Dongyifengs/SmartAttendance'
      ),
      // 保留 VITE_TEXT 用于开发环境
      'import.meta.env.VITE_TEXT':
        mode === 'production'
          ? JSON.stringify('')
          : JSON.stringify(process.env.VITE_TEXT || '开发环境'),
    },
    server: {
      port: 25113,
      host: '0.0.0.0',
      open: true,
      // 代理配置，非特殊情况请勿修改
      proxy: {
        '/PairAPI': {
          target: 'https://api.anlaxy.com.cn/SerApi/v02',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/PairAPI/, ''),
        },
        '/MoYiGetIP': {
          target: 'https://whois.pconline.com.cn/ipJson.jsp?ip=&json=true',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/MoYiGetIP/, ''),
        },
      },
    },
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
