package com.blog.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Article {
    private Integer id;
    private String title;
    private String content;
    private String summary;
    private Integer authorId;
    private Integer categoryId;
    private Integer viewCount;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 关联字段
    private String authorName;
    private String categoryName;
    private List<Tag> tags;
}