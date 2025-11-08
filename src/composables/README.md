# Composables 组合式函数

本目录包含 SmartAttendance 应用程序的可复用 Vue 3 组合式函数。

## 可用的组合式函数

### useApiCall
统一的 API 调用钩子，具有错误处理功能。简化 try-catch 块并提供一致的错误处理。

**用法：**
```typescript
const { loading, error, execute } = useApiCall();

const result = await execute(
  async () => await someApiCall(),
  {
    errorMessage: '操作失败',
    showSuccessMessage: true,
    successMessage: '操作成功',
  }
);
```

### useUserInfo
用于管理用户信息的组合式函数，带有本地缓存功能。减少冗余的 API 调用和 localStorage 读取。

**特性：**
- 缓存学号、姓名和 IP 地址
- 1 小时后自动刷新缓存
- 提供获取单个用户属性的辅助方法

**用法：**
```typescript
const { loadUserInfo, getCachedUserInfo, getStudentId, getStudentName } = useUserInfo();

// 在页面加载时加载并缓存用户信息
await loadUserInfo();

// 获取缓存信息而不重新获取
const cachedInfo = getCachedUserInfo();
```

### useOneCard
用于一卡通操作的组合式函数。处理钱包余额、账单检索和用户信息。

**特性：**
- 令牌过期时自动登录
- 获取钱包余额
- 账单检索和管理
- 获取用户信息

**用法：**
```typescript
const oneCard = useOneCard();

// 获取钱包余额
await oneCard.fetchWalletBalance(gitHash);

// 获取最近消费记录
await oneCard.fetchRecentConsumption(7);

// 获取账单列表
await oneCard.fetchBillList(7);
```

### usePaymentQR
用于支付二维码管理的组合式函数。处理二维码生成、自动刷新和手动刷新。

**特性：**
- 每 10 秒自动刷新二维码
- 手动刷新功能
- 自动计时器管理

**用法：**
```typescript
const paymentQR = usePaymentQR();

// 初始化并获取二维码
await paymentQR.initialize();

// 手动刷新
await paymentQR.manualRefresh();

// 对话框可见性控制自动刷新
paymentQR.showDialog.value = true;
```

### useAirConditioning
用于空调管理的组合式函数。处理楼栋/房间选择和余额查询。

**特性：**
- 获取楼栋和房间列表
- 余额查询
- 设置持久化存储到 localStorage

**用法：**
```typescript
const airConditioning = useAirConditioning();

// 初始化
await airConditioning.initialize();

// 处理楼栋变更
await airConditioning.onBuildingChange(buildingId);

// 保存设置
airConditioning.saveSettings();
```

### useAttendance
用于签到签退操作的组合式函数。处理课程签到、签退和记录查询，并自动记录操作日志。

**特性：**
- 课程签到/签退操作
- 获取签到记录列表
- 获取课程列表
- 自动记录操作日志到 MOYI API

**用法：**
```typescript
const attendance = useAttendance();

// 执行签到
await attendance.signIn(signInParams, gitHash);

// 执行签退
await attendance.signOut(signOutParams, gitHash);

// 获取签到记录
const signList = await attendance.getDaySignList({ date, userKey }, gitHash);

// 获取课程列表
const courseList = await attendance.getDayCourseList({ date, userKey }, gitHash);
```

## 优势

1. **代码可复用性**：逻辑可以在组件之间共享
2. **关注点分离**：业务逻辑与 UI 逻辑分离
3. **可测试性**：组合式函数可以独立测试
4. **类型安全**：完整的 TypeScript 支持和适当的类型定义
5. **性能**：内置缓存和优化
6. **可维护性**：更容易更新和维护隔离的逻辑
7. **操作日志**：自动记录关键操作到 MOYI API

## 最佳实践

1. 始终在 `setup()` 函数或 `<script setup>` 中使用组合式函数
2. 利用 TypeScript 实现类型安全
3. 在适当的地方使用 `useApiCall` 优雅地处理错误
4. 尽可能缓存数据以减少不必要的 API 调用
5. 在 `onUnmounted` 钩子中清理计时器和订阅
6. 为关键操作传递 gitHash 参数以启用日志记录
