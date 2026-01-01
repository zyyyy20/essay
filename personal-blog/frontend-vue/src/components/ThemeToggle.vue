<template>
  <button class="btn" @click="toggle">{{ label }}</button>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
const theme = ref('light')
const label = computed(() => theme.value === 'light' ? '暗色' : '亮色')
function apply() { document.documentElement.setAttribute('data-theme', theme.value) }
function toggle() { theme.value = theme.value === 'light' ? 'dark' : 'light'; apply(); localStorage.setItem('theme', theme.value) }
onMounted(() => { const t = localStorage.getItem('theme'); if (t) theme.value = t; apply() })
</script>
