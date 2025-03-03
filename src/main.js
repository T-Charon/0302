// 导入createApp模块
// 作用：创建一个vue的应用
import { createApp } from 'vue'
import localforage from 'localforage'
import '@/common.css'

// 组件：具备HTML+CSS+JS的一个HTML片段（Vue自己定义的一种组织html,css,js的一种文件格式）
// 作用：替代现有的html文件+css文件+js文件组织代码的方式（革命）
// 规范：.vue文件中有很多代码块，其中官方规定的有template、script、style、代码块
import App from './App.vue'

createApp(App).mount('#app')
