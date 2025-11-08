import { ref } from 'vue';
import axios from 'axios';

interface CachedUserInfo {
  studentId: string;
  studentName: string;
  userIp: string;
  timestamp: number;
}

const CACHE_KEY = 'SA-CACHED-USER-INFO';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Composable for managing user info with local caching
 * Reduces redundant API calls and localStorage reads
 */
export function useUserInfo() {
  const cachedInfo = ref<CachedUserInfo | null>(null);

  /**
   * Get student ID from localStorage
   */
  function getStudentId(): string | null {
    const userInfoStr = localStorage.getItem('SA-ZHKQ-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      const parsed = JSON.parse(userInfoStr);
      return parsed.user_code || null;
    } catch (error) {
      console.error('[getStudentId] Parse error:', error);
      return null;
    }
  }

  /**
   * Get student name from localStorage
   */
  function getStudentName(): string | null {
    const userInfoStr = localStorage.getItem('SA-ZHKQ-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      const parsed = JSON.parse(userInfoStr);
      return parsed.user_name || null;
    } catch (error) {
      console.error('[getStudentName] Parse error:', error);
      return null;
    }
  }

  /**
   * Get user IP address
   */
  async function getUserIp(): Promise<string> {
    try {
      const response = await axios.get('/MoYiGetIP');
      const data = response.data;
      return `${data.ip} | ${data.addr}`;
    } catch (error) {
      console.error('[getUserIp] Error:', error);
      return '获取IP地址失败';
    }
  }

  /**
   * Load cached user info or fetch fresh data
   */
  async function loadUserInfo(): Promise<CachedUserInfo | null> {
    // Check if we have valid cached data
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr) as CachedUserInfo;
        const now = Date.now();
        
        // If cache is still valid, use it
        if (now - cached.timestamp < CACHE_DURATION) {
          cachedInfo.value = cached;
          return cached;
        }
      } catch (error) {
        console.error('[loadUserInfo] Cache parse error:', error);
      }
    }

    // Fetch fresh data
    const studentId = getStudentId();
    const studentName = getStudentName();
    const userIp = await getUserIp();

    if (!studentId || !studentName) {
      console.warn('[loadUserInfo] Missing student ID or name');
      return null;
    }

    const freshInfo: CachedUserInfo = {
      studentId,
      studentName,
      userIp,
      timestamp: Date.now(),
    };

    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(freshInfo));
    cachedInfo.value = freshInfo;

    return freshInfo;
  }

  /**
   * Get cached user info (returns immediately, may return stale data)
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
        console.error('[getCachedUserInfo] Parse error:', error);
      }
    }

    return null;
  }

  /**
   * Clear user info cache
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
