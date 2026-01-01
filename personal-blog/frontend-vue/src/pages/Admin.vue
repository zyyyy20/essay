<template>
  <div>
    <h2>管理后台</h2>
    <div class="space"></div>
    <div class="card">
      <h3>文章管理</h3>
      <div class="row">
        <button class="btn" @click="loadArticles">刷新</button>
        <button class="btn primary" @click="createSampleArticle">发布示例文章</button>
      </div>
      <div class="space"></div>
      <div v-for="a in articles" :key="a.id" class="card">
        <strong>{{ a.title }}</strong>
        <div class="row">
          <button class="btn" @click="togglePublish(a.id)">切换发布</button>
          <button class="btn" @click="removeArticle(a.id)">删除</button>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>分类</h3>
        <div class="row">
          <input class="input" v-model="categoryName" placeholder="分类名称"/>
          <button class="btn primary" @click="addCategory">新增</button>
        </div>
        <ul>
          <li v-for="c in categories" :key="c.id">
            {{ c.name }}
            <button class="btn" @click="deleteCategory(c.id)">删除</button>
          </li>
        </ul>
      </div>
      <div class="card">
        <h3>标签</h3>
        <div class="row">
          <input class="input" v-model="tagName" placeholder="标签名称"/>
          <button class="btn primary" @click="addTag">新增</button>
        </div>
        <div>
          <button v-for="t in tags" :key="t.id" class="btn" style="margin:4px" @click="deleteTag(t.id)">{{ t.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { apiClient } from '../api/client'

const articles = ref([])
const categories = ref([])
const tags = ref([])
const categoryName = ref('')
const tagName = ref('')

async function loadArticles() {
  const res = await apiClient.getAllArticles(1, 10)
  articles.value = res.data.list || []
}
async function loadMeta() {
  categories.value = (await apiClient.getCategories()).data || []
  tags.value = (await apiClient.getTags()).data || []
}
async function togglePublish(id) { await apiClient.toggleArticlePublishStatus(id); loadArticles() }
async function removeArticle(id) { await apiClient.deleteArticle(id); loadArticles() }
async function createSampleArticle() {
  const article = { title: 'Vue 3 迁移示例', content: '示例内容', summary: '示例摘要', categoryId: 1, tagIds: [1,2], published: true }
  await apiClient.createArticle(article)
  loadArticles()
}
async function addCategory() {
  if (!categoryName.value) return
  await apiClient.createCategory({ name: categoryName.value, description: '' })
  categoryName.value = ''; loadMeta()
}
async function addTag() {
  if (!tagName.value) return
  await apiClient.createTag({ name: tagName.value })
  tagName.value = ''; loadMeta()
}
async function deleteCategory(id) { await apiClient.deleteCategory(id); loadMeta() }
async function deleteTag(id) { await apiClient.deleteTag(id); loadMeta() }

onMounted(() => { loadArticles(); loadMeta() })
</script>
