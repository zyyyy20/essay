package com.blog.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String username;
    private String email;
    private String passwordHash;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}