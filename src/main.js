import { createApp } from 'vue'
// import './styles/reset.scss' // 必须放在最顶部！
import './styles/common.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'  
import 'element-plus/dist/index.css' 
import router from '@/router/routers.js' // 引入路由配置
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(ElementPlus).use(router).use(pinia).mount('#app')