// 文章详情页面功能

// 加载文章详情
async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        showMessage('文章ID不存在', 'error');
        return;
    }
    
    try {
        const result = await apiClient.getArticleById(articleId);
        if (result.code === 200) {
            displayArticle(result.data);
            loadComments(articleId);
        } else {
            showMessage('文章不存在', 'error');
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        showMessage('加载文章失败，请稍后重试', 'error');
    }
}

// 显示文章详情
function displayArticle(article) {
    const container = document.getElementById('articleContainer');
    
    // 渲染Markdown内容
    const renderedContent = marked.parse(article.content);
    
    let html = `
        <div class="article-detail">
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span>作者：${article.authorName}</span>
                <span>分类：${article.categoryName}</span>
                <span>时间：${formatDate(article.createdAt)}</span>
                <span>阅读：${article.viewCount}</span>
            </div>
            <div class="article-tags">
                ${displayTags(article.tags)}
            </div>
            <div class="article-content">
                ${renderedContent}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // 高亮代码块
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
}

// 加载评论
async function loadComments(articleId) {
    try {
        const result = await apiClient.getCommentsByArticle(articleId);
        if (result.code === 200) {
            displayComments(result.data);
        }
    } catch (error) {
        console.error('加载评论失败:', error);
    }
}

// 显示评论列表
function displayComments(comments) {
    const container = document.getElementById('commentsList');
    const commentsSection = document.getElementById('commentsSection');
    
    if (!comments || comments.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">暂无评论，快来发表第一条评论吧！</div>';
        commentsSection.style.display = 'block';
        return;
    }
    
    let html = '';
    comments.forEach(comment => {
        html += `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.userName}</span>
                    <span class="comment-time">${formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-content">
                    ${escapeHtml(comment.content)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    commentsSection.style.display = 'block';
}

// 提交评论
async function submitComment() {
    if (!requireLogin()) {
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const content = document.getElementById('commentContent').value.trim();
    
    if (!content) {
        showMessage('请输入评论内容', 'error');
        return;
    }
    
    if (content.length < 2) {
        showMessage('评论内容至少需要2个字符', 'error');
        return;
    }
    
    if (content.length > 500) {
        showMessage('评论内容不能超过500个字符', 'error');
        return;
    }
    
    try {
        const result = await apiClient.addComment(articleId, content);
        if (result.code === 200) {
            showMessage('评论发表成功', 'success');
            document.getElementById('commentContent').value = '';
            loadComments(articleId); // 重新加载评论
        } else {
            showMessage(result.message || '评论发表失败', 'error');
        }
    } catch (error) {
        console.error('发表评论失败:', error);
        showMessage('发表评论失败，请稍后重试', 'error');
    }
}

// HTML转义函数
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

// 显示标签
function displayTags(tags) {
    if (!tags || tags.length === 0) {
        return '';
    }
    
    let html = '';
    tags.forEach(tag => {
        html += `<a href="index.html?tag=${tag.id}" class="tag">${tag.name}</a>`;
    });
    
    return html;
}

// 监听回车键提交评论
document.addEventListener('DOMContentLoaded', function() {
    const commentContent = document.getElementById('commentContent');
    if (commentContent) {
        commentContent.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });
    }
});