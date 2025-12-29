-- admin user (password: admin123 bcrypt)
INSERT IGNORE INTO users (id, username, email, password_hash, role)
VALUES (1, 'admin', 'admin@blog.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iFJwKjLiR6Qp7XU6xKmXV7c8S5w2', 'ADMIN');

-- categories
INSERT IGNORE INTO categories (id, name, description) VALUES 
(1, '技术分享', '技术相关文章'),
(2, '生活随笔', '生活感悟和随笔'),
(3, '学习笔记', '学习过程中的笔记'),
(4, '项目实战', '项目开发经验分享'),
(5, '工具推荐', '实用工具和软件推荐');

-- tags
INSERT IGNORE INTO tags (id, name) VALUES 
(1, 'Java'), (2, 'Spring Boot'), (3, 'MySQL'), (4, 'MyBatis'), (5, 'JavaScript'),
(6, 'HTML'), (7, 'CSS'), (8, '前端'), (9, '后端'), (10, '数据库'),
(11, '算法'), (12, '设计模式'), (13, '架构'), (14, '微服务'), (15, '面试');

-- sample articles
INSERT IGNORE INTO articles (id, title, content, summary, author_id, category_id, published, view_count) VALUES 
(1, '欢迎使用个人博客系统', 
'# 欢迎使用个人博客系统\n\n这是一个基于Spring Boot + MyBatis + MySQL开发的个人博客系统。\n\n## 主要功能\n\n- 用户注册登录\n- 文章发布管理\n- 分类和标签管理\n- 评论系统\n- Markdown支持\n\n## 技术栈\n\n- 后端：Spring Boot 2.7.x\n- 数据库：MySQL 8.x\n- ORM：MyBatis\n- 前端：HTML + CSS + JavaScript\n\n开始你的博客之旅吧！', 
'个人博客系统介绍，包含主要功能和技术栈说明', 
1, 1, TRUE, 100),
(2, 'Spring Boot入门指南', 
'# Spring Boot入门指南\n\nSpring Boot是一个快速开发框架，可以简化Spring应用的初始化和开发过程。\n\n## 核心特性\n\n1. **自动配置**：根据类路径中的jar包自动配置Spring应用\n2. **起步依赖**：提供一系列starter依赖简化构建配置\n3. **Actuator**：提供应用监控和管理功能\n4. **命令行界面**：支持使用命令行运行和测试\n\n## 快速开始\n\n```java\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}\n```\n\n## 常用注解\n\n- `@SpringBootApplication`：主启动类注解\n- `@RestController`：RESTful控制器\n- `@RequestMapping`：请求映射\n- `@Autowired`：依赖注入\n\n学习Spring Boot，开启微服务开发之旅！', 
'Spring Boot框架入门教程，包含核心特性和快速开始指南', 
1, 1, TRUE, 85);

-- article tags
INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), 
(2, 1), (2, 2), (2, 9), (2, 13);

-- comments
INSERT IGNORE INTO comments (article_id, user_id, content) VALUES 
(1, 1, '很不错的博客系统，界面简洁美观！'),
(1, 1, 'Markdown支持很棒，代码高亮效果不错。'),
(2, 1, 'Spring Boot确实是开发利器，学习了！');
