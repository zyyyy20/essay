package com.blog.service.impl;

import com.blog.dao.CategoryMapper;
import com.blog.entity.Category;
import com.blog.dto.Result;
import com.blog.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Override
    public Result<List<Category>> getAllCategories() {
        List<Category> categories = categoryMapper.findAll();
        return Result.success(categories);
    }
    
    @Override
    public Result<Category> getCategoryById(Integer id) {
        Category category = categoryMapper.findById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }
        return Result.success(category);
    }
    
    @Override
    public Result<String> addCategory(Category category) {
        if (!StringUtils.hasText(category.getName())) {
            return Result.error("分类名称不能为空");
        }
        
        categoryMapper.insert(category);
        return Result.success("分类添加成功");
    }
    
    @Override
    public Result<String> updateCategory(Category category) {
        if (category.getId() == null) {
            return Result.error("分类ID不能为空");
        }
        
        if (!StringUtils.hasText(category.getName())) {
            return Result.error("分类名称不能为空");
        }
        
        Category existing = categoryMapper.findById(category.getId());
        if (existing == null) {
            return Result.error("分类不存在");
        }
        
        categoryMapper.update(category);
        return Result.success("分类更新成功");
    }
    
    @Override
    public Result<String> deleteCategory(Integer id) {
        if (id == null) {
            return Result.error("分类ID不能为空");
        }
        
        Category existing = categoryMapper.findById(id);
        if (existing == null) {
            return Result.error("分类不存在");
        }
        
        categoryMapper.deleteById(id);
        return Result.success("分类删除成功");
    }
}