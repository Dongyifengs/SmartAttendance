import {Buffer} from 'buffer'
import {JSEncrypt} from 'jsencrypt'

declare global {
    interface Window {
        Buffer: typeof Buffer
    }
}

// 设置全局Buffer对象，用于Base64操作
window.Buffer = Buffer

// RSA公钥，用于前端数据加密
const pb_key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjxeQ8TmnvvIRreoJfTAdEdaD8Vj/n8OQuAxqD6kbrYPculdAfPNLM5B5Y289oID74Ze8CTcy5vfQK1f5kgzKMr/EywV3MMDVVjS05Z8/eQaU9xMiKeIqUkubAiL2oE/hNfBN/w/NTTGMpJ63x/yMdi6Uo0FSFNm/6JmBeTflVJQIDAQAB"

// 加密存储数据
export function encryptStorageData(data: any, key: string) {
    const encryptor = new JSEncrypt()
    // 设置PEM格式的公钥
    encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`)
    // 加密数据并转换为Base64
    const encrypted = encryptor.encrypt(JSON.stringify(data))
    return encrypted ? btoa(encrypted) : null
}

// 解密存储数据
export function decryptStorageData(encryptedData: string, key: string) {
    try {
        const decryptor = new JSEncrypt()
        // 设置PEM格式的私钥
        decryptor.setPrivateKey(key)
        // Base64解码后解密
        const decrypted = decryptor.decrypt(atob(encryptedData))
        return decrypted ? JSON.parse(decrypted) : null
    } catch (e) {
        console.error('解密失败:', e)
        return null
    }
}

// 双重Base64编码
function doubleBase64Encode(str: string) {
    // 第一次Base64编码
    const first = Buffer.from(str).toString('base64')
    // 对第一次编码结果再次Base64编码
    return Buffer.from(first).toString('base64')
}

// 转义字符串中的特殊字符
function escapeString(text: string) {
    return text
        .replace(/>/g, "&gt;")     // 转义大于号
        .replace(/</g, "&lt;")     // 转义小于号
        .replace(/ /g, "&nbsp;")   // 转义空格
        .replace(/"/g, "&quot;")   // 转义双引号
        .replace(/'/g, "&#39;")    // 转义单引号
        .replace(/\\/g, "\\\\")    // 转义反斜杠
        .replace(/\n/g, "\\n")     // 转义换行符
        .replace(/\r/g, "\\r")     // 转义回车符
}

// RSA加密函数
export function encrypt(original: string) {
    const encryptor = new JSEncrypt()
    // 设置PEM格式的公钥
    encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${pb_key}\n-----END PUBLIC KEY-----`)

    // RSA加密原始数据
    const encrypted = encryptor.encrypt(original)
    // 转义加密结果中的特殊字符
    if (!encrypted) return ""
    const escaped = escapeString(encrypted)
    // 对转义后的结果进行双重Base64编码
    return doubleBase64Encode(escaped)
}