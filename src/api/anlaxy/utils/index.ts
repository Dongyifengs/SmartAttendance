import { computed, type Ref } from 'vue';
import { Base64 } from 'js-base64';
import { useLocalStorage } from '@vueuse/core';
import type { UserInfo } from '../type/response.d.ts';

/**
 * 生成双层Base64编码的字符串。
 * @utils generateInterfaceParams
 * @param { object } obj - 需要进行加密的字符串源对象，例如 `"{a:1,b:2}"`
 * @return { string } 加密后的字符串，例如 `"interface=ZV****0="`
 */
export function generateInterfaceParams(obj: object): string {
  const str = JSON.stringify(obj);
  return `interface=${Base64.encode(Base64.encode(str))}`;
}

/**
 * 获取用户信息
 * @utils getZHKQUserInfo
 * @return { Ref<UserInfo | null> } 返回用户信息的响应体对象，如果没有则返回 null
 */
export function getZHKQUserInfo(): Ref<UserInfo | null> {
  const userInfo = useLocalStorage('SA-ZHKQ-USERINFO', null);
  return computed(() => (userInfo.value ? (JSON.parse(userInfo.value) as UserInfo) : null));
}
