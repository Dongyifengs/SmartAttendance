import { ref, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

const LONG_PRESS_DELAY = 800; // 长按触发延迟（毫秒）
const LONG_PRESS_DEBOUNCE_DELAY = 100; // 长按防抖延迟（毫秒）

/**
 * 长按功能的Composable
 */
export function useLongPress() {
  const longPressTimer = ref<number | null>(null);
  const isLongPressing = ref(false);

  // Git相关信息
  const buildTimestamp = ref(import.meta.env.VITE_BUILD_TIMESTAMP || '开发环境');
  const gitHash = ref(import.meta.env.VITE_GIT_HASH || '开发中');
  const gitFullHash = ref(import.meta.env.VITE_GIT_FULL_HASH || '开发中');
  const commitMessage = ref(import.meta.env.VITE_COMMIT_MESSAGE || '开发环境构建');
  const githubRepo = ref(
    import.meta.env.VITE_GITHUB_REPO || 'https://github.com/Dongyifengs/SmartAttendance'
  );

  /**
   * 获取commit URL
   */
  function getCommitUrl(): string {
    if (gitFullHash.value && gitFullHash.value !== '开发中') {
      return `${githubRepo.value}/commit/${gitFullHash.value}`;
    }
    return '#';
  }

  /**
   * 处理长按开始
   */
  function handleLongPressStart(): void {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
    isLongPressing.value = false;
    longPressTimer.value = window.setTimeout(() => {
      isLongPressing.value = true;
      ElMessage({
        message: `提交记录: ${commitMessage.value}`,
        type: 'info',
        duration: 5000,
        showClose: true,
      });
    }, LONG_PRESS_DELAY);
  }

  /**
   * 处理长按结束
   */
  function handleLongPressEnd(): void {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
    setTimeout(() => {
      isLongPressing.value = false;
    }, LONG_PRESS_DEBOUNCE_DELAY);
  }

  /**
   * 处理Hash点击
   */
  function handleHashClick(): void {
    const url = getCommitUrl();
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  }

  // 清理定时器
  onUnmounted(() => {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
  });

  return {
    buildTimestamp,
    gitHash,
    handleLongPressStart,
    handleLongPressEnd,
    handleHashClick,
  };
}
