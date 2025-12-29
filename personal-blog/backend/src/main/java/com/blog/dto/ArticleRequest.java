package com.blog.dto;

import lombok.Data;
import java.util.List;

@Data
public class ArticleRequest {
    private String title;
    private String content;
    private String summary;
    private Integer categoryId;
    private List<Integer> tagIds;
    private Boolean published;
}