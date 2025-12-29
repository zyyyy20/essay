// 管理后台功能

let currentEditingArticle = null;
let categories = [];
let tags = [];

// 显示不同管理模块
function showSection(section) {
    // 隐藏所有section
    document.getElementById('articlesSection').style.display = 'none';
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('tagsSection').style.display = 'none';
    document.getElementById('articleFormSection').style.display = 'none';
    
    // 更新导航激活状态
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示对应section
    switch (section) {
        case 'articles':
            document.getElementById('articlesSection').style.display = 'block';
            document.querySelector('.admin-nav a[onclick="showSection(\'articles\')"]').classList.add('active');
            loadArticles();
            break;
        case 'categories':
            document.getElementById('categoriesSection').style.display = 'block';
            document.querySelector('.admin-nav a[onclick="showSection(\'categories\')"]').classList.add('active');
            loadCategories();
            break;
        case 'tags':
            document.getElementById('tagsSection').style.display = 'block';
            document.querySelector('.admin-nav a[onclick="showSection(\'tags\')"]').classList.add('active');
            loadTags();
            break;
    }
}

// 加载文章列表
async function loadArticles() {
    try {
        const result = await apiClient.getAllArticles(1, 20); // 后台显示更多文章
        if (result.code === 200) {
            displayAdminArticles(result.data.list);
        } else {
            showMessage('加载文章失败', 'error');
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        showMessage('加载文章失败', 'error');
    }
}

// 显示管理后台文章列表
function displayAdminArticles(articles) {
    const container = document.getElementById('articlesList');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="loading">暂无文章</div>';
        return;
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>浏览量</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    articles.forEach(article => {
        const statusText = article.published ? '已发布' : '草稿';
        const statusClass = article.published ? 'success-message' : 'info-message';
        
        html += `
            <tr>
                <td><a href="article.html?id=${article.id}" target="_blank">${escapeHtml(article.title)}</a></td>
                <td>${article.categoryName}</td>
                <td><span class="${statusClass}" style="padding: 0.25rem 0.5rem; border-radius: 3px;">${statusText}</span></td>
                <td>${article.viewCount}</td>
                <td>${formatDate(article.createdAt)}</td>
                <td>
                    <button onclick="editArticle(${article.id})" class="btn btn-primary" style="margin-right: 0.5rem;">编辑</button>
                    <button onclick="toggleArticleStatus(${article.id}, ${article.published})" class="btn btn-secondary" style="margin-right: 0.5rem;">${article.published ? '取消发布' : '发布'}</button>
                    <button onclick="deleteArticle(${article.id})" class="btn btn-secondary">删除</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// 显示创建文章表单
function showCreateArticleForm() {
    currentEditingArticle = null;
    document.getElementById('articleFormTitle').textContent = '新建文章';
    document.getElementById('articleForm').reset();
    
    // 加载分类和标签选项
    loadFormCategories();
    loadFormTags();
    
    // 显示表单，隐藏其他内容
    document.getElementById('articlesSection').style.display = 'none';
    document.getElementById('articleFormSection').style.display = 'block';
}

// 编辑文章
function editArticle(articleId) {
    currentEditingArticle = articleId;
    document.getElementById('articleFormTitle').textContent = '编辑文章';
    
    // 加载文章数据
    loadArticleForEdit(articleId);
    
    // 显示表单
    document.getElementById('articlesSection').style.display = 'none';
    document.getElementById('articleFormSection').style.display = 'block';
}

// 加载文章数据进行编辑
async function loadArticleForEdit(articleId) {
    try {
        const result = await apiClient.getArticleById(articleId);
        if (result.code === 200) {
            const article = result.data;
            document.getElementById('articleTitle').value = article.title;
            document.getElementById('articleSummary').value = article.summary || '';
            document.getElementById('articleContent').value = article.content;
            document.getElementById('articleCategory').value = article.categoryId;
            document.getElementById('articlePublished').checked = article.published;
            
            // 设置标签选中状态
            if (article.tags && article.tags.length > 0) {
                const tagIds = article.tags.map(tag => tag.id);
                document.querySelectorAll('#articleTagsContainer input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = tagIds.includes(parseInt(checkbox.value));
                });
            }
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        showMessage('加载文章失败', 'error');
    }
}

// 隐藏文章表单
function hideArticleForm() {
    document.getElementById('articleFormSection').style.display = 'none';
    document.getElementById('articlesSection').style.display = 'block';
    document.getElementById('articleForm').reset();
    currentEditingArticle = null;
}

// 保存文章
async function saveArticle(event) {
    event.preventDefault();
    
    const title = document.getElementById('articleTitle').value.trim();
    const summary = document.getElementById('articleSummary').value.trim();
    const content = document.getElementById('articleContent').value.trim();
    const categoryId = parseInt(document.getElementById('articleCategory').value);
    const published = document.getElementById('articlePublished').checked;
    
    if (!title || !content || !categoryId) {
        showMessage('请填写完整信息', 'error');
        return;
    }
    
    // 获取选中的标签
    const tagIds = [];
    document.querySelectorAll('#articleTagsContainer input[type="checkbox"]:checked').forEach(checkbox => {
        tagIds.push(parseInt(checkbox.value));
    });
    
    const article = {
        title,
        summary,
        content,
        categoryId,
        tagIds,
        published
    };
    
    try {
        let result;
        if (currentEditingArticle) {
            result = await apiClient.updateArticle(currentEditingArticle, article);
        } else {
            result = await apiClient.createArticle(article);
        }
        
        if (result.code === 200) {
            showMessage(currentEditingArticle ? '文章更新成功' : '文章创建成功', 'success');
            hideArticleForm();
            loadArticles(); // 重新加载文章列表
        } else {
            showMessage(result.message || '保存失败', 'error');
        }
    } catch (error) {
        console.error('保存文章失败:', error);
        showMessage('保存文章失败', 'error');
    }
}

// 切换文章发布状态
async function toggleArticleStatus(articleId, currentStatus) {
    if (!confirm(`确定要${currentStatus ? '取消发布' : '发布'}这篇文章吗？`)) {
        return;
    }
    
    try {
        const result = await apiClient.toggleArticlePublishStatus(articleId);
        if (result.code === 200) {
            showMessage(result.data, 'success');
            loadArticles(); // 重新加载文章列表
        } else {
            showMessage(result.message || '操作失败', 'error');
        }
    } catch (error) {
        console.error('切换文章状态失败:', error);
        showMessage('操作失败', 'error');
    }
}

// 删除文章
async function deleteArticle(articleId) {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        const result = await apiClient.deleteArticle(articleId);
        if (result.code === 200) {
            showMessage('文章删除成功', 'success');
            loadArticles(); // 重新加载文章列表
        } else {
            showMessage(result.message || '删除失败', 'error');
        }
    } catch (error) {
        console.error('删除文章失败:', error);
        showMessage('删除失败', 'error');
    }
}

// 加载表单分类选项
async function loadFormCategories() {
    try {
        const result = await apiClient.getCategories();
        if (result.code === 200) {
            categories = result.data;
            const select = document.getElementById('articleCategory');
            select.innerHTML = '<option value="">选择分类</option>';
            categories.forEach(category => {
                select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        }
    } catch (error) {
        console.error('加载分类失败:', error);
    }
}

// 加载表单标签选项
async function loadFormTags() {
    try {
        const result = await apiClient.getTags();
        if (result.code === 200) {
            tags = result.data;
            const container = document.getElementById('articleTagsContainer');
            container.innerHTML = '';
            tags.forEach(tag => {
                container.innerHTML += `
                    <label style="display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" value="${tag.id}"> ${tag.name}
                    </label>
                `;
            });
        }
    } catch (error) {
        console.error('加载标签失败:', error);
    }
}

// 分类管理
async function loadCategories() {
    try {
        const result = await apiClient.getCategories();
        if (result.code === 200) {
            displayAdminCategories(result.data);
        }
    } catch (error) {
        console.error('加载分类失败:', error);
        showMessage('加载分类失败', 'error');
    }
}

function displayAdminCategories(categories) {
    const container = document.getElementById('categoriesList');
    
    if (!categories || categories.length === 0) {
        container.innerHTML = '<div class="loading">暂无分类</div>';
        return;
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    categories.forEach(category => {
        html += `
            <tr>
                <td>${escapeHtml(category.name)}</td>
                <td>${escapeHtml(category.description || '')}</td>
                <td>${formatDate(category.createdAt)}</td>
                <td>
                    <button onclick="editCategory(${category.id})" class="btn btn-primary" style="margin-right: 0.5rem;">编辑</button>
                    <button onclick="deleteCategory(${category.id})" class="btn btn-secondary">删除</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showCreateCategoryForm() {
    const name = prompt('请输入分类名称：');
    if (!name) return;
    
    const description = prompt('请输入分类描述（可选）：');
    
    createCategory({ name, description });
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const name = prompt('请输入分类名称：', category.name);
    if (!name) return;
    
    const description = prompt('请输入分类描述（可选）：', category.description || '');
    
    updateCategory(id, { name, description });
}

async function createCategory(category) {
    try {
        const result = await apiClient.createCategory(category);
        if (result.code === 200) {
            showMessage('分类创建成功', 'success');
            loadCategories();
        } else {
            showMessage(result.message || '创建失败', 'error');
        }
    } catch (error) {
        console.error('创建分类失败:', error);
        showMessage('创建失败', 'error');
    }
}

async function updateCategory(id, category) {
    try {
        const result = await apiClient.updateCategory(id, category);
        if (result.code === 200) {
            showMessage('分类更新成功', 'success');
            loadCategories();
        } else {
            showMessage(result.message || '更新失败', 'error');
        }
    } catch (error) {
        console.error('更新分类失败:', error);
        showMessage('更新失败', 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('确定要删除这个分类吗？')) {
        return;
    }
    
    try {
        const result = await apiClient.deleteCategory(id);
        if (result.code === 200) {
            showMessage('分类删除成功', 'success');
            loadCategories();
        } else {
            showMessage(result.message || '删除失败', 'error');
        }
    } catch (error) {
        console.error('删除分类失败:', error);
        showMessage('删除失败', 'error');
    }
}

// 标签管理
async function loadTags() {
    try {
        const result = await apiClient.getTags();
        if (result.code === 200) {
            displayAdminTags(result.data);
        }
    } catch (error) {
        console.error('加载标签失败:', error);
        showMessage('加载标签失败', 'error');
    }
}

function displayAdminTags(tags) {
    const container = document.getElementById('tagsList');
    
    if (!tags || tags.length === 0) {
        container.innerHTML = '<div class="loading">暂无标签</div>';
        return;
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    tags.forEach(tag => {
        html += `
            <tr>
                <td>${escapeHtml(tag.name)}</td>
                <td>${formatDate(tag.createdAt)}</td>
                <td>
                    <button onclick="editTag(${tag.id})" class="btn btn-primary" style="margin-right: 0.5rem;">编辑</button>
                    <button onclick="deleteTag(${tag.id})" class="btn btn-secondary">删除</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showCreateTagForm() {
    const name = prompt('请输入标签名称：');
    if (!name) return;
    
    createTag({ name });
}

function editTag(id) {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;
    
    const name = prompt('请输入标签名称：', tag.name);
    if (!name) return;
    
    updateTag(id, { name });
}

async function createTag(tag) {
    try {
        const result = await apiClient.createTag(tag);
        if (result.code === 200) {
            showMessage('标签创建成功', 'success');
            loadTags();
        } else {
            showMessage(result.message || '创建失败', 'error');
        }
    } catch (error) {
        console.error('创建标签失败:', error);
        showMessage('创建失败', 'error');
    }
}

async function updateTag(id, tag) {
    try {
        const result = await apiClient.updateTag(id, tag);
        if (result.code === 200) {
            showMessage('标签更新成功', 'success');
            loadTags();
        } else {
            showMessage(result.message || '更新失败', 'error');
        }
    } catch (error) {
        console.error('更新标签失败:', error);
        showMessage('更新失败', 'error');
    }
}

async function deleteTag(id) {
    if (!confirm('确定要删除这个标签吗？')) {
        return;
    }
    
    try {
        const result = await apiClient.deleteTag(id);
        if (result.code === 200) {
            showMessage('标签删除成功', 'success');
            loadTags();
        } else {
            showMessage(result.message || '删除失败', 'error');
        }
    } catch (error) {
        console.error('删除标签失败:', error);
        showMessage('删除失败', 'error');
    }
}

// 工具函数
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}