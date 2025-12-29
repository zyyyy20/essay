package com.blog.service;

import com.blog.entity.Article;
import com.blog.dto.ArticleRequest;
import com.blog.dto.PageResult;
import com.blog.dto.Result;

public interface ArticleService {
    Result<PageResult<Article>> getPublishedArticles(int page, int size);
    Result<PageResult<Article>> getPublishedArticlesByCategory(Integer categoryId, int page, int size);
    Result<PageResult<Article>> getPublishedArticlesByTag(Integer tagId, int page, int size);
    Result<PageResult<Article>> searchPublishedArticles(String keyword, int page, int size);
    Result<Article> getArticleById(Integer id);
    Result<PageResult<Article>> getAllArticles(int page, int size);
    Result<String> createArticle(ArticleRequest request, String username);
    Result<String> updateArticle(Integer id, ArticleRequest request);
    Result<String> deleteArticle(Integer id);
    Result<String> togglePublishStatus(Integer id);
}