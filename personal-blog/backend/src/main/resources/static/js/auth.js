// 认证相关功能

// 检查登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutLink = document.getElementById('logoutLink');
    
    if (token) {
        // 已登录
        loginLink.style.display = 'none';
        usernameDisplay.style.display = 'inline';
        logoutLink.style.display = 'inline';
        
        // 获取用户信息
        getCurrentUser().then(user => {
            if (user) {
                usernameDisplay.textContent = user.username;
                usernameDisplay.href = '#'; // 可以链接到个人中心
            }
        });
    } else {
        // 未登录
        loginLink.style.display = 'inline';
        usernameDisplay.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

// 获取当前用户信息
async function getCurrentUser() {
    try {
        const result = await apiClient.request('/auth/user');
        if (result.code === 200) {
            return result.data;
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
    return null;
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const messageClass = type === 'error' ? 'error-message' : 
                        type === 'success' ? 'success-message' : 'info-message';
    
    container.innerHTML = `<div class="${messageClass}">${message}</div>`;
    
    // 3秒后自动清除消息
    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}

// 扩展API客户端的登录和注册方法
window.apiClient.login = async function(username, password) {
    try {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (result.code === 200 && result.data.token) {
            this.updateToken(result.data.token);
            return { code: 200, message: '登录成功' };
        } else {
            return { code: result.code || 500, message: result.message || '登录失败' };
        }
    } catch (error) {
        return { code: 500, message: '网络错误，请稍后重试' };
    }
};

window.apiClient.register = async function(username, email, password) {
    try {
        const result = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        if (result.code === 200 && result.data.token) {
            this.updateToken(result.data.token);
            return { code: 200, message: '注册成功' };
        } else {
            return { code: result.code || 500, message: result.message || '注册失败' };
        }
    } catch (error) {
        return { code: 500, message: '网络错误，请稍后重试' };
    }
};

// 检查是否需要登录
function requireLogin() {
    if (!localStorage.getItem('token')) {
        if (confirm('需要登录才能进行此操作，是否现在登录？')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}