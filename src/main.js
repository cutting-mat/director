import { createApp } from 'vue'
// 全局样式
import './assets/global.css';

import App from './App.vue'
const app = createApp(App)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus);

import * as Icons from '@element-plus/icons-vue'

for (let i in Icons) {
    app.component(Icons[i].name, Icons[i]);
}

import router from "./router.js"
app.use(router)

app.mount('#app')
