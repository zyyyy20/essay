package com.blog.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageResult<T> {
    private List<T> list;
    private long total;
    private int pages;
    private int page;
    private int size;
    
    public PageResult() {}
    
    public PageResult(List<T> list, long total, int page, int size) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
        this.pages = (int) Math.ceil((double) total / size);
    }
}