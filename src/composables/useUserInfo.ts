import { ref } from 'vue';
import axios from 'axios';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

interface CachedUserInfo {
  studentId: string;
  studentName: string;
  userIp: string;
  timestamp: number;
}

const CACHE_KEY = 'SA-CACHED-USER-INFO';
const CACHE_DURATION = 1000 * 60 * 60; // 1 小时

/**
 * 用于管理用户信息的组合式函数，带有本地缓存功能
 * 减少冗余的 API 调用和 localStorage 读取
 */
export function useUserInfo() {
  const cachedInfo = ref<CachedUserInfo | null>(null);

  /**
   * 从 localStorage 获取学号
   */
  function getStudentId(): string | null {
    const userInfo = getStorageItem<any>(STORAGE_KEYS.ZHKQ_USERINFO);
    return userInfo?.user_code || null;
  }

  /**
   * 从 localStorage 获取学生姓名
   */
  function getStudentName(): string | null {
    const userInfo = getStorageItem<any>(STORAGE_KEYS.ZHKQ_USERINFO);
    return userInfo?.user_name || null;
  }

  /**
   * 获取用户 IP 地址
   */
  async function getUserIp(): Promise<string> {
    try {
      const response = await axios.get('https://myip.ipip.net/json');
      const data = response.data;
      console.log('[getUserIp] 获取到的IP数据:', data);
      return (
        data.data.ip +
        ' | ' +
        data.data.location[0] +
        '-' +
        data.data.location[1] +
        '-' +
        data.data.location[2] +
        '-' +
        data.data.location[4]
      );
    } catch (error) {
      console.error('[getUserIp] 错误:', error);
      return '获取IP地址失败';
    }
  }

  /**
   * 加载缓存的用户信息或获取新数据
   */
  async function loadUserInfo(): Promise<CachedUserInfo | null> {
    // 检查是否有有效的缓存数据
    const cached = getStorageItem<CachedUserInfo>(CACHE_KEY);
    if (cached) {
      const now = Date.now();
      // 如果缓存仍然有效，使用它
      if (now - cached.timestamp < CACHE_DURATION) {
        cachedInfo.value = cached;
        return cached;
      }
    }

    // 获取新数据
    const studentId = getStudentId();
    const studentName = getStudentName();
    const userIp = await getUserIp();

    if (!studentId || !studentName) {
      console.warn('[loadUserInfo] 缺少学号或姓名');
      return null;
    }

    const freshInfo: CachedUserInfo = {
      studentId,
      studentName,
      userIp,
      timestamp: Date.now(),
    };

    // 保存到缓存
    setStorageItem(CACHE_KEY, freshInfo);
    cachedInfo.value = freshInfo;

    return freshInfo;
  }

  /**
   * 获取缓存的用户信息（立即返回，可能返回过期数据）
   */
  function getCachedUserInfo(): CachedUserInfo | null {
    if (cachedInfo.value) {
      return cachedInfo.value;
    }

    const cached = getStorageItem<CachedUserInfo>(CACHE_KEY);
    if (cached) {
      cachedInfo.value = cached;
      return cached;
    }

    return null;
  }

  /**
   * 清除用户信息缓存
   */
  function clearCache(): void {
    removeStorageItem(CACHE_KEY);
    cachedInfo.value = null;
  }

  return {
    cachedInfo,
    getStudentId,
    getStudentName,
    getUserIp,
    loadUserInfo,
    getCachedUserInfo,
    clearCache,
  };
}
