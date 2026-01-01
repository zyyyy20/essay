import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import './assets/style.css'
import { authStore } from './store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes
})

authStore.init()
createApp(App).use(router).mount('#app')
