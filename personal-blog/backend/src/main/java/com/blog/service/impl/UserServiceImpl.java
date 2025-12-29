package com.blog.service.impl;

import com.blog.dao.UserMapper;
import com.blog.entity.User;
import com.blog.dto.LoginRequest;
import com.blog.dto.RegisterRequest;
import com.blog.dto.Result;
import com.blog.service.UserService;
import com.blog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public Result<String> login(LoginRequest request) {
        if (!StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            return Result.error("用户名和密码不能为空");
        }
        
        User user = userMapper.findByUsername(request.getUsername());
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return Result.error("用户名或密码错误");
        }
        
        String token = jwtUtils.generateToken(user.getUsername());
        return Result.success(token);
    }
    
    @Override
    public Result<String> register(RegisterRequest request) {
        if (!StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getEmail()) || !StringUtils.hasText(request.getPassword())) {
            return Result.error("请填写完整信息");
        }
        
        if (userMapper.findByUsername(request.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        
        if (userMapper.findByEmail(request.getEmail()) != null) {
            return Result.error("邮箱已被注册");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        
        userMapper.insert(user);
        
        String token = jwtUtils.generateToken(user.getUsername());
        return Result.success(token);
    }
    
    @Override
    public User getCurrentUser(String username) {
        return userMapper.findByUsername(username);
    }
}