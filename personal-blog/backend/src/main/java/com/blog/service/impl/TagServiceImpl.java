package com.blog.service.impl;

import com.blog.dao.ArticleTagMapper;
import com.blog.dao.TagMapper;
import com.blog.entity.Tag;
import com.blog.dto.Result;
import com.blog.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Autowired
    private TagMapper tagMapper;

    @Override
    public List<Tag> getTagsByArticleId(Integer articleId) {
        return articleTagMapper.findTagsByArticleId(articleId);
    }

    @Override
    public Result<List<Tag>> getAllTags() {
        List<Tag> tags = tagMapper.findAll();
        return Result.success(tags);
    }

    @Override
    public Result<Tag> getTagById(Integer id) {
        Tag tag = tagMapper.findById(id);
        if (tag == null) {
            return Result.error("标签不存在");
        }
        return Result.success(tag);
    }

    @Override
    public Result<String> addTag(Tag tag) {
        if (!StringUtils.hasText(tag.getName())) {
            return Result.error("标签名称不能为空");
        }
        tagMapper.insert(tag);
        return Result.success("标签添加成功");
    }

    @Override
    public Result<String> updateTag(Tag tag) {
        if (tag.getId() == null) {
            return Result.error("标签ID不能为空");
        }
        if (!StringUtils.hasText(tag.getName())) {
            return Result.error("标签名称不能为空");
        }
        Tag existing = tagMapper.findById(tag.getId());
        if (existing == null) {
            return Result.error("标签不存在");
        }
        tagMapper.update(tag);
        return Result.success("标签更新成功");
    }

    @Override
    public Result<String> deleteTag(Integer id) {
        if (id == null) {
            return Result.error("标签ID不能为空");
        }
        Tag existing = tagMapper.findById(id);
        if (existing == null) {
            return Result.error("标签不存在");
        }
        tagMapper.deleteById(id);
        articleTagMapper.deleteByTagId(id);
        return Result.success("标签删除成功");
    }
}
