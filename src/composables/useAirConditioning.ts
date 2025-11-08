import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  OC_GetPaymentUnits,
  OC_GetBuildingNumbers,
  OC_GetRoomNumbers,
  OC_GetACBalance,
} from '@/api/ocAPI';
import type {
  OCLoginResponse,
  OC_GetBuildingNoList,
  OC_GetRoomNoData,
} from '@/api/ocAPI/type/response';
import { useApiCall } from './useApiCall';

interface ACSettings {
  areaId: string;
  areaName: string;
  buildingId: string;
  roomId: string;
}

const SETTINGS_KEY = 'SA-AC-SETTINGS';
const DEFAULT_AREA_ID = '1';

/**
 * 用于空调管理的组合式函数
 * 处理楼栋/房间选择和余额查询
 */
export function useAirConditioning() {
  const { execute } = useApiCall();
  
  // 状态
  const showDialog = ref(false);
  const selectedAreaId = ref(DEFAULT_AREA_ID);
  const selectedAreaName = ref('');
  const selectedBuildingId = ref('');
  const selectedRoomId = ref('');
  const buildingList = ref<OC_GetBuildingNoList[]>([]);
  const roomList = ref<OC_GetRoomNoData[]>([]);
  const balance = ref('');
  const balanceDisplay = ref('点击设置宿舍');

  /**
   * 从 localStorage 获取一卡通用户信息
   */
  function getOCUserInfo(): OCLoginResponse | null {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('[getOCUserInfo] 解析错误:', error);
      return null;
    }
  }

  /**
   * 加载缴费单位（区域信息）
   */
  async function loadPaymentUnits(): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通');
          return null;
        }

        return await OC_GetPaymentUnits(userInfo.data.token);
      },
      { errorMessage: '获取支付单位失败' }
    );

    if (result?.code === 200 && result.data.list.length > 0) {
      selectedAreaName.value = result.data.list[0].area_name;
      selectedAreaId.value = result.data.list[0].area_id;
    }
  }

  /**
   * 加载楼栋列表
   */
  async function loadBuildingList(): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通');
          return null;
        }

        return await OC_GetBuildingNumbers(userInfo.data.token);
      },
      { errorMessage: '获取楼栋列表失败' }
    );

    if (result?.code === 200 && result.data.list) {
      buildingList.value = result.data.list;
    }
  }

  /**
   * 加载指定楼栋的房间列表
   */
  async function loadRoomList(buildId: string): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通');
          return null;
        }

        return await OC_GetRoomNumbers(buildId, userInfo.data.token);
      },
      { errorMessage: '获取房间列表失败' }
    );

    if (result?.code === 200 && result.data?.list) {
      roomList.value = result.data.list;
    }
  }

  /**
   * 加载空调余额
   */
  async function loadBalance(): Promise<void> {
    if (!selectedBuildingId.value || !selectedRoomId.value) {
      balance.value = '';
      return;
    }

    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通');
          return null;
        }

        return await OC_GetACBalance(
          selectedBuildingId.value,
          selectedRoomId.value,
          userInfo.data.token
        );
      },
      { errorMessage: '获取空调余额失败' }
    );

    if (result?.code === 200 && result.data?.balance) {
      balance.value = result.data.balance;
      balanceDisplay.value = result.data.balance;
    }
  }

  /**
   * 处理楼栋变更
   */
  async function onBuildingChange(buildId: string): Promise<void> {
    selectedRoomId.value = '';
    roomList.value = [];
    balance.value = '';
    
    if (buildId) {
      await loadRoomList(buildId);
    }
  }

  /**
   * 处理房间变更
   */
  async function onRoomChange(): Promise<void> {
    await loadBalance();
  }

  /**
   * 验证设置
   */
  function validateSettings(): boolean {
    return !!(selectedBuildingId.value && selectedRoomId.value);
  }

  /**
   * 保存设置到 localStorage
   */
  function saveSettings(): void {
    if (!validateSettings()) {
      ElMessage.warning('请先选择楼栋和房间');
      return;
    }

    const settings: ACSettings = {
      areaId: selectedAreaId.value,
      areaName: selectedAreaName.value,
      buildingId: selectedBuildingId.value,
      roomId: selectedRoomId.value,
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    ElMessage.success('空调设置已保存');
  }

  /**
   * 从 localStorage 加载已保存的设置
   */
  async function loadSavedSettings(): Promise<void> {
    try {
      const settingsStr = localStorage.getItem(SETTINGS_KEY);
      if (!settingsStr) return;

      const settings = JSON.parse(settingsStr) as ACSettings;
      selectedAreaId.value = settings.areaId || DEFAULT_AREA_ID;
      selectedAreaName.value = settings.areaName || '';
      selectedBuildingId.value = settings.buildingId || '';
      selectedRoomId.value = settings.roomId || '';

      // 如果选择了楼栋，加载房间列表
      if (selectedBuildingId.value) {
        await loadRoomList(selectedBuildingId.value);
      }

      // 如果楼栋和房间都已选择，加载余额
      if (validateSettings()) {
        await loadBalance();
      }
    } catch (error) {
      console.error('[loadSavedSettings] 错误:', error);
    }
  }

  /**
   * 初始化空调数据
   */
  async function initialize(): Promise<void> {
    await loadPaymentUnits();
    await loadBuildingList();
    await loadSavedSettings();
  }

  return {
    // 状态
    showDialog,
    selectedAreaId,
    selectedAreaName,
    selectedBuildingId,
    selectedRoomId,
    buildingList,
    roomList,
    balance,
    balanceDisplay,
    
    // 方法
    loadPaymentUnits,
    loadBuildingList,
    loadRoomList,
    loadBalance,
    onBuildingChange,
    onRoomChange,
    validateSettings,
    saveSettings,
    loadSavedSettings,
    initialize,
  };
}
