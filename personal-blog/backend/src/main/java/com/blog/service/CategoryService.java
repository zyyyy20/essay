package com.blog.service;

import com.blog.entity.Category;
import com.blog.dto.Result;
import java.util.List;

public interface CategoryService {
    Result<List<Category>> getAllCategories();
    Result<Category> getCategoryById(Integer id);
    Result<String> addCategory(Category category);
    Result<String> updateCategory(Category category);
    Result<String> deleteCategory(Integer id);
}