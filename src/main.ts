import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/theme-chalk/el-message.css'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
