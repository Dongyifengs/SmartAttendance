# 工具函数库 (Utilities Library)

这个目录包含了项目中使用的通用工具函数。

## 文件说明

### storage.ts - 本地存储工具
统一管理localStorage操作，提供类型安全的存储接口。

```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

// 获取数据
const userInfo = getStorageItem<UserInfo>(STORAGE_KEYS.ZHKQ_USERINFO);

// 设置数据
setStorageItem(STORAGE_KEYS.ZHKQ_USERINFO, userData);

// 检查时间戳是否过期
const isExpired = isTimestampExpired(timestamp, 4); // 4小时
```

### constants.ts - 应用常量
定义了应用中使用的所有常量，包括时间、路由、验证规则等。

```typescript
import { TIME_CONSTANTS, ROUTE_PATHS } from '@/utils/constants';

// 使用时间常量
setTimeout(() => {}, TIME_CONSTANTS.ONE_HOUR);

// 使用路由路径
router.push(ROUTE_PATHS.LOGIN);
```

### errorHandler.ts - 错误处理
提供统一的错误处理和消息显示功能。

```typescript
import { showError, showSuccess, handleApiError } from '@/utils/errorHandler';

// 显示错误消息
showError('操作失败');

// 显示成功消息
showSuccess('操作成功');

// 处理API错误
try {
  await api.call();
} catch (error) {
  handleApiError(error, '自定义错误消息');
}
```

### dateTime.ts - 日期时间工具
提供常用的日期时间操作函数。

```typescript
import { formatDate, getCurrentDate, addDays } from '@/utils/dateTime';

// 格式化日期
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// 获取当前日期
const today = getCurrentDate();

// 日期计算
const tomorrow = addDays(new Date(), 1);
```

## 使用建议

1. **导入方式**: 推荐从 `@/utils` 统一导入
   ```typescript
   import { getStorageItem, showError, formatDate } from '@/utils';
   ```

2. **类型安全**: 所有工具函数都提供了完整的TypeScript类型定义

3. **错误处理**: API调用应统一使用 `handleApiError` 处理错误

4. **存储键**: 始终使用 `STORAGE_KEYS` 中定义的常量，避免硬编码

5. **时间操作**: 优先使用工具函数而非直接操作Date对象
