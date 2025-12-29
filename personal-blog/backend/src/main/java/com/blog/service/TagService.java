package com.blog.service;

import com.blog.entity.Tag;
import com.blog.dto.Result;
import java.util.List;

public interface TagService {
    List<Tag> getTagsByArticleId(Integer articleId);

    Result<List<Tag>> getAllTags();
    Result<Tag> getTagById(Integer id);
    Result<String> addTag(Tag tag);
    Result<String> updateTag(Tag tag);
    Result<String> deleteTag(Integer id);
}
