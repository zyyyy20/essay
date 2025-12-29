// API基础配置
const API_BASE_URL = 'http://localhost:8080/api';

// API客户端
class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }
    
    // 基础请求方法
    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // 添加认证token
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // 用户认证相关API
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }
    
    async register(username, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    }
    
    // 文章相关API
    async getArticles(page = 1, size = 10) {
        return this.request(`/articles?page=${page}&size=${size}`);
    }
    
    async getArticlesByCategory(categoryId, page = 1, size = 10) {
        return this.request(`/articles/category/${categoryId}?page=${page}&size=${size}`);
    }
    
    async getArticlesByTag(tagId, page = 1, size = 10) {
        return this.request(`/articles/tag/${tagId}?page=${page}&size=${size}`);
    }
    
    async searchArticles(keyword, page = 1, size = 10) {
        return this.request(`/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    }
    
    async getArticleById(id) {
        return this.request(`/articles/${id}`);
    }
    
    async createArticle(article) {
        return this.request('/articles', {
            method: 'POST',
            body: JSON.stringify(article)
        });
    }
    
    async updateArticle(id, article) {
        return this.request(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(article)
        });
    }
    
    async deleteArticle(id) {
        return this.request(`/articles/${id}`, {
            method: 'DELETE'
        });
    }
    
    async toggleArticlePublishStatus(id) {
        return this.request(`/articles/${id}/publish`, {
            method: 'PUT'
        });
    }
    
    // 分类相关API
    async getCategories() {
        return this.request('/categories');
    }
    
    async createCategory(category) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(category)
        });
    }
    
    async updateCategory(id, category) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category)
        });
    }
    
    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
    
    // 标签相关API
    async getTags() {
        return this.request('/tags');
    }
    
    async createTag(tag) {
        return this.request('/tags', {
            method: 'POST',
            body: JSON.stringify(tag)
        });
    }
    
    async updateTag(id, tag) {
        return this.request(`/tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tag)
        });
    }
    
    async deleteTag(id) {
        return this.request(`/tags/${id}`, {
            method: 'DELETE'
        });
    }
    
    // 评论相关API
    async getCommentsByArticle(articleId) {
        return this.request(`/comments/article/${articleId}`);
    }
    
    async addComment(articleId, content) {
        return this.request(`/comments/article/${articleId}?content=${encodeURIComponent(content)}`, {
            method: 'POST'
        });
    }
    
    async deleteComment(id) {
        return this.request(`/comments/${id}`, {
            method: 'DELETE'
        });
    }
    
    // 管理后台API
    async getAllArticles(page = 1, size = 10) {
        return this.request(`/articles/admin?page=${page}&size=${size}`);
    }
    
    // 更新token
    updateToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    
    // 清除token
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
}

// 创建全局API客户端实例
window.apiClient = new ApiClient();