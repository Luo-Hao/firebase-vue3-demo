<template>
  <div class="app">
  	<ParticlesBackground />  <!-- 背景粒子效果 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import ParticlesBackground from './components/ParticlesBackground.vue'
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  position: relative;
}
</style>
