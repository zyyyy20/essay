package com.blog.controller;

import com.blog.entity.Category;
import com.blog.dto.Result;
import com.blog.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public Result<java.util.List<Category>> getAllCategories() {
        return categoryService.getAllCategories();
    }
    
    @GetMapping("/{id}")
    public Result<Category> getCategoryById(@PathVariable Integer id) {
        return categoryService.getCategoryById(id);
    }
    
    @PostMapping
    public Result<String> addCategory(@RequestBody Category category, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        return categoryService.addCategory(category);
    }
    
    @PutMapping("/{id}")
    public Result<String> updateCategory(@PathVariable Integer id, @RequestBody Category category, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        category.setId(id);
        return categoryService.updateCategory(category);
    }
    
    @DeleteMapping("/{id}")
    public Result<String> deleteCategory(@PathVariable Integer id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        return categoryService.deleteCategory(id);
    }
}
