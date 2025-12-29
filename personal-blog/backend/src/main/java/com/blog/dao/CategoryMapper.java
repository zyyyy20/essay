package com.blog.dao;

import com.blog.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
    Category findById(@Param("id") Integer id);
    void insert(Category category);
    void update(Category category);
    void deleteById(@Param("id") Integer id);
}