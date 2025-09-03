import {Buffer} from 'buffer';
import {JSEncrypt} from "jsencrypt";

/**
 * 扩展 window 对象类型，允许挂载 Buffer 属性，使在浏览器环境可使用 Buffer。
 */
declare global {
    interface Window {
        Buffer: typeof Buffer;
    }
}

/**
 * 将 Node.js 的 Buffer 对象挂载到全局 window 下，
 * 以便在浏览器环境中进行 Base64 编码和解码操作。
 */
window.Buffer = Buffer;

/**
 * RSA 公钥字符串，用于加密操作。
 */
const pb_key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjxeQ8TmnvvIRreoJfTAdEdaD8Vj/n8OQuAxqD6kbrYPculdAfPNLM5B5Y289oID74Ze8CTcy5vfQK1f5kgzKMr/EywV3MMDVVjS05Z8/eQaU9xMiKeIqUkubAiL2oE/hNfBN/w/NTTGMpJ63x/yMdi6Uo0FSFNm/6JmBeTflVJQIDAQAB";

/**
 * 使用 RSA 公钥加密数据，并将加密后的内容进行 Base64 编码以便存储。
 * @param data - 需要加密的字符串数据
 * @param key - RSA 公钥字符串
 * @returns 加密并编码后的字符串，若加密失败则返回 null
 */
export function encryptStorageData(data: string, key: string) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`);
    const encrypted = encryptor.encrypt(JSON.stringify(data));
    return encrypted ? btoa(encrypted) : null;
}

/**
 * 解密已加密并 Base64 编码的数据。
 * 使用 RSA 私钥完成解密，并将解密结果从 JSON 字符串恢复为原始数据。
 * @param encryptedData - 加密并编码后的字符串
 * @param key - RSA 私钥字符串
 * @returns 解密后的数据对象，若解密失败则返回 null
 */
export function decryptStorageData(encryptedData: string, key: string) {
    try {
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(key);
        const decrypted = decrypt.decrypt(atob(encryptedData));
        return decrypted ? JSON.parse(decrypted) : null;
    } catch (e) {
        console.error("解密失败:", e);
        return null;
    }
}

/**
 * 对字符串进行两次 Base64 编码。
 * 适用于对敏感信息进行多层编码保护。
 * @param str - 待编码的字符串
 * @returns 双重 Base64 编码后的字符串
 */
function doubleBase64Encode(str: string) {
    const first = Buffer.from(str).toString('base64');
    return Buffer.from(first).toString('base64');
}

/**
 * 对输入字符串中的特殊字符进行 HTML 转义和格式化，
 * 以防止在数据传输和展示过程中引发解析错误或安全隐患。
 * @param str - 待转义的字符串
 * @returns 转义后的字符串
 */
function escapeString(str: string) {
    return str
        .replace(/>/g, "&gt;")     // 转义大于号
        .replace(/</g, "&lt;")     // 转义小于号
        .replace(/ /g, "&nbsp;")   // 转义空格
        .replace(/"/g, "&quot;")   // 转义双引号
        .replace(/'/g, "&#39;")    // 转义单引号
        .replace(/\\/g, "\\\\")    // 转义反斜杠
        .replace(/\n/g, "\\n")     // 转义换行符
        .replace(/\r/g, "\\r");    // 转义回车符
}

/**
 * 对原始字符串进行 RSA 加密，并对加密结果进行特殊字符转义与双重 Base64 编码，
 * 以增强数据安全性和兼容性。
 * @param original - 待加密的原始字符串
 * @returns 经过加密、转义和双重编码后的字符串
 * @throws 当加密失败时抛出异常
 */
export function encrypt(original: string) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${pb_key}\n-----END PUBLIC KEY-----`);
    const encrypted = encryptor.encrypt(original);
    if (typeof encrypted !== "string") {
        throw new Error("RSA加密失败");
    }
    const escaped = escapeString(encrypted);
    return doubleBase64Encode(escaped);
}