# Deployment Guide - 部署指南

## 🚀 Production Deployment Checklist

### 1. Build Optimization ✅
The project is configured with the following optimizations:
- Code splitting (vendor, element-plus, utils chunks)
- Minification (Terser with console.log removal)
- Tree shaking (unused code removal)
- Asset optimization (compressed and cached)

### 2. Security Requirements ⚠️

#### HTTPS is REQUIRED for Production
All production deployments **MUST** use HTTPS. This is critical for:
- Secure data transmission
- Modern web features (service workers, geolocation, etc.)
- SEO ranking
- User trust

**DO NOT deploy to production without HTTPS!**

### 3. Server Configuration

#### Option A: Netlify / Vercel (Recommended)
✅ The `public/_headers` file is automatically applied
- Contains all necessary security headers
- Configures cache control for optimal performance
- No additional configuration needed

**Deploy Steps:**
```bash
npm run build
# Upload dist/ folder or connect Git repository
```

#### Option B: Nginx

Add this configuration to your nginx server block:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration (required)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /path/to/dist;
    index index.html;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.etslink.net https://rollcall.anlaxy.com.cn https://api.anlaxy.com.cn https://whois.pconline.com.cn; frame-ancestors 'self'" always;
    add_header Cross-Origin-Opener-Policy "same-origin-allow-popups" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache control for HTML
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Cache control for static assets (1 year)
    location ~* ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    # Cache control for images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
    
    # Cache control for fonts
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### Option C: Apache

Add to your `.htaccess` file:

```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header always set Cross-Origin-Opener-Policy "same-origin-allow-popups"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.etslink.net https://rollcall.anlaxy.com.cn https://api.anlaxy.com.cn https://whois.pconline.com.cn; frame-ancestors 'self'"

# Compression
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

# Cache Control - HTML files
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</FilesMatch>

# Cache Control - Assets (1 year)
<FilesMatch "\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Cache Control - Images (30 days)
<FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|webp)$">
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# Cache Control - Fonts (1 year)
<FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# SPA routing - redirect all to index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### 4. Performance Optimizations Applied

#### ✅ Code Splitting
- Vue + Vue Router in separate chunk
- Element Plus in separate chunk
- Utility libraries in separate chunk
- Better browser caching

#### ✅ Minification
- Terser minification enabled
- Console.log statements removed in production
- CSS minification enabled

#### ✅ Cache Control
- HTML: No cache (always fresh)
- JS/CSS: 1 year cache with immutable flag
- Images: 30 days cache
- Fonts: 1 year cache

#### ✅ Compression
- Gzip enabled for text assets
- Recommended: Enable Brotli for even better compression

#### ✅ Resource Hints
- Preconnect to external API domains
- DNS prefetch for faster connections

### 5. Lighthouse Improvements

These optimizations address the following Lighthouse issues:

| Issue | Solution | Expected Improvement |
|-------|----------|---------------------|
| Cache lifetime | Cache-Control headers | +246 KiB saved |
| HTTP/2 | Server configuration (nginx/apache) | +740ms saved |
| Unused JS | Code splitting + tree shaking | +131 KiB saved |
| Minification | Terser configuration | +110 KiB saved |
| Render blocking | Resource hints + async loading | +150ms saved |
| Meta description | Added to index.html | SEO 90→100 |
| Security headers | _headers file / server config | Best Practices 79→95+ |

### 6. Testing Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test built application with `npm run preview`
- [ ] Verify HTTPS is enabled on production server
- [ ] Test all security headers are present (use securityheaders.com)
- [ ] Run Lighthouse audit on production URL
- [ ] Verify cache headers are working (check browser DevTools)
- [ ] Test all routes work correctly (SPA routing)
- [ ] Verify API connections work over HTTPS

### 7. Environment Variables

For production, make sure to set:

```bash
NODE_ENV=production
```

### 8. Monitoring

After deployment, monitor:
- Performance metrics (Lighthouse scores)
- Error rates (check browser console)
- API response times
- Cache hit rates

### 9. Rollback Plan

Keep previous build artifacts:
```bash
npm run build
mv dist dist-$(date +%Y%m%d-%H%M%S)
```

### 10. Support

For issues:
1. Check browser console for errors
2. Verify HTTPS is properly configured
3. Test security headers: https://securityheaders.com
4. Test performance: PageSpeed Insights or Lighthouse

---

## 📊 Expected Lighthouse Scores

After implementing all optimizations:

- **Performance**: 90+ (from 78)
- **Accessibility**: 94+ (already good)
- **Best Practices**: 95+ (from 79)
- **SEO**: 100 (from 90)

## 🔒 Security Notes

1. **HTTPS is mandatory** - Do not skip this
2. Update CSP if adding new external domains
3. Review security headers quarterly
4. Keep dependencies updated
5. Monitor security advisories

## 📝 Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

---

**Last Updated**: 2025-11-13  
**Version**: beta-0.0.1
