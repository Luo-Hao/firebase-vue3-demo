<template>
  <div class="home">
    <h1>Welcome to Home Page</h1>
    <p>This is the home page of our Vue 3 + Vite application with router.</p>
    <router-link to="/about">Go to About Page</router-link>
  </div>
</template>

<script setup>
// HomeView component logic
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #42b983;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  color: #666;
}

.router-link-active {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
</style>