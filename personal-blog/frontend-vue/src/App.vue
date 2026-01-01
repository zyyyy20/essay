<template>
  <div class="layout">
    <header class="header">
      <div class="row" style="gap:16px">
        <nav class="nav">
          <router-link to="/">首页</router-link>
        </nav>
        <div>
          <template v-if="user">
            <span>您好，{{ user.username }}</span>
            <button class="btn" style="margin-left:8px" @click="logout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" style="margin-left:8px">注册</router-link>
          </template>
        </div>
        <ThemeToggle />
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">© 2025 个人博客</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from './store/auth'
import ThemeToggle from './components/ThemeToggle.vue'
const user = computed(() => authStore.user)
function logout() { authStore.clear() }
</script>
