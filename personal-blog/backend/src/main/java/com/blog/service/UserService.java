package com.blog.service;

import com.blog.entity.User;
import com.blog.dto.LoginRequest;
import com.blog.dto.RegisterRequest;
import com.blog.dto.Result;

public interface UserService {
    Result<String> login(LoginRequest request);
    Result<String> register(RegisterRequest request);
    User getCurrentUser(String username);
}