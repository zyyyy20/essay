package com.blog.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer id;
    private Integer articleId;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
    
    // 关联字段
    private String userName;
}