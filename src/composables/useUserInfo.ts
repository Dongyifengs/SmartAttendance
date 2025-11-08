import { ref } from 'vue';
import axios from 'axios';

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
    const userInfoStr = localStorage.getItem('SA-ZHKQ-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      const parsed = JSON.parse(userInfoStr);
      return parsed.user_code || null;
    } catch (error) {
      console.error('[getStudentId] 解析错误:', error);
      return null;
    }
  }

  /**
   * 从 localStorage 获取学生姓名
   */
  function getStudentName(): string | null {
    const userInfoStr = localStorage.getItem('SA-ZHKQ-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      const parsed = JSON.parse(userInfoStr);
      return parsed.user_name || null;
    } catch (error) {
      console.error('[getStudentName] 解析错误:', error);
      return null;
    }
  }

  /**
   * 获取用户 IP 地址
   */
  async function getUserIp(): Promise<string> {
    try {
      const response = await axios.get('/MoYiGetIP');
      const data = response.data;
      return `${data.ip} | ${data.addr}`;
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
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr) as CachedUserInfo;
        const now = Date.now();
        
        // 如果缓存仍然有效，使用它
        if (now - cached.timestamp < CACHE_DURATION) {
          cachedInfo.value = cached;
          return cached;
        }
      } catch (error) {
        console.error('[loadUserInfo] 缓存解析错误:', error);
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
    localStorage.setItem(CACHE_KEY, JSON.stringify(freshInfo));
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

    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        cachedInfo.value = JSON.parse(cachedStr) as CachedUserInfo;
        return cachedInfo.value;
      } catch (error) {
        console.error('[getCachedUserInfo] 解析错误:', error);
      }
    }

    return null;
  }

  /**
   * 清除用户信息缓存
   */
  function clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
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
