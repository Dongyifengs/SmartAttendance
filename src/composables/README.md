# Composables

This directory contains reusable Vue 3 composables for the SmartAttendance application.

## Available Composables

### useApiCall
Unified API call hook with error handling. Simplifies try-catch blocks and provides consistent error handling.

**Usage:**
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
Composable for managing user info with local caching. Reduces redundant API calls and localStorage reads.

**Features:**
- Caches student ID, name, and IP address
- Automatically refreshes cache after 1 hour
- Provides helper methods for getting individual user properties

**Usage:**
```typescript
const { loadUserInfo, getCachedUserInfo, getStudentId, getStudentName } = useUserInfo();

// Load and cache user info on page load
await loadUserInfo();

// Get cached info without re-fetching
const cachedInfo = getCachedUserInfo();
```

### useOneCard
Composable for One Card (一卡通) operations. Handles wallet balance, bill retrieval, and user info.

**Features:**
- Auto-login when token expires
- Wallet balance fetching
- Bill retrieval and management
- User information fetching

**Usage:**
```typescript
const oneCard = useOneCard();

// Fetch wallet balance
await oneCard.fetchWalletBalance(gitHash);

// Fetch recent consumption
await oneCard.fetchRecentConsumption(7);

// Fetch bill list
await oneCard.fetchBillList(7);
```

### usePaymentQR
Composable for payment QR code management. Handles QR code generation, auto-refresh, and manual refresh.

**Features:**
- Auto-refresh QR code every 10 seconds
- Manual refresh capability
- Automatic timer management

**Usage:**
```typescript
const paymentQR = usePaymentQR();

// Initialize and fetch QR code
await paymentQR.initialize();

// Manual refresh
await paymentQR.manualRefresh();

// Dialog visibility controls auto-refresh
paymentQR.showDialog.value = true;
```

### useAirConditioning
Composable for air conditioning management. Handles building/room selection and balance queries.

**Features:**
- Building and room list fetching
- Balance querying
- Settings persistence in localStorage

**Usage:**
```typescript
const airConditioning = useAirConditioning();

// Initialize
await airConditioning.initialize();

// Handle building change
await airConditioning.onBuildingChange(buildingId);

// Save settings
airConditioning.saveSettings();
```

## Benefits

1. **Code Reusability**: Logic can be shared across components
2. **Separation of Concerns**: Business logic separated from UI logic
3. **Testability**: Composables can be tested independently
4. **Type Safety**: Full TypeScript support with proper type definitions
5. **Performance**: Built-in caching and optimization
6. **Maintainability**: Easier to update and maintain isolated logic

## Best Practices

1. Always use composables in the `setup()` function or `<script setup>`
2. Leverage TypeScript for type safety
3. Handle errors gracefully using `useApiCall` where appropriate
4. Cache data when possible to reduce unnecessary API calls
5. Clean up timers and subscriptions in `onUnmounted` hook
