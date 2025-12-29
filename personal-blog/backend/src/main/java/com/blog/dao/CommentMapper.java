package com.blog.dao;

import com.blog.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface CommentMapper {
    List<Comment> findByArticleId(@Param("articleId") Integer articleId);
    void insert(Comment comment);
    void deleteById(@Param("id") Integer id);
    void deleteByArticleId(@Param("articleId") Integer articleId);
}