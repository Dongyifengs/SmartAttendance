# 样式系统 (Styles System)

这个目录包含了项目的全局样式定义。

## 文件说明

### variables.css - CSS 变量
定义了项目中使用的所有CSS变量，包括颜色、间距、圆角、阴影等。

#### 主题颜色
```css
var(--color-primary)       /* 主色 */
var(--color-success)       /* 成功色 */
var(--color-warning)       /* 警告色 */
var(--color-danger)        /* 危险色 */
```

#### 文本颜色
```css
var(--color-text-primary)    /* 主要文本 */
var(--color-text-secondary)  /* 次要文本 */
var(--color-text-white)      /* 白色文本 */
```

#### 背景颜色
```css
var(--color-bg-body)       /* 页面背景 */
var(--color-bg-white)      /* 白色背景 */
var(--color-bg-gray-light) /* 浅灰背景 */
```

#### 间距系统
```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 12px */
var(--spacing-lg)   /* 16px */
var(--spacing-xl)   /* 20px */
var(--spacing-2xl)  /* 24px */
```

#### 圆角
```css
var(--radius-sm)    /* 6px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-xl)    /* 16px */
```

#### 阴影
```css
var(--shadow-sm)         /* 小阴影 */
var(--shadow-md)         /* 中等阴影 */
var(--shadow-lg)         /* 大阴影 */
var(--shadow-card)       /* 卡片阴影 */
var(--shadow-card-hover) /* 卡片悬浮阴影 */
```

#### 过渡动画
```css
var(--transition-fast)   /* 0.2s ease */
var(--transition-normal) /* 0.3s cubic-bezier */
var(--transition-slow)   /* 0.4s ease-out */
```

### common.css - 通用样式
提供了常用的工具类和动画定义。

#### 动画类
```html
<div class="fade-in">淡入动画</div>
<div class="slide-down">下滑动画</div>
<div class="card-fade-in">卡片淡入</div>
```

#### 布局类
```html
<div class="flex">Flex布局</div>
<div class="flex-center">居中布局</div>
<div class="flex-between">两端对齐</div>
<div class="flex-column">垂直布局</div>
```

#### 间距类
```html
<div class="gap-sm">小间距</div>
<div class="gap-md">中间距</div>
<div class="gap-lg">大间距</div>

<div class="mb-md">下边距</div>
```

#### 文本类
```html
<span class="text-primary">主要文本</span>
<span class="text-secondary">次要文本</span>
<span class="text-center">居中文本</span>
<span class="text-clickable">可点击文本</span>
```

## 使用建议

1. **优先使用CSS变量**: 避免硬编码颜色和尺寸值
   ```css
   /* 推荐 */
   color: var(--color-primary);
   padding: var(--spacing-md);
   
   /* 不推荐 */
   color: #667eea;
   padding: 12px;
   ```

2. **使用工具类**: 对于简单的样式，优先使用工具类
   ```html
   <!-- 推荐 -->
   <div class="flex-between mb-md">
   
   <!-- 不推荐 -->
   <div style="display: flex; justify-content: space-between; margin-bottom: 12px">
   ```

3. **响应式设计**: 使用预定义的断点
   ```css
   @media (max-width: 768px) {
     /* 移动端样式 */
   }
   ```

4. **组件样式**: 组件内部样式应使用 scoped
   ```vue
   <style scoped>
   .my-component {
     color: var(--color-text-primary);
   }
   </style>
   ```

## 主题定制

如需修改主题，只需修改 `variables.css` 中的对应变量值：

```css
:root {
  --color-primary: #your-color;
  --spacing-md: 14px;
}
```

所有使用该变量的组件会自动更新。
