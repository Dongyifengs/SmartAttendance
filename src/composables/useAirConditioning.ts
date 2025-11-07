import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { OC_GetPaymentUnits, OC_GetBuildingNumbers, OC_GetRoomNumbers, OC_GetACBalance } from '@/api/ocAPI';
import type { OC_GetBuildingNoList, OC_GetRoomNoData } from '@/api/ocAPI/type/response';
import { useApiRequest } from './useApiRequest';

const DEFAULT_AREA_ID = '1';

/**
 * 空调相关功能的Composable
 */
export function useAirConditioning() {
  const { request } = useApiRequest();

  // 状态
  const OC_KTYE = ref('点击设置宿舍');
  const selectedAreaId = ref(DEFAULT_AREA_ID);
  const selectedAreaName = ref('');
  const selectedBuildingId = ref('');
  const selectedRoomId = ref('');
  const buildingList = ref<OC_GetBuildingNoList[]>([]);
  const roomList = ref<OC_GetRoomNoData[]>([]);
  const acBalance = ref('');

  /**
   * 从本地存储读取一卡通用户信息
   */
  function getUserInfo_OC() {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    try {
      return JSON.parse(userInfoStr);
    } catch (e) {
      console.error('[getUserInfo_OC] JSON.parse 失败', e);
      return null;
    }
  }

  /**
   * 获取缴费单位（区域）
   */
  async function loadPaymentUnits(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通以获取用户信息');
      return;
    }

    const userKey = userInfo.data.token;
    const response = await request(() => OC_GetPaymentUnits(userKey), '获取支付单位失败');

    console.log('获取支付单位返回：', response);
    if (response && response.code === 200 && response.data.list.length > 0) {
      selectedAreaName.value = response.data.list[0].area_name;
      selectedAreaId.value = response.data.list[0].area_id;
    }
  }

  /**
   * 获取楼栋列表
   */
  async function loadBuildingList(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通');
      return;
    }

    const userKey = userInfo.data.token;
    const response = await request(() => OC_GetBuildingNumbers(userKey), '获取楼栋列表失败');

    console.log('获取楼栋列表返回：', response);
    if (response && response.code === 200 && response.data.list) {
      buildingList.value = response.data.list;
    }
  }

  /**
   * 获取房间列表
   */
  async function loadRoomList(buildId: string): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通');
      return;
    }

    const userKey = userInfo.data.token;
    const response = await request(() => OC_GetRoomNumbers(buildId, userKey), '获取房间列表失败');

    console.log('获取房间列表返回：', response);
    if (response && response.code === 200 && response.data && response.data.list) {
      roomList.value = response.data.list;
    }
  }

  /**
   * 获取空调余额
   */
  async function loadACBalance(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通');
      return;
    }

    if (!selectedBuildingId.value || !selectedRoomId.value) {
      acBalance.value = '';
      return;
    }

    const userKey = userInfo.data.token;
    const response = await request(
      () => OC_GetACBalance(selectedBuildingId.value, selectedRoomId.value, userKey),
      '获取空调余额失败'
    );

    console.log('获取空调余额返回：', response);
    if (response && response.code === 200 && response.data) {
      acBalance.value = response.data.balance;
      OC_KTYE.value = acBalance.value;
    }
  }

  /**
   * 楼栋选择变化处理
   */
  async function onBuildingChange(buildId: string): Promise<void> {
    selectedRoomId.value = '';
    roomList.value = [];
    acBalance.value = '';
    if (buildId) {
      await loadRoomList(buildId);
    }
  }

  /**
   * 房间选择变化处理
   */
  async function onRoomChange(): Promise<void> {
    await loadACBalance();
  }

  /**
   * 验证空调设置是否完整
   */
  function validateACSettings(): boolean {
    return !!(selectedBuildingId.value && selectedRoomId.value);
  }

  /**
   * 保存空调设置到本地
   */
  function saveACSettings(): void {
    if (!validateACSettings()) {
      ElMessage.warning('请先选择楼栋和房间');
      return;
    }

    const settings = {
      areaId: selectedAreaId.value,
      areaName: selectedAreaName.value,
      buildingId: selectedBuildingId.value,
      roomId: selectedRoomId.value,
    };

    localStorage.setItem('SA-AC-SETTINGS', JSON.stringify(settings));
    ElMessage.success('空调设置已保存');
  }

  /**
   * 从本地加载空调设置
   */
  async function loadSavedACSettings(): Promise<void> {
    try {
      const settingsStr = localStorage.getItem('SA-AC-SETTINGS');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        selectedAreaId.value = settings.areaId || DEFAULT_AREA_ID;
        selectedAreaName.value = settings.areaName || '';
        selectedBuildingId.value = settings.buildingId || '';
        selectedRoomId.value = settings.roomId || '';

        if (selectedBuildingId.value) {
          await loadRoomList(selectedBuildingId.value);
        }

        if (validateACSettings()) {
          await loadACBalance();
        }
      }
    } catch (error) {
      console.error('[loadSavedACSettings] 异常: ', error);
    }
  }

  return {
    // 状态
    OC_KTYE,
    selectedAreaId,
    selectedAreaName,
    selectedBuildingId,
    selectedRoomId,
    buildingList,
    roomList,
    acBalance,
    // 方法
    loadPaymentUnits,
    loadBuildingList,
    loadRoomList,
    loadACBalance,
    onBuildingChange,
    onRoomChange,
    validateACSettings,
    saveACSettings,
    loadSavedACSettings,
  };
}
