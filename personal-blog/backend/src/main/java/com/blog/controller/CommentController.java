package com.blog.controller;

import com.blog.entity.Comment;
import com.blog.dto.Result;
import com.blog.service.CommentService;
import com.blog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @GetMapping("/article/{articleId}")
    public Result<List<Comment>> getCommentsByArticleId(@PathVariable Integer articleId) {
        return commentService.getCommentsByArticleId(articleId);
    }
    
    @PostMapping("/article/{articleId}")
    public Result<String> addComment(
            @PathVariable Integer articleId,
            @RequestParam String content,
            HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        String username = null;
        
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            username = jwtUtils.getUsernameFromToken(token);
        }
        
        return commentService.addComment(articleId, content, username);
    }
    
    @DeleteMapping("/{id}")
    public Result<String> deleteComment(@PathVariable Integer id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Result.error("未登录");
        }
        return commentService.deleteComment(id);
    }
}