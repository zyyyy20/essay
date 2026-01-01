<template>
  <div class="card" style="max-width:420px;margin:0 auto">
    <h2>注册</h2>
    <div class="space"></div>
    <input class="input" :class="{ invalid: usernameError }" v-model="username" placeholder="用户名" />
    <div class="space"></div>
    <input class="input" :class="{ invalid: emailError }" v-model="email" placeholder="邮箱" />
    <div class="space"></div>
    <input class="input" :class="{ invalid: passwordError }" type="password" v-model="password" placeholder="密码" />
    <div class="space"></div>
    <div class="muted" v-if="usernameError || emailError || passwordError">请填写完整信息</div>
    <div class="space"></div>
    <button class="btn primary" :disabled="disabled" @click="register">注册</button>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '../api/client'
import { authStore } from '../store/auth'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const usernameError = computed(() => !username.value)
const emailError = computed(() => !email.value || !/.+@.+\..+/.test(email.value))
const passwordError = computed(() => !password.value)
const disabled = computed(() => usernameError.value || emailError.value || passwordError.value)

async function register() {
  if (disabled.value) return
  const r = await apiClient.register(username.value, email.value, password.value)
  apiClient.updateToken(r.data.token)
  authStore.setUser(r.data.user)
  router.push('/')
}
</script>
