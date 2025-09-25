import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
import Particles from "@tsparticles/vue3";
// import { loadFull } from "tsparticles"; // 完整版
import { loadSlim } from "@tsparticles/slim"; // 轻量版
const app = createApp(App);

app.use(Particles, {
	init: async (engine: any) => {
		// await loadFull(engine); // 加载完整版本
		await loadSlim(engine); //加载轻量版本
	},
}).use(router).mount('#app')
