<template>
  <div class="about">
    <h1>About Page</h1>
    <p>This is the about page of our Vue 3 + Vite application with router.</p>
    <router-link to="/">Go back to Home Page</router-link>
  </div>
</template>

<script setup>
// AboutView component logic
</script>

<style scoped>
.about {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #3498db;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  color: #666;
}

.router-link-active {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}
</style>