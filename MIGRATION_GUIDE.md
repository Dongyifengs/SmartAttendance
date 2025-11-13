# 代码迁移指南 (Migration Guide)

本指南帮助开发者将现有代码迁移到新的项目结构。

## 概述

项目进行了以下优化：
- ✅ 添加了统一的工具函数库
- ✅ 建立了 CSS 变量系统
- ✅ 创建了新的组合式函数
- ✅ 统一了代码规范

## 迁移步骤

### 1. localStorage 操作迁移

#### 之前 (Old)
```typescript
// 读取数据
const userInfo = localStorage.getItem('SA-ZHKQ-USERINFO');
if (userInfo) {
  try {
    const parsed = JSON.parse(userInfo);
    // 使用 parsed
  } catch (error) {
    console.error(error);
  }
}

// 写入数据
localStorage.setItem('SA-ZHKQ-USERINFO', JSON.stringify(data));

// 删除数据
localStorage.removeItem('SA-ZHKQ-USERINFO');
```

#### 之后 (New) ⭐
```typescript
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

// 读取数据（自动处理 JSON 解析和错误）
const userInfo = getStorageItem<UserInfo>(STORAGE_KEYS.ZHKQ_USERINFO);

// 写入数据（自动处理 JSON 序列化）
setStorageItem(STORAGE_KEYS.ZHKQ_USERINFO, data);

// 删除数据
removeStorageItem(STORAGE_KEYS.ZHKQ_USERINFO);
```

**优势**: 
- ✅ 类型安全
- ✅ 自动错误处理
- ✅ 使用常量避免拼写错误

### 2. 错误处理迁移

#### 之前 (Old)
```typescript
import { ElMessage } from 'element-plus';

try {
  await someApiCall();
  ElMessage.success('操作成功');
} catch (error) {
  console.error(error);
  ElMessage.error('操作失败');
}
```

#### 之后 (New) ⭐
```typescript
import { showSuccess, handleApiError } from '@/utils/errorHandler';

try {
  await someApiCall();
  showSuccess('操作成功');
} catch (error) {
  handleApiError(error, '操作失败');
}
```

**优势**:
- ✅ 统一的错误处理逻辑
- ✅ 自动识别错误类型
- ✅ 更友好的错误提示

### 3. 日期时间操作迁移

#### 之前 (Old)
```typescript
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');
const tomorrow = dayjs().add(1, 'day');
const diff = dayjs(date1).diff(dayjs(date2), 'minute');
```

#### 之后 (New) ⭐
```typescript
import { getCurrentDate, addDays, getMinutesDiff } from '@/utils/dateTime';

const today = getCurrentDate(); // 'YYYY-MM-DD'
const tomorrow = addDays(new Date(), 1);
const diff = getMinutesDiff(date1, date2);
```

**优势**:
- ✅ 更语义化的函数名
- ✅ 统一的日期格式
- ✅ 减少重复代码

### 4. CSS 样式迁移

#### 之前 (Old)
```vue
<style scoped>
.my-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.my-text {
  color: #1d1d1f;
  font-size: 14px;
}
</style>
```

#### 之后 (New) ⭐
```vue
<style scoped>
.my-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
}

.my-text {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}
</style>
```

**优势**:
- ✅ 主题一致性
- ✅ 易于维护和修改
- ✅ 支持主题切换

### 5. 路由路径迁移

#### 之前 (Old)
```typescript
router.push('/');
router.push('/home');
router.push('/dev/home');
```

#### 之后 (New) ⭐
```typescript
import { ROUTE_PATHS } from '@/utils/constants';

router.push(ROUTE_PATHS.LOGIN);
router.push(ROUTE_PATHS.HOME);
router.push(ROUTE_PATHS.DEV_HOME);
```

**优势**:
- ✅ 避免路径拼写错误
- ✅ 便于路径修改
- ✅ 更好的代码提示

### 6. 加载状态管理迁移

#### 之前 (Old)
```typescript
const loading = ref(false);

async function fetchData() {
  loading.value = true;
  try {
    const data = await api.getData();
    // 处理数据
  } finally {
    loading.value = false;
  }
}
```

#### 之后 (New) ⭐
```typescript
import { useLoading } from '@/composables';

const { loading, withLoading } = useLoading();

async function fetchData() {
  await withLoading(async () => {
    const data = await api.getData();
    // 处理数据
  });
}
```

**优势**:
- ✅ 自动管理加载状态
- ✅ 代码更简洁
- ✅ 不会忘记重置状态

### 7. 时间常量迁移

#### 之前 (Old)
```typescript
const FOUR_HOURS = 4 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

setTimeout(() => {}, 3000);
```

#### 之后 (New) ⭐
```typescript
import { TIME_CONSTANTS, UI_CONSTANTS } from '@/utils/constants';

const FOUR_HOURS = TIME_CONSTANTS.FOUR_HOURS;
const ONE_DAY = TIME_CONSTANTS.ONE_DAY;

setTimeout(() => {}, UI_CONSTANTS.TOAST_DURATION);
```

**优势**:
- ✅ 统一的时间常量
- ✅ 避免魔法数字
- ✅ 易于维护

## 常见问题

### Q1: 我必须立即迁移所有代码吗？

A: 不需要。新旧代码可以共存。建议在修改现有代码或添加新功能时逐步迁移。

### Q2: CSS 变量会影响性能吗？

A: CSS 变量的性能影响微乎其微，但带来的维护性提升是巨大的。

### Q3: 如何处理类型定义？

A: 使用 TypeScript 的类型推导。大多数工具函数都提供了完整的类型定义。

### Q4: 可以自定义工具函数吗？

A: 可以！在 `src/utils/` 中添加新的工具函数，并在 `index.ts` 中导出。

### Q5: 如何添加新的 CSS 变量？

A: 在 `src/styles/variables.css` 中添加新变量：
```css
:root {
  --my-new-color: #your-color;
}
```

## 迁移检查清单

### Phase 1: 基础设施（已完成）
- [x] 创建工具函数库
- [x] 创建 CSS 变量系统
- [x] 创建新的组合式函数
- [x] 添加文档

### Phase 2: 逐步迁移（建议）
- [ ] 迁移 localStorage 操作到新的 storage 工具
- [ ] 更新错误处理使用新的 errorHandler
- [ ] 更新 CSS 使用变量而非硬编码值
- [ ] 更新路由使用常量
- [ ] 使用 useLoading 管理加载状态

### Phase 3: 优化（可选）
- [ ] 提取可复用组件
- [ ] 添加单元测试
- [ ] 优化性能
- [ ] 添加更多工具函数

## 迁移建议

1. **渐进式迁移**: 不要一次性修改所有代码
2. **测试驱动**: 迁移后进行充分测试
3. **文档先行**: 先阅读相关文档
4. **团队协作**: 与团队成员沟通迁移计划
5. **保持一致**: 新代码使用新规范

## 获取帮助

- 查看各模块的 README 文档
- 参考现有的迁移示例
- 查看 `PROJECT_STRUCTURE.md` 了解项目结构

## 示例对比

### 完整示例：登录页面片段

#### 之前
```typescript
// 检查登录状态
const zhkqTimestamp = Number(localStorage.getItem('SA-ZHKQ-TIMESTAMP') || '0');
const FOUR_HOURS = 4 * 60 * 60 * 1000;
if (new Date().getTime() - zhkqTimestamp > FOUR_HOURS) {
  // 重新登录
}

// 保存登录信息
localStorage.setItem('SA-ZHKQ-TIMESTAMP', new Date().getTime().toString());
localStorage.setItem('SA-ZHKQ-USERINFO', JSON.stringify(userInfo));
```

#### 之后
```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS, getTimestamp, isTimestampExpired } from '@/utils';

// 检查登录状态
const zhkqTimestamp = getStorageItem<number>(STORAGE_KEYS.ZHKQ_TIMESTAMP) || 0;
if (isTimestampExpired(zhkqTimestamp, 4)) {
  // 重新登录
}

// 保存登录信息
setStorageItem(STORAGE_KEYS.ZHKQ_TIMESTAMP, getTimestamp());
setStorageItem(STORAGE_KEYS.ZHKQ_USERINFO, userInfo);
```

**改进点**:
- ✅ 代码行数减少
- ✅ 更易读易懂
- ✅ 类型安全
- ✅ 统一的工具函数

## 总结

新的项目结构带来以下好处：

1. **更好的代码组织**: 清晰的模块划分
2. **更高的代码复用**: 统一的工具函数和组合式函数
3. **更好的类型安全**: 完整的 TypeScript 支持
4. **更易维护**: 统一的规范和文档
5. **更好的用户体验**: 统一的错误处理和加载状态

开始迁移吧！🚀
