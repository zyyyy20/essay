package com.blog.service;

import com.blog.entity.Comment;
import com.blog.dto.Result;
import java.util.List;

public interface CommentService {
    Result<List<Comment>> getCommentsByArticleId(Integer articleId);
    Result<String> addComment(Integer articleId, String content, String username);
    Result<String> deleteComment(Integer id);
}