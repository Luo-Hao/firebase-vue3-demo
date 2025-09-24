<template>
  <div class="layout-container">
    <!-- 固定头部 -->
    <header class="header">
      <div class="header-container">
        <!-- 左侧：Logo和导航 -->
        <div class="header-left">
          <div class="logo">
            <router-link to="/" class="logo-link">
              <img src="/vite.svg" alt="Logo" class="logo-image" />
              <span class="logo-text">Vue Demo</span>
            </router-link>
          </div>
          <nav class="nav">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/about" class="nav-link">About</router-link>
          </nav>
        </div>
        <!-- 右侧：登录和注册按钮 -->
        <div class="header-right">
          <button class="btn btn-login">登录</button>
          <button class="btn btn-register">注册</button>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <component :is="currentView"></component>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 根据路由动态加载对应的视图组件
const currentView = computed(() => {
  const viewName = route.name === 'home' ? 'HomeView' : 'AboutView'
  return defineAsyncComponent(() => import(`../views/${viewName}.vue`))
})
</script>

<style lang="less" scoped>
// 定义变量
@primary-color: #42b983;
@primary-hover: #38a169;
@text-color: #333;
@bg-color: white;
@border-color: #ddd;
@border-hover: #ccc;
@shadow-color: rgba(0, 0, 0, 0.1);
@border-radius: 4px;
@transition-time: 0.3s;
@max-width: 1200px;

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 固定头部样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: @bg-color;
  box-shadow: 0 2px 4px @shadow-color;
  z-index: 1000;
  
  .header-container {
    max-width: @max-width;
    margin: 0 auto;
    padding: 0.8rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    
    /* 左侧Logo和导航 */
    .header-left {
      display: flex;
      align-items: center;
      gap: 2rem;
      
      .logo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: @text-color;
        gap: 0.5rem;
        
        .logo-image {
          height: 2.5rem;
          width: auto;
        }
        
        .logo-text {
          font-size: 1.2rem;
          font-weight: bold;
          color: @primary-color;
        }
      }
      
      .nav {
        display: flex;
        gap: 1rem;
        
        .nav-link {
          color: @text-color;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: @border-radius;
          transition: all @transition-time;
          display: inline-block;
          min-width: 60px;
          text-align: center;
          
          &:hover {
            background-color: #e9ecef;
            color: @text-color;
          }
          
          &.router-link-active {
            background-color: @primary-color;
            color: white;
            padding: 0.5rem 1rem;
            min-width: 60px;
          }
        }
      }
    }
    
    /* 右侧按钮 */
    .header-right {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      
      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: @border-radius;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all @transition-time;
        
        &-login {
          background-color: transparent;
          color: @text-color;
          border: 1px solid @border-color;
          
          &:hover {
            background-color: #f8f9fa;
            border-color: @border-hover;
          }
        }
        
        &-register {
          background-color: @primary-color;
          color: white;
          border: 1px solid @primary-color;
          
          &:hover {
            background-color: @primary-hover;
            border-color: @primary-hover;
          }
        }
      }
    }
  }
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: @max-width;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  margin-top: 60px; /* 确保内容不被固定头部遮挡 */
}
</style>