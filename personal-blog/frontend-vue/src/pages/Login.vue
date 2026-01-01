<template>
  <div class="card" style="max-width:420px;margin:0 auto">
    <h2>登录</h2>
    <div class="space"></div>
    <input class="input" :class="{ invalid: usernameError }" v-model="username" placeholder="用户名" />
    <div class="space"></div>
    <input class="input" :class="{ invalid: passwordError }" type="password" v-model="password" placeholder="密码" />
    <div class="space"></div>
    <div class="muted" v-if="usernameError || passwordError">请填写完整用户名与密码</div>
    <div class="space"></div>
    <button class="btn primary" :disabled="disabled" @click="login">登录</button>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '../api/client'
import { authStore } from '../store/auth'

const router = useRouter()
const username = ref('admin')
const password = ref('admin123')
const usernameError = computed(() => !username.value)
const passwordError = computed(() => !password.value)
const disabled = computed(() => usernameError.value || passwordError.value)

async function login() {
  if (disabled.value) return
  const r = await apiClient.login(username.value, password.value)
  apiClient.updateToken(r.data.token)
  authStore.setUser(r.data.user)
  router.push('/')
}
</script>
