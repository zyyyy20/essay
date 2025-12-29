package com.blog.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.blog.entity.Tag;
import java.util.List;

@Mapper
public interface ArticleTagMapper {
    void insert(@Param("articleId") Integer articleId, @Param("tagId") Integer tagId);
    void deleteByArticleId(@Param("articleId") Integer articleId);
    void deleteByTagId(@Param("tagId") Integer tagId);
    List<Tag> findTagsByArticleId(@Param("articleId") Integer articleId);
    List<Integer> findArticleIdsByTagId(@Param("tagId") Integer tagId);
}