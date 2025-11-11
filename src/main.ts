import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import '@/App.css';

const app = createApp(App);

// 动态插入统计脚本
const script: HTMLScriptElement = document.createElement('script');
script.defer = true;
script.src = import.meta.env.VITE_STAT_SCRIPT;
script.dataset.websiteId = import.meta.env.VITE_STAT_WEBSITE_ID;
document.head.appendChild(script);

app.use(router);
app.mount('#app');
