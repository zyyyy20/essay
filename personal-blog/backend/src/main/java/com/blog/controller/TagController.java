package com.blog.controller;

import com.blog.entity.Tag;
import com.blog.dto.Result;
import com.blog.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {
    
    @Autowired
    private TagService tagService;
    
    @GetMapping
    public Result<java.util.List<Tag>> getAllTags() {
        return tagService.getAllTags();
    }
    
    @GetMapping("/{id}")
    public Result<Tag> getTagById(@PathVariable Integer id) {
        return tagService.getTagById(id);
    }
    
    @PostMapping
    public Result<String> addTag(@RequestBody Tag tag, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        return tagService.addTag(tag);
    }
    
    @PutMapping("/{id}")
    public Result<String> updateTag(@PathVariable Integer id, @RequestBody Tag tag, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        tag.setId(id);
        return tagService.updateTag(tag);
    }
    
    @DeleteMapping("/{id}")
    public Result<String> deleteTag(@PathVariable Integer id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        return tagService.deleteTag(id);
    }
}
