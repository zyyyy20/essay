package com.blog.service.impl;

import com.blog.dao.ArticleMapper;
import com.blog.dao.ArticleTagMapper;
import com.blog.dao.UserMapper;
import com.blog.entity.Article;
import com.blog.entity.User;
import com.blog.dto.ArticleRequest;
import com.blog.dto.PageResult;
import com.blog.dto.Result;
import com.blog.service.ArticleService;
import com.blog.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {
    
    @Autowired
    private ArticleMapper articleMapper;
    
    @Autowired
    private ArticleTagMapper articleTagMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private TagService tagService;
    
    @Override
    public Result<PageResult<Article>> getPublishedArticles(int page, int size) {
        int offset = (page - 1) * size;
        List<Article> articles = articleMapper.findPublishedArticles(offset, size);
        long total = articleMapper.countPublished();
        return Result.success(new PageResult<>(articles, total, page, size));
    }
    
    @Override
    public Result<PageResult<Article>> getPublishedArticlesByCategory(Integer categoryId, int page, int size) {
        int offset = (page - 1) * size;
        List<Article> articles = articleMapper.findPublishedArticlesByCategory(categoryId, offset, size);
        long total = articleMapper.countPublishedByCategory(categoryId);
        return Result.success(new PageResult<>(articles, total, page, size));
    }
    
    @Override
    public Result<PageResult<Article>> getPublishedArticlesByTag(Integer tagId, int page, int size) {
        int offset = (page - 1) * size;
        List<Article> articles = articleMapper.findPublishedArticlesByTag(tagId, offset, size);
        long total = articleMapper.countPublishedByTag(tagId);
        return Result.success(new PageResult<>(articles, total, page, size));
    }
    
    @Override
    public Result<PageResult<Article>> searchPublishedArticles(String keyword, int page, int size) {
        int offset = (page - 1) * size;
        List<Article> articles = articleMapper.searchPublishedArticles(keyword, offset, size);
        long total = articleMapper.countSearch(keyword);
        return Result.success(new PageResult<>(articles, total, page, size));
    }
    
    @Override
    public Result<Article> getArticleById(Integer id) {
        Article article = articleMapper.findById(id);
        if (article == null) {
            return Result.error("文章不存在");
        }
        
        // 增加浏览量
        articleMapper.incrementViewCount(id);
        article.setViewCount(article.getViewCount() + 1);
        
        // 加载标签
        article.setTags(tagService.getTagsByArticleId(id));
        
        return Result.success(article);
    }
    
    @Override
    public Result<PageResult<Article>> getAllArticles(int page, int size) {
        int offset = (page - 1) * size;
        List<Article> articles = articleMapper.findAll(offset, size);
        long total = articleMapper.countAll();
        return Result.success(new PageResult<>(articles, total, page, size));
    }
    
    @Override
    @Transactional
    public Result<String> createArticle(ArticleRequest request, String username) {
        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            return Result.error("标题和内容不能为空");
        }
        
        User user = userMapper.findByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setSummary(request.getSummary());
        article.setAuthorId(user.getId());
        article.setCategoryId(request.getCategoryId());
        article.setPublished(request.getPublished() != null ? request.getPublished() : false);
        
        articleMapper.insert(article);
        
        // 保存标签关联
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Integer tagId : request.getTagIds()) {
                articleTagMapper.insert(article.getId(), tagId);
            }
        }
        
        return Result.success("文章创建成功");
    }
    
    @Override
    @Transactional
    public Result<String> updateArticle(Integer id, ArticleRequest request) {
        if (id == null) {
            return Result.error("文章ID不能为空");
        }
        
        Article existing = articleMapper.findById(id);
        if (existing == null) {
            return Result.error("文章不存在");
        }
        
        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            return Result.error("标题和内容不能为空");
        }
        
        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());
        existing.setSummary(request.getSummary());
        existing.setCategoryId(request.getCategoryId());
        existing.setPublished(request.getPublished() != null ? request.getPublished() : existing.getPublished());
        
        articleMapper.update(existing);
        
        // 更新标签关联
        articleTagMapper.deleteByArticleId(id);
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Integer tagId : request.getTagIds()) {
                articleTagMapper.insert(id, tagId);
            }
        }
        
        return Result.success("文章更新成功");
    }
    
    @Override
    public Result<String> deleteArticle(Integer id) {
        if (id == null) {
            return Result.error("文章ID不能为空");
        }
        
        Article existing = articleMapper.findById(id);
        if (existing == null) {
            return Result.error("文章不存在");
        }
        
        articleMapper.deleteById(id);
        return Result.success("文章删除成功");
    }
    
    @Override
    public Result<String> togglePublishStatus(Integer id) {
        if (id == null) {
            return Result.error("文章ID不能为空");
        }
        
        Article existing = articleMapper.findById(id);
        if (existing == null) {
            return Result.error("文章不存在");
        }
        
        existing.setPublished(!existing.getPublished());
        articleMapper.update(existing);
        
        return Result.success(existing.getPublished() ? "文章已发布" : "文章已取消发布");
    }
}