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
 * Composable for air conditioning management
 * Handles building/room selection and balance queries
 */
export function useAirConditioning() {
  const { execute } = useApiCall();
  
  // State
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
   * Get One Card user info from localStorage
   */
  function getOCUserInfo(): OCLoginResponse | null {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('[getOCUserInfo] Parse error:', error);
      return null;
    }
  }

  /**
   * Load payment units (area information)
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
   * Load building list
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
   * Load room list for a specific building
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
   * Load air conditioning balance
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
   * Handle building change
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
   * Handle room change
   */
  async function onRoomChange(): Promise<void> {
    await loadBalance();
  }

  /**
   * Validate settings
   */
  function validateSettings(): boolean {
    return !!(selectedBuildingId.value && selectedRoomId.value);
  }

  /**
   * Save settings to localStorage
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
   * Load saved settings from localStorage
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

      // Load room list if building is selected
      if (selectedBuildingId.value) {
        await loadRoomList(selectedBuildingId.value);
      }

      // Load balance if both building and room are selected
      if (validateSettings()) {
        await loadBalance();
      }
    } catch (error) {
      console.error('[loadSavedSettings] Error:', error);
    }
  }

  /**
   * Initialize air conditioning data
   */
  async function initialize(): Promise<void> {
    await loadPaymentUnits();
    await loadBuildingList();
    await loadSavedSettings();
  }

  return {
    // State
    showDialog,
    selectedAreaId,
    selectedAreaName,
    selectedBuildingId,
    selectedRoomId,
    buildingList,
    roomList,
    balance,
    balanceDisplay,
    
    // Methods
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
