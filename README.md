# 阿拉校园 智能签到签退系统 (SmartAttendance)

<div align="center">

![Version](https://img.shields.io/badge/version-beta--0.0.1-blue.svg)
![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)
![Vue](https://img.shields.io/badge/Vue-3.5.18-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)

一个智能化的校园签到签退解决方案，让考勤变得简单高效

[适用学校（不完整）](http://anlaxy.com/business.html) |
[阿拉校园官网](http://anlaxy.com/index.html) |
[阿拉校园后台](https://anlaxy.com.cn/admin)

</div>

---

## 📖 项目简介

**SmartAttendance** 是一个基于 **阿拉校园** 平台开发的智能签到签退系统，专为简化传统校园考勤流程而设计。

### 🎯 解决的问题

传统的阿拉校园 APP 签到签退系统存在以下痛点：

- ❌ **位置限制**：必须在指定教室位置才能签到
- ❌ **蓝牙依赖**：需要全程开启蓝牙并连接指定设备
- ❌ **人脸识别**：每次签到都需要进行人脸识别验证
- ❌ **强制评价**：签退时必须进行课程评分和评价
- ❌ **服务器卡顿**：高峰期服务器响应慢，导致无法正常签退
- ❌ **操作繁琐**：多个步骤才能完成一次签到/签退

### ✨ 我们的优势

- ✅ **远程签到**：无需到达教室，随时随地完成签到签退
- ✅ **简化流程**：只需学号密码登录，一键完成签到/签退
- ✅ **无设备限制**：不需要蓝牙连接，不需要定位服务
- ✅ **无人脸验证**：跳过繁琐的人脸识别步骤
- ✅ **免评价**：签退时无需填写评分和评价内容
- ✅ **灵活时间**：支持自定义签到签退时间，应对迟到等特殊情况
- ✅ **直观界面**：清晰展示当前课程，点击即可操作

---

## 🚀 主要功能

### 1. 智慧考勤系统
- 📅 **课程表查看**：自动获取并显示当天的课程安排
- ⏰ **一键签到**：点击课程卡片即可完成签到，无需其他操作
- ✔️ **一键签退**：点击即完成签退，无需评分评价
- 🕐 **时间自定义**：迟到了？可以手动选择签到/签退时间
- 📊 **考勤记录**：查看历史签到签退记录
- 📈 **考勤统计**：查看考勤状态统计（迟到、缺勤、请假等）

### 2. 一卡通集成
- 💳 **钱包余额查询**：查看校园卡余额
- 🏠 **宿舍空调余额**：查看宿舍空调电费余额
- 💰 **个人付款码**：显示校园卡二维码用于支付

### 3. 开发者工具
- 🔍 **课程详细列表**：查看课程的详细信息和数据结构
- 📋 **考勤数据表**：开发者模式下查看原始考勤数据
- 🛠️ **请假管理**：请假记录的查询和管理

### 4. 用户体验
- 🔐 **自动登录**：保存账号信息，4小时内自动重新登录
- 🎨 **美观界面**：基于 Element Plus 的现代化 UI 设计
- 📱 **响应式设计**：支持各种屏幕尺寸
- ⚡ **快速响应**：优化的 API 调用，操作流畅

---

## 🛠️ 技术栈

### 前端框架
- **Vue 3.5.18** - 渐进式 JavaScript 框架
- **TypeScript 5.8.3** - JavaScript 的超集，提供类型安全
- **Vite 7.1.11** - 下一代前端构建工具

### UI 组件库
- **Element Plus 2.11.3** - 基于 Vue 3 的组件库
- **@element-plus/icons-vue** - Element Plus 图标库
- **unplugin-icons** - 按需引入图标

### 工具库
- **Vue Router 4.5.1** - Vue.js 官方路由管理器
- **Axios 1.11.0** - Promise 基于的 HTTP 客户端
- **Day.js 1.11.18** - 轻量级日期时间库
- **@vueuse/core** - Vue Composition API 工具集
- **js-base64** - Base64 编码解码
- **JSEncrypt** - RSA 加密库

### 开发工具
- **vue-tsc** - Vue 3 的 TypeScript 类型检查
- **unplugin-auto-import** - 自动导入 API
- **unplugin-vue-components** - 自动导入组件

---

## 📦 安装部署

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 克隆项目

```bash
git clone https://github.com/Dongyifengs/SmartAttendance.git
cd SmartAttendance
```

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 配置环境变量

创建 `.env.development` 文件（开发环境）：

```env
# 智慧考勤账号配置（可选，用于自动填充）
VITE_ZHKQAPI_USERNAME=你的学号
VITE_ZHKQAPI_PASSWORD=你的密码
VITE_ZHKQAPI_DEVICEID=你的设备ID

# 一卡通账号配置（可选，用于自动填充）
VITE_OC_USERNAME=你的考生号
VITE_OC_PASSWORD=你的密码

# 统计脚本配置（可选）
VITE_STAT_SCRIPT=统计脚本URL
VITE_STAT_WEBSITE_ID=网站ID

# 开发环境标识
VITE_TEXT=开发环境
```

创建 `.env.production` 文件（生产环境）：

```env
# GitHub仓库配置（用于显示构建信息）
VITE_GITHUB_REPO=https://github.com/Dongyifengs/SmartAttendance

# 生产环境构建时会自动注入以下变量：
# VITE_BUILD_DATE - 构建日期
# VITE_GIT_HASH - Git提交短哈希
# VITE_GIT_FULL_HASH - Git提交完整哈希
```

> **⚠️ 安全提示**：
> - `.env.development` 文件已在 `.gitignore` 中忽略，不会提交到版本库
> - 请勿在公共仓库中暴露真实的账号密码信息
> - 生产环境部署时建议通过服务器环境变量配置敏感信息

### 获取设备 ID

**Android 手机**：
1. 打开拨号盘
2. 输入 `*#06#`
3. 复制显示的 IMEI1（第一个 IMEI 码）

**iOS 设备**：
1. 打开"设置" > "通用" > "关于本机"
2. 查找并复制 IMEI

---

## 📱 使用指南

### 1. 登录系统

首次使用需要登录两个账号：

#### 智慧考勤登录
- **学号**：你的校园学号
- **密码**：智慧考勤系统密码
- **设备ID**：手机 IMEI 码（通过 `*#06#` 获取）

#### 一卡通登录
- **考生号**：你的考生号
- **密码**：一卡通密码

> 💡 **提示**：登录信息会保存在本地，4小时内自动重新登录，无需重复输入。

### 2. 查看课程

登录成功后，主页会显示：
- 当天的所有课程
- 课程时间、地点、教师信息
- 签到签退状态

### 3. 签到操作

**正常签到**：
1. 找到对应的课程卡片
2. 点击签到按钮
3. 系统自动完成签到

**迟到签到**（自定义时间）：
1. 在课程卡片中选择签到时间
2. 从下拉框选择你希望签到的时间
3. 点击签到按钮

### 4. 签退操作

**正常签退**：
1. 找到已签到的课程
2. 点击签退按钮
3. 自动完成签退（无需评分评价）

**自定义签退时间**：
1. 选择希望签退的时间
2. 点击签退按钮

### 5. 查看考勤记录

- 点击"开发者模式"按钮
- 选择"考勤查询测试"
- 可以查看详细的考勤记录和统计信息

### 6. 退出登录

点击右上角"退出登录"按钮即可清除本地登录信息。

---

## 📂 项目结构

```
SmartAttendance/
├── public/                      # 静态资源
│   └── vite.svg                # Vite 图标
├── src/                        # 源代码目录
│   ├── API/                    # API 接口层
│   │   ├── ocAPI/             # 一卡通 API
│   │   │   ├── index.ts       # 一卡通主接口
│   │   │   └── class.ts       # 一卡通类定义
│   │   └── zhkqAPI/           # 智慧考勤 API
│   │       ├── index.ts       # 考勤主接口
│   │       ├── APIStarter/    # API 请求器
│   │       ├── Function/      # 工具函数
│   │       ├── crypto/        # 加密相关
│   │       └── type/          # TypeScript 类型定义
│   ├── components/            # 公共组件
│   │   ├── ClassCard.vue     # 课程卡片组件
│   │   ├── ClassContainer.vue # 课程容器组件
│   │   └── IconifyText.vue   # 图标文本组件
│   ├── router/                # 路由配置
│   │   └── index.ts          # 路由定义
│   ├── view/                  # 页面视图
│   │   ├── Login/            # 登录页面
│   │   │   └── Login.vue     # 登录组件
│   │   ├── Home/             # 主页
│   │   │   └── Home.vue      # 主页组件
│   │   ├── ZHKQ-DEV/         # 开发者工具页面
│   │   │   ├── ClassListDev.vue     # 课程列表
│   │   │   ├── AttendanceDev.vue    # 考勤查询
│   │   │   ├── LeaveDev.vue         # 请假管理
│   │   │   ├── components/          # 子组件
│   │   │   ├── Style/              # 样式文件
│   │   │   └── Type/               # 类型定义
│   │   └── DevHome.vue       # 开发者主页
│   ├── App.vue               # 根组件
│   ├── main.ts              # 应用入口
│   └── vite-env.d.ts        # Vite 环境类型
├── index.html               # HTML 入口
├── package.json            # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
├── LICENSE                # 开源协议（AGPL-3.0）
└── README.md             # 项目说明文档
```

---

## 🔌 API 说明

### 智慧考勤 API (zhkqAPI)

主要接口包括：

- `ZHKQ_Login` - 用户登录
- `ZHKQ_GetDayCourseList` - 获取当天课程列表
- `ZHKQ_GetDaySignList` - 获取当天签到记录
- `ZHKQ_SignIn` - 课程签到
- `ZHKQ_SignOut` - 课程签退
- `getUserClass` - 获取用户班级列表
- `getClassStudent` - 获取班级学生列表
- `getCourseStatus` - 获取课程状态
- `getAttendanceDates` - 考勤状态日期查询

### 一卡通 API (ocAPI)

- `OC_LOGIN` - 一卡通登录
- 钱包余额查询
- 空调余额查询
- 付款码生成

### 数据加密

所有 API 请求均采用双层 Base64 编码确保数据安全。

---

## ⚠️ 免责声明

1. 本项目仅供学习交流使用，请勿用于违反学校规章制度的用途。
2. 使用本系统产生的任何后果由使用者自行承担，开发者不承担任何责任。
3. 请合理使用本系统，遵守学校的考勤管理规定。
4. 建议仅在确实无法到场但需要完成考勤的特殊情况下使用（如生病、紧急事务等）。

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

- 使用清晰的标题描述问题
- 详细说明复现步骤
- 提供错误截图或日志
- 说明你的环境信息（操作系统、浏览器版本等）

### 提交 Pull Request

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 遵循 TypeScript 最佳实践
- 使用有意义的变量和函数命名
- 添加必要的注释说明
- 保持代码格式整洁统一

---

## 🐛 常见问题 (FAQ)

### Q1: 登录失败怎么办？
**A**: 请检查：
- 学号、密码是否正确
- 设备 ID 是否填写正确（Android 使用 IMEI1）
- 网络连接是否正常
- 是否使用了正确的账号类型（智慧考勤 vs 一卡通）

### Q2: 无法获取课程列表？
**A**: 可能原因：
- 当天没有课程安排
- 登录信息已过期（超过4小时），需要重新登录
- 服务器维护中，稍后再试

### Q3: 签到/签退失败？
**A**: 请确认：
- 是否在规定的时间范围内操作
- 网络连接是否稳定
- 该课程是否已经签到/签退过

### Q4: 如何获取设备 ID？
**A**: 
- **Android**: 拨号盘输入 `*#06#`，使用 IMEI 1
- **iOS**: 设置 > 通用 > 关于本机 > IMEI

### Q5: 是否支持多设备登录？
**A**: 理论上支持，但建议使用固定设备，因为设备 ID 与账号绑定。

### Q6: 数据是否安全？
**A**: 
- 所有数据保存在本地浏览器
- 密码使用加密传输
- 不会上传到第三方服务器
- 建议不要在公共电脑上使用

---

## 📄 开源协议

本项目采用 [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE) 协议开源。

这意味着：
- ✅ 可以自由使用、修改、分发本软件
- ✅ 可以将本软件用于商业目的
- ⚠️ 修改后的代码必须开源
- ⚠️ 必须保留原作者版权信息
- ⚠️ 通过网络提供服务时必须公开源代码

详细条款请查看 [LICENSE](LICENSE) 文件。

---

## 👨‍💻 作者信息

**MoYiJiangNan**
- 📧 Email: 1545929126@qq.com
- 🌐 Website: http://moyijiangnan.cn

**xinsin**
- 📧 Email: 2219291455@qq.com
- 🌐 Website: https://github.com/xinsin-star

**wzp**
- 📧 Email: 3357223099@qq.com
- 🌐 Website: https://github.com/Wzp-2008
---

## 🙏 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

## 📊 项目状态

![GitHub stars](https://img.shields.io/github/stars/Dongyifengs/SmartAttendance?style=social)
![GitHub forks](https://img.shields.io/github/forks/Dongyifengs/SmartAttendance?style=social)
![GitHub issues](https://img.shields.io/github/issues/Dongyifengs/SmartAttendance)
![GitHub last commit](https://img.shields.io/github/last-commit/Dongyifengs/SmartAttendance)

---

## 🔗 相关链接

- [阿拉校园官网](http://anlaxy.com/index.html)
- [阿拉校园后台](https://anlaxy.com.cn/admin)
- [适用学校列表（不完整）](http://anlaxy.com/business.html)
- [项目 GitHub 仓库](https://github.com/Dongyifengs/SmartAttendance)
- [问题反馈](https://github.com/Dongyifengs/SmartAttendance/issues)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by MoYiJiangNan

</div>
