/**
 * API 客户端，兼容现有后端接口
 * @typedef {Object} PageResult
 * @property {Array<any>} list
 * @property {number} total
 * @property {number} pages
 * @property {number} page
 * @property {number} size
 */
const API_BASE_URL = '/api'

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token') || null
  }
  /**
   * 发送请求
   * @param {string} url
   * @param {RequestInit} options
   * @returns {Promise<any>}
   */
  async request(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const resp = await fetch(`${API_BASE_URL}${url}`, { ...options, headers })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return resp.json()
  }
  // auth
  async login(username, password) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
  }
  async register(username, email, password) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) })
  }
  async getCurrentUser() {
    return this.request('/auth/user')
  }
  updateToken(token) { this.token = token; localStorage.setItem('token', token) }
  clearToken() { this.token = null; localStorage.removeItem('token') }
  // articles
  async getArticles(page = 1, size = 10) { return this.request(`/articles?page=${page}&size=${size}`) }
  async searchArticles(keyword, page = 1, size = 10) { return this.request(`/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`) }
  async getArticleById(id) { return this.request(`/articles/${id}`) }
  async createArticle(article) { return this.request('/articles', { method: 'POST', body: JSON.stringify(article) }) }
  async updateArticle(id, article) { return this.request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(article) }) }
  async deleteArticle(id) { return this.request(`/articles/${id}`, { method: 'DELETE' }) }
  async toggleArticlePublishStatus(id) { return this.request(`/articles/${id}/publish`, { method: 'PUT' }) }
  // categories
  async getCategories() { return this.request('/categories') }
  async createCategory(category) { return this.request('/categories', { method: 'POST', body: JSON.stringify(category) }) }
  async updateCategory(id, category) { return this.request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(category) }) }
  async deleteCategory(id) { return this.request(`/categories/${id}`, { method: 'DELETE' }) }
  // tags
  async getTags() { return this.request('/tags') }
  async createTag(tag) { return this.request('/tags', { method: 'POST', body: JSON.stringify(tag) }) }
  async updateTag(id, tag) { return this.request(`/tags/${id}`, { method: 'PUT', body: JSON.stringify(tag) }) }
  async deleteTag(id) { return this.request(`/tags/${id}`, { method: 'DELETE' }) }
  // comments
  async getCommentsByArticle(articleId) { return this.request(`/comments/article/${articleId}`) }
  async addComment(articleId, content) { return this.request(`/comments/article/${articleId}?content=${encodeURIComponent(content)}`, { method: 'POST' }) }
  async deleteComment(id) { return this.request(`/comments/${id}`, { method: 'DELETE' }) }
  // admin
  async getAllArticles(page = 1, size = 10) { return this.request(`/articles/admin?page=${page}&size=${size}`) }
}

export const apiClient = new ApiClient()
