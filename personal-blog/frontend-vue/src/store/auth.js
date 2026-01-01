import { reactive } from 'vue'
import { apiClient } from '../api/client'

export const authStore = reactive({
  user: null,
  setUser(u) { this.user = u },
  clear() { this.user = null; apiClient.clearToken() },
  async init() {
    if (apiClient.token) {
      try {
        const r = await apiClient.getCurrentUser()
        this.user = r.data || null
      } catch {}
    }
  }
})
