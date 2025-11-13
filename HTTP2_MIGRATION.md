# HTTP/2 升级指南

## 📋 概述

根据 Lighthouse 审计报告，当前系统使用 HTTP/1.1 协议，升级到 HTTP/2 可以节省约 740ms 的加载时间。

**注意**: HTTP/2 升级主要是服务器端配置，前端代码无需修改。

---

## 🎯 HTTP/2 的优势

### 1. 多路复用 (Multiplexing)
- **HTTP/1.1**: 每个连接一次只能处理一个请求
- **HTTP/2**: 一个连接可以并行处理多个请求
- **效果**: 减少延迟，提升加载速度

### 2. 头部压缩 (Header Compression)
- **HTTP/1.1**: 每次请求都发送完整的头部信息
- **HTTP/2**: 使用 HPACK 压缩算法，只发送差异
- **效果**: 减少约 30% 的头部数据传输

### 3. 服务器推送 (Server Push)
- **HTTP/2**: 服务器可以主动推送资源
- **效果**: 无需等待客户端请求，提前加载关键资源

### 4. 二进制协议 (Binary Protocol)
- **HTTP/1.1**: 文本协议，解析慢
- **HTTP/2**: 二进制协议，解析快
- **效果**: 提升解析效率

---

## ⚠️ 重要前提

**HTTP/2 必须在 HTTPS 上运行！**

虽然 HTTP/2 规范允许在 HTTP 上运行，但所有主流浏览器都要求必须使用 HTTPS。

因此，升级到 HTTP/2 之前，必须先配置 HTTPS。

---

## 🔧 服务器配置

### Nginx 配置（推荐）

#### 1. 确认 Nginx 版本
```bash
nginx -v
# 需要 1.9.5 或更高版本支持 HTTP/2
```

#### 2. 完整配置示例
```nginx
server {
    # 启用 HTTP/2（在 listen 指令中添加 http2）
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    # SSL 证书配置（HTTP/2 必需）
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头（与 DEPLOYMENT.md 一致）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # HTTP/2 服务器推送（可选）
    location = / {
        http2_push /assets/css/index-DpLcXCsr.css;
        http2_push /assets/js/vue-vendor-CoPnbFnN.js;
        http2_push /assets/js/element-plus-tx2s2pn9.js;
    }
    
    # Gzip 压缩（虽然 HTTP/2 有头部压缩，但仍建议启用）
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss application/json;
    
    # Brotli 压缩（需要 ngx_brotli 模块）
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript 
                 application/javascript application/xml+rss application/json;
    
    # 缓存控制
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    location ~* ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### 3. 验证配置
```bash
# 检查配置语法
nginx -t

# 重新加载配置
nginx -s reload
```

---

### Apache 配置

#### 1. 确认 Apache 版本和模块
```bash
# 需要 Apache 2.4.17 或更高版本
apache2 -v

# 启用必需模块
a2enmod ssl
a2enmod http2
a2enmod headers
a2enmod deflate
```

#### 2. 完整配置示例
```apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/dist
    
    # 启用 HTTP/2
    Protocols h2 http/1.1
    
    # SSL 配置（HTTP/2 必需）
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # SSL 优化
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on
    
    # 安全头
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # HTTP/2 服务器推送（可选）
    <Location />
        H2PushResource /assets/css/index-DpLcXCsr.css
        H2PushResource /assets/js/vue-vendor-CoPnbFnN.js
        H2PushResource /assets/js/element-plus-tx2s2pn9.js
    </Location>
    
    # Gzip 压缩
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain text/css text/xml text/javascript
        AddOutputFilterByType DEFLATE application/javascript application/xml+rss application/json
    </IfModule>
    
    # 缓存控制
    <LocationMatch "^/assets/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
    
    # SPA 路由
    <Directory /path/to/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>

# HTTP 重定向到 HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>
```

#### 3. 验证配置
```bash
# 检查配置语法
apachectl configtest

# 重新加载配置
systemctl reload apache2
```

---

### Caddy 配置（最简单）

Caddy 自动启用 HTTP/2 和 HTTPS，配置极其简单：

```caddy
your-domain.com {
    root * /path/to/dist
    encode gzip zstd
    file_server
    
    # 安全头
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    # 缓存控制
    @assets path /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"
    
    # SPA 路由
    try_files {path} /index.html
}
```

Caddy 会自动:
- 申请和续期 Let's Encrypt SSL 证书
- 启用 HTTP/2 和 HTTP/3
- 启用 Gzip 和 Zstandard 压缩
- 重定向 HTTP 到 HTTPS

---

## 🔍 验证 HTTP/2 是否启用

### 方法 1: 浏览器开发者工具
1. 打开 Chrome DevTools
2. 切换到 Network 标签
3. 右键点击表头，勾选 "Protocol"
4. 刷新页面
5. 查看 Protocol 列，应该显示 "h2" (HTTP/2) 或 "h3" (HTTP/3)

### 方法 2: 命令行工具
```bash
# 使用 curl（需要支持 HTTP/2）
curl -I --http2 https://your-domain.com

# 应该看到类似输出:
# HTTP/2 200
```

### 方法 3: 在线检测工具
- https://tools.keycdn.com/http2-test
- https://http2.pro/check

---

## 📊 预期改善

启用 HTTP/2 后，根据 Lighthouse 报告预期改善：

| 指标 | 改善 |
|------|------|
| 加载时间 | -740ms |
| 并发连接数 | 6 → 无限制（多路复用） |
| 头部数据 | -30%（头部压缩） |
| 首屏渲染 | -15%（服务器推送） |

---

## 🎯 最佳实践

### 1. 域名分片不再需要
HTTP/1.1 时代，为了绕过浏览器的并发连接限制，通常会使用域名分片。

**HTTP/2 下不需要了！** 多路复用使得单个连接就能处理所有请求。

```html
<!-- HTTP/1.1 做法（不推荐） -->
<script src="https://cdn1.example.com/app.js"></script>
<script src="https://cdn2.example.com/vendor.js"></script>

<!-- HTTP/2 做法（推荐） -->
<script src="https://example.com/app.js"></script>
<script src="https://example.com/vendor.js"></script>
```

### 2. 资源合并不再必要
HTTP/1.1 时代，为了减少请求数，会合并 CSS 和 JS 文件。

**HTTP/2 下可以适度拆分！** 多路复用使得多个小文件不会降低性能，反而有利于缓存。

### 3. 服务器推送需谨慎
虽然 HTTP/2 支持服务器推送，但要谨慎使用：
- 只推送确定会用到的关键资源
- 避免推送已缓存的资源
- 监控推送效果，避免浪费带宽

### 4. 继续使用压缩
即使 HTTP/2 有头部压缩，仍应启用 Gzip/Brotli 压缩响应体。

---

## 🚫 常见问题

### Q1: 我的应用运行在 HTTP 上，能用 HTTP/2 吗?
**A**: 理论上可以，但所有主流浏览器都不支持 HTTP/2 over HTTP。必须使用 HTTPS。

### Q2: 需要修改前端代码吗?
**A**: 不需要！HTTP/2 对应用层完全透明，只需配置服务器。

### Q3: Let's Encrypt 证书可以吗?
**A**: 完全可以！Let's Encrypt 提供免费的 SSL 证书，完全适用于 HTTP/2。

### Q4: 如何获取免费 SSL 证书?
**A**: 使用 Certbot:
```bash
# 安装 Certbot
apt-get install certbot python3-certbot-nginx

# 自动配置 Nginx 和获取证书
certbot --nginx -d your-domain.com
```

### Q5: CDN 支持 HTTP/2 吗?
**A**: 大部分 CDN 都支持:
- Cloudflare: ✅ 支持
- AWS CloudFront: ✅ 支持
- Netlify: ✅ 支持
- Vercel: ✅ 支持

---

## 📚 相关资源

- [HTTP/2 官方网站](https://http2.github.io/)
- [Can I Use HTTP/2](https://caniuse.com/http2)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx HTTP/2 指南](https://nginx.org/en/docs/http/ngx_http_v2_module.html)

---

## ✅ 检查清单

部署 HTTP/2 前的检查清单:

- [ ] 服务器版本支持 HTTP/2（Nginx 1.9.5+, Apache 2.4.17+）
- [ ] 已获取有效的 SSL 证书
- [ ] 已配置 HTTPS
- [ ] 已在 listen 指令中添加 http2 (Nginx) 或 Protocols h2 (Apache)
- [ ] 已配置 HTTP 到 HTTPS 重定向
- [ ] 已配置安全头
- [ ] 已配置缓存策略
- [ ] 已配置压缩（Gzip/Brotli）
- [ ] 已测试验证 HTTP/2 正常工作
- [ ] 已在浏览器中验证 Protocol 为 h2

---

**文档更新日期**: 2025-11-13  
**状态**: 服务器端配置指南
