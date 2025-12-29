package com.blog.dao;

import com.blog.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);
    User findByEmail(@Param("email") String email);
    User findById(@Param("id") Integer id);
    void insert(User user);
}