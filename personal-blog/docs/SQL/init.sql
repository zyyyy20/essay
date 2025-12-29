-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- 标签表
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- 文章表
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    view_count INT DEFAULT 0,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_published (published),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 文章标签关联表
CREATE TABLE article_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_article_tag (article_id, tag_id),
    INDEX idx_tag (tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 评论表
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_article (article_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at DESC),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 初始化管理员用户 (密码: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@blog.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iFJwKjLiR6Qp7XU6xKmXV7c8S5w2', 'ADMIN');

-- 初始化分类数据
INSERT INTO categories (name, description) VALUES 
('技术分享', '技术相关文章'),
('生活随笔', '生活感悟和随笔'),
('学习笔记', '学习过程中的笔记'),
('项目实战', '项目开发经验分享'),
('工具推荐', '实用工具和软件推荐');

-- 初始化标签数据
INSERT INTO tags (name) VALUES 
('Java'), ('Spring Boot'), ('MySQL'), ('MyBatis'), ('JavaScript'),
('HTML'), ('CSS'), ('前端'), ('后端'), ('数据库'),
('算法'), ('设计模式'), ('架构'), ('微服务'), ('面试');

-- 初始化示例文章
INSERT INTO articles (title, content, summary, author_id, category_id, published, view_count) VALUES 
('欢迎使用个人博客系统', 
'# 欢迎使用个人博客系统\n\n这是一个基于Spring Boot + MyBatis + MySQL开发的个人博客系统。\n\n## 主要功能\n\n- 用户注册登录\n- 文章发布管理\n- 分类和标签管理\n- 评论系统\n- Markdown支持\n\n## 技术栈\n\n- 后端：Spring Boot 2.7.x\n- 数据库：MySQL 8.x\n- ORM：MyBatis\n- 前端：HTML + CSS + JavaScript\n\n开始你的博客之旅吧！', 
'个人博客系统介绍，包含主要功能和技术栈说明', 
1, 1, TRUE, 100);

INSERT INTO articles (title, content, summary, author_id, category_id, published, view_count) VALUES 
('Spring Boot入门指南', 
'# Spring Boot入门指南\n\nSpring Boot是一个快速开发框架，可以简化Spring应用的初始化和开发过程。\n\n## 核心特性\n\n1. **自动配置**：根据类路径中的jar包自动配置Spring应用\n2. **起步依赖**：提供一系列starter依赖简化构建配置\n3. **Actuator**：提供应用监控和管理功能\n4. **命令行界面**：支持使用命令行运行和测试\n\n## 快速开始\n\n```java\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}\n```\n\n## 常用注解\n\n- `@SpringBootApplication`：主启动类注解\n- `@RestController`：RESTful控制器\n- `@RequestMapping`：请求映射\n- `@Autowired`：依赖注入\n\n学习Spring Boot，开启微服务开发之旅！', 
'Spring Boot框架入门教程，包含核心特性和快速开始指南', 
1, 1, TRUE, 85);

-- 为示例文章添加标签
INSERT INTO article_tags (article_id, tag_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), 
(2, 1), (2, 2), (2, 9), (2, 13);

-- 初始化示例评论
INSERT INTO comments (article_id, user_id, content) VALUES 
(1, 1, '很不错的博客系统，界面简洁美观！'),
(1, 1, 'Markdown支持很棒，代码高亮效果不错。'),
(2, 1, 'Spring Boot确实是开发利器，学习了！');