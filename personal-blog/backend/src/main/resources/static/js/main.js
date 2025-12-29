// 主页面功能

// 加载文章列表
async function loadArticles(page = 1) {
    try {
        const result = await apiClient.getArticles(page);
        if (result.code === 200) {
            displayArticles(result.data.list);
            displayPagination(result.data, page, 'articles');
        } else {
            showMessage('加载文章失败', 'error');
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        showMessage('加载文章失败，请稍后重试', 'error');
    }
}

// 显示文章列表
function displayArticles(articles) {
    const container = document.getElementById('articlesContainer');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="loading">暂无文章</div>';
        return;
    }
    
    let html = '';
    articles.forEach(article => {
        html += `
            <div class="article-card">
                <div class="article-header">
                    <h2 class="article-title">
                        <a href="article.html?id=${article.id}">${article.title}</a>
                    </h2>
                    <div class="article-meta">
                        <span>作者：${article.authorName}</span>
                        <span>分类：${article.categoryName}</span>
                        <span>时间：${formatDate(article.createdAt)}</span>
                        <span>阅读：${article.viewCount}</span>
                    </div>
                    <div class="article-summary">
                        ${article.summary || article.content.substring(0, 200) + '...'}
                    </div>
                    <div class="article-tags">
                        ${displayTags(article.tags)}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 加载分类列表
async function loadCategories() {
    try {
        const result = await apiClient.getCategories();
        if (result.code === 200) {
            displayCategories(result.data);
        }
    } catch (error) {
        console.error('加载分类失败:', error);
    }
}

// 显示分类列表
function displayCategories(categories) {
    const container = document.getElementById('categoriesList');
    
    if (!categories || categories.length === 0) {
        container.innerHTML = '<li>暂无分类</li>';
        return;
    }
    
    let html = '';
    categories.forEach(category => {
        html += `
            <li>
                <a href="#" onclick="loadArticlesByCategory(${category.id}, 1); return false;">
                    ${category.name} (${category.description})
                </a>
            </li>
        `;
    });
    
    container.innerHTML = html;
}

// 加载标签云
async function loadTags() {
    try {
        const result = await apiClient.getTags();
        if (result.code === 200) {
            displayTagsCloud(result.data);
        }
    } catch (error) {
        console.error('加载标签失败:', error);
    }
}

// 显示标签云
function displayTagsCloud(tags) {
    const container = document.getElementById('tagsCloud');
    
    if (!tags || tags.length === 0) {
        container.innerHTML = '<div>暂无标签</div>';
        return;
    }
    
    let html = '';
    tags.forEach(tag => {
        html += `
            <a href="#" onclick="loadArticlesByTag(${tag.id}, 1); return false;" class="tag" style="margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">
                ${tag.name}
            </a>
        `;
    });
    
    container.innerHTML = html;
}

// 按分类加载文章
async function loadArticlesByCategory(categoryId, page = 1) {
    try {
        const result = await apiClient.getArticlesByCategory(categoryId, page);
        if (result.code === 200) {
            displayArticles(result.data.list);
            displayPagination(result.data, page, 'category', categoryId);
        }
    } catch (error) {
        console.error('加载分类文章失败:', error);
        showMessage('加载文章失败', 'error');
    }
}

// 按标签加载文章
async function loadArticlesByTag(tagId, page = 1) {
    try {
        const result = await apiClient.getArticlesByTag(tagId, page);
        if (result.code === 200) {
            displayArticles(result.data.list);
            displayPagination(result.data, page, 'tag', tagId);
        }
    } catch (error) {
        console.error('加载标签文章失败:', error);
        showMessage('加载文章失败', 'error');
    }
}

// 搜索文章
async function searchArticles() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) {
        showMessage('请输入搜索关键词', 'error');
        return;
    }
    
    try {
        const result = await apiClient.searchArticles(keyword, 1);
        if (result.code === 200) {
            displayArticles(result.data.list);
            displayPagination(result.data, 1, 'search', keyword);
        }
    } catch (error) {
        console.error('搜索文章失败:', error);
        showMessage('搜索失败，请稍后重试', 'error');
    }
}

// 显示分页
function displayPagination(data, currentPage, type, param) {
    const container = document.getElementById('paginationContainer');
    
    if (!data || data.pages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    const maxPages = 5; // 最多显示5页
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(data.pages, startPage + maxPages - 1);
    
    // 上一页
    if (currentPage > 1) {
        html += `<a href="#" onclick="loadPage(${currentPage - 1}, '${type}', '${param}'); return false;" class="page-link">上一页</a>`;
    }
    
    // 页码
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        html += `<a href="#" onclick="loadPage(${i}, '${type}', '${param}'); return false;" class="page-link ${activeClass}">${i}</a>`;
    }
    
    // 下一页
    if (currentPage < data.pages) {
        html += `<a href="#" onclick="loadPage(${currentPage + 1}, '${type}', '${param}'); return false;" class="page-link">下一页</a>`;
    }
    
    container.innerHTML = html;
}

// 加载指定页面
function loadPage(page, type, param) {
    switch (type) {
        case 'articles':
            loadArticles(page);
            break;
        case 'category':
            loadArticlesByCategory(param, page);
            break;
        case 'tag':
            loadArticlesByTag(param, page);
            break;
        case 'search':
            searchArticlesPage(param, page);
            break;
    }
}

// 搜索指定页面
async function searchArticlesPage(keyword, page) {
    try {
        const result = await apiClient.searchArticles(keyword, page);
        if (result.code === 200) {
            displayArticles(result.data.list);
            displayPagination(result.data, page, 'search', keyword);
        }
    } catch (error) {
        console.error('搜索文章失败:', error);
        showMessage('搜索失败，请稍后重试', 'error');
    }
}

// 显示标签
function displayTags(tags) {
    if (!tags || tags.length === 0) {
        return '';
    }
    
    let html = '';
    tags.forEach(tag => {
        html += `<a href="#" onclick="loadArticlesByTag(${tag.id}, 1); return false;" class="tag">${tag.name}</a>`;
    });
    
    return html;
}

// 格式化日期
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

// 显示分类文章
function showCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (categoriesList.style.display === 'none') {
        categoriesList.style.display = 'block';
    } else {
        categoriesList.style.display = 'none';
    }
}

// 显示标签云
function showTags() {
    const tagsCloud = document.getElementById('tagsCloud');
    if (tagsCloud.style.display === 'none') {
        tagsCloud.style.display = 'block';
    } else {
        tagsCloud.style.display = 'none';
    }
}

// 监听回车键搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArticles();
            }
        });
    }
});