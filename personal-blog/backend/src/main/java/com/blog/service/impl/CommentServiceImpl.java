package com.blog.service.impl;

import com.blog.dao.CommentMapper;
import com.blog.dao.UserMapper;
import com.blog.entity.Comment;
import com.blog.entity.User;
import com.blog.dto.Result;
import com.blog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    
    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public Result<List<Comment>> getCommentsByArticleId(Integer articleId) {
        if (articleId == null) {
            return Result.error("文章ID不能为空");
        }
        
        List<Comment> comments = commentMapper.findByArticleId(articleId);
        return Result.success(comments);
    }
    
    @Override
    public Result<String> addComment(Integer articleId, String content, String username) {
        if (articleId == null) {
            return Result.error("文章ID不能为空");
        }
        
        if (!StringUtils.hasText(content)) {
            return Result.error("评论内容不能为空");
        }
        
        if (!StringUtils.hasText(username)) {
            return Result.error("请先登录");
        }
        
        User user = userMapper.findByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Comment comment = new Comment();
        comment.setArticleId(articleId);
        comment.setUserId(user.getId());
        comment.setContent(content);
        
        commentMapper.insert(comment);
        return Result.success("评论发表成功");
    }
    
    @Override
    public Result<String> deleteComment(Integer id) {
        if (id == null) {
            return Result.error("评论ID不能为空");
        }
        
        commentMapper.deleteById(id);
        return Result.success("评论删除成功");
    }
}