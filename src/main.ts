import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
// import { loadFull } from "tsparticles"; // 完整版
import { loadSlim } from "@tsparticles/slim"; // 轻量版
import Particles from "@tsparticles/vue3";
import { initializeUserState } from './firebase/userStore'


const app = createApp(App);

// 初始化用户状态
initializeUserState();

app.use(Particles, {
	init: async (engine: any) => {
		// await loadFull(engine); // 完整版
		await loadSlim(engine); //加载轻量版本
	},
}).use(router).mount('#app')
