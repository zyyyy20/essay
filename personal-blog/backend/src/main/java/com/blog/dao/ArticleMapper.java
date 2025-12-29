package com.blog.dao;

import com.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ArticleMapper {
    List<Article> findPublishedArticles(@Param("offset") int offset, @Param("limit") int limit);
    List<Article> findPublishedArticlesByCategory(@Param("categoryId") Integer categoryId, @Param("offset") int offset, @Param("limit") int limit);
    List<Article> findPublishedArticlesByTag(@Param("tagId") Integer tagId, @Param("offset") int offset, @Param("limit") int limit);
    List<Article> searchPublishedArticles(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    
    Article findById(@Param("id") Integer id);
    List<Article> findAll(@Param("offset") int offset, @Param("limit") int limit);
    long countPublished();
    long countPublishedByCategory(@Param("categoryId") Integer categoryId);
    long countPublishedByTag(@Param("tagId") Integer tagId);
    long countSearch(@Param("keyword") String keyword);
    long countAll();
    
    void insert(Article article);
    void update(Article article);
    void deleteById(@Param("id") Integer id);
    void incrementViewCount(@Param("id") Integer id);
}