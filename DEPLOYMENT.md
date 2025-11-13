# 部署指南

## 🚀 生产环境部署清单

### 1. 构建优化 ✅
项目已配置以下优化：
- 代码分割（vendor、element-plus、utils 分块）
- 代码压缩（Terser 压缩并移除 console.log）
- Tree Shaking（移除未使用代码）
- 资源优化（压缩和缓存）

### 2. 安全要求 ⚠️

#### 生产环境必须使用 HTTPS
所有生产环境部署**必须**使用 HTTPS。这对以下方面至关重要：
- 安全的数据传输
- 现代 Web 功能（Service Workers、地理定位等）
- SEO 排名
- 用户信任

**未启用 HTTPS 请勿部署到生产环境！**

### 3. 服务器配置

#### 方案 A: Netlify / Vercel（推荐）
✅ `public/_headers` 文件会自动应用
- 包含所有必要的安全头
- 配置缓存控制以获得最佳性能
- 无需额外配置

**部署步骤：**
```bash
npm run build
# 上传 dist/ 文件夹或连接 Git 仓库
```

#### 方案 B: Nginx

将以下配置添加到 nginx 服务器块：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 配置（必需）
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /path/to/dist;
    index index.html;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.etslink.net https://rollcall.anlaxy.com.cn https://api.anlaxy.com.cn https://whois.pconline.com.cn; frame-ancestors 'self'" always;
    add_header Cross-Origin-Opener-Policy "same-origin-allow-popups" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # HTML 缓存控制
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # 静态资源缓存控制（1年）
    location ~* ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    # 图片缓存控制
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
    
    # 字体缓存控制
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### 方案 C: Apache

添加到 `.htaccess` 文件：

```apache
# 启用 HTTPS 重定向
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 安全头
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header always set Cross-Origin-Opener-Policy "same-origin-allow-popups"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# 内容安全策略
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.etslink.net https://rollcall.anlaxy.com.cn https://api.anlaxy.com.cn https://whois.pconline.com.cn; frame-ancestors 'self'"

# 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# 缓存控制 - HTML 文件
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</FilesMatch>

# 缓存控制 - 资源文件（1年）
<FilesMatch "\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# 缓存控制 - 图片（30天）
<FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|webp)$">
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# 缓存控制 - 字体（1年）
<FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# SPA 路由 - 重定向所有请求到 index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### 4. 已应用的性能优化

#### ✅ 代码分割
- Vue + Vue Router 在独立分块中
- Element Plus 在独立分块中
- 工具库在独立分块中
- 更好的浏览器缓存

#### ✅ 代码压缩
- 启用 Terser 压缩
- 生产环境移除 Console.log 语句
- 启用 CSS 压缩

#### ✅ 缓存控制
- HTML: 不缓存（始终获取最新）
- JS/CSS: 1年缓存，带 immutable 标记
- 图片: 30天缓存
- 字体: 1年缓存

#### ✅ 压缩
- 为文本资源启用 Gzip
- 推荐: 启用 Brotli 以获得更好的压缩效果

#### ✅ 资源提示
- 预连接到外部 API 域名
- DNS 预取以加快连接速度

### 5. Lighthouse 改进

这些优化解决了以下 Lighthouse 问题：

| 问题 | 解决方案 | 预期改进 |
|------|---------|---------|
| 缓存生命周期 | Cache-Control 头 | 节省 246 KiB |
| HTTP/2 | 服务器配置（nginx/apache） | 节省 740ms |
| 未使用的 JS | 代码分割 + tree shaking | 节省 131 KiB |
| 代码压缩 | Terser 配置 | 节省 110 KiB |
| 渲染阻塞 | 资源提示 + 异步加载 | 节省 150ms |
| Meta 描述 | 添加到 index.html | SEO 90→100 |
| 安全头 | _headers 文件 / 服务器配置 | 最佳实践 79→95+ |

### 6. 测试清单

部署到生产环境前：

- [ ] 成功运行 `npm run build`
- [ ] 使用 `npm run preview` 测试构建的应用
- [ ] 验证生产服务器已启用 HTTPS
- [ ] 测试所有安全头是否存在（使用 securityheaders.com）
- [ ] 在生产 URL 上运行 Lighthouse 审计
- [ ] 验证缓存头是否正常工作（检查浏览器 DevTools）
- [ ] 测试所有路由是否正常工作（SPA 路由）
- [ ] 验证 API 连接是否通过 HTTPS 正常工作

### 7. 环境变量

生产环境请确保设置：

```bash
NODE_ENV=production
```

### 8. 监控

部署后，监控：
- 性能指标（Lighthouse 分数）
- 错误率（检查浏览器控制台）
- API 响应时间
- 缓存命中率

### 9. 回滚计划

保留之前的构建产物：
```bash
npm run build
mv dist dist-$(date +%Y%m%d-%H%M%S)
```

### 10. 支持

遇到问题时：
1. 检查浏览器控制台是否有错误
2. 验证 HTTPS 是否正确配置
3. 测试安全头: https://securityheaders.com
4. 测试性能: PageSpeed Insights 或 Lighthouse

---

## 📊 预期 Lighthouse 分数

实施所有优化后：

- **性能 Performance**: 90+ (从 78)
- **无障碍 Accessibility**: 94+ (已经很好)
- **最佳实践 Best Practices**: 95+ (从 79)
- **SEO**: 100 (从 90)

## 🔒 安全说明

1. **HTTPS 是强制性的** - 不要跳过这一步
2. 如果添加新的外部域名，请更新 CSP
3. 每季度审查安全头
4. 保持依赖项更新
5. 监控安全公告

## 📝 其他资源

- [Web.dev 性能](https://web.dev/performance/)
- [MDN 安全头](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)
- [Lighthouse 文档](https://developer.chrome.com/docs/lighthouse/)

---

**最后更新**: 2025-11-13  
**版本**: beta-0.0.1
