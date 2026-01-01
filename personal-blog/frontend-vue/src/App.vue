<template>
  <div class="layout">
    <header class="header">
      <div class="row" style="gap:16px">
        <nav class="nav">
          <router-link to="/">首页</router-link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">© 2025 个人博客</footer>
    <LoginModule />
  </div>
</template>

<script setup>
import LoginModule from './components/LoginModule.vue'
import { computed } from 'vue'
import { authStore } from './store/auth'
const user = computed(() => authStore.user)
function logout() { authStore.clear() }
</script>
