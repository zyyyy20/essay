package com.blog.controller;

import com.blog.dto.ArticleRequest;
import com.blog.dto.PageResult;
import com.blog.dto.Result;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @GetMapping
    public Result<PageResult<Article>> getPublishedArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return articleService.getPublishedArticles(page, size);
    }
    
    @GetMapping("/category/{categoryId}")
    public Result<PageResult<Article>> getPublishedArticlesByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return articleService.getPublishedArticlesByCategory(categoryId, page, size);
    }
    
    @GetMapping("/tag/{tagId}")
    public Result<PageResult<Article>> getPublishedArticlesByTag(
            @PathVariable Integer tagId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return articleService.getPublishedArticlesByTag(tagId, page, size);
    }
    
    @GetMapping("/search")
    public Result<PageResult<Article>> searchPublishedArticles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return articleService.searchPublishedArticles(keyword, page, size);
    }
    
    @GetMapping("/{id}")
    public Result<Article> getArticleById(@PathVariable Integer id) {
        return articleService.getArticleById(id);
    }
    
    @GetMapping("/admin")
    public Result<PageResult<Article>> getAllArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        String username = getUsernameFromToken(request);
        if (username == null) {
            return Result.error("未登录");
        }
        return articleService.getAllArticles(page, size);
    }
    
    @PostMapping
    public Result<String> createArticle(@RequestBody ArticleRequest request, HttpServletRequest httpRequest) {
        String username = getUsernameFromToken(httpRequest);
        if (username == null) {
            return Result.error("未登录");
        }
        return articleService.createArticle(request, username);
    }
    
    @PutMapping("/{id}")
    public Result<String> updateArticle(@PathVariable Integer id, @RequestBody ArticleRequest request, HttpServletRequest httpRequest) {
        String username = getUsernameFromToken(httpRequest);
        if (username == null) {
            return Result.error("未登录");
        }
        return articleService.updateArticle(id, request);
    }
    
    @DeleteMapping("/{id}")
    public Result<String> deleteArticle(@PathVariable Integer id, HttpServletRequest request) {
        String username = getUsernameFromToken(request);
        if (username == null) {
            return Result.error("未登录");
        }
        return articleService.deleteArticle(id);
    }
    
    @PutMapping("/{id}/publish")
    public Result<String> togglePublishStatus(@PathVariable Integer id, HttpServletRequest request) {
        String username = getUsernameFromToken(request);
        if (username == null) {
            return Result.error("未登录");
        }
        return articleService.togglePublishStatus(id);
    }
    
    private String getUsernameFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return jwtUtils.getUsernameFromToken(token);
        }
        return null;
    }
}