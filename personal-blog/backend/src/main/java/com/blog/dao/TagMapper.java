package com.blog.dao;

import com.blog.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface TagMapper {
    List<Tag> findAll();
    Tag findById(@Param("id") Integer id);
    void insert(Tag tag);
    void update(Tag tag);
    void deleteById(@Param("id") Integer id);
}