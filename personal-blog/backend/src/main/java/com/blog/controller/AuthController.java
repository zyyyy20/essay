package com.blog.controller;

import com.blog.dto.LoginRequest;
import com.blog.dto.RegisterRequest;
import com.blog.dto.Result;
import com.blog.entity.User;
import com.blog.service.UserService;
import com.blog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Result<String> result = userService.login(request);
        if (result.getCode() != 200) {
            return Result.error(result.getMessage());
        }
        
        String token = result.getData();
        User user = userService.getCurrentUser(request.getUsername());
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);
        
        return Result.success(data);
    }
    
    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Result<String> result = userService.register(request);
        if (result.getCode() != 200) {
            return Result.error(result.getMessage());
        }
        
        String token = result.getData();
        User user = userService.getCurrentUser(request.getUsername());
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);
        
        return Result.success(data);
    }
    
    @GetMapping("/user")
    public Result<User> getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String username = jwtUtils.getUsernameFromToken(token);
            if (username != null) {
                User user = userService.getCurrentUser(username);
                return Result.success(user);
            }
        }
        return Result.error("未登录");
    }
}