<template>
  <div>
    <div class="hero">
      <div class="row">
        <input class="input" v-model="keyword" placeholder="搜索文章..." @keyup.enter="onSearch" />
        <button class="btn primary" @click="onSearch">搜索</button>
      </div>
      <div class="space"></div>
      <div class="muted">支持按关键字、分类或标签筛选</div>
    </div>
    <div class="space"></div>
    <div class="grid">
      <div>
        <transition name="fade">
          <Spinner v-if="loading" />
        </transition>
        <div v-for="a in articles" :key="a.id" class="card">
          <h3><router-link :to="'/article/' + a.id">{{ a.title }}</router-link></h3>
          <p>{{ a.summary }}</p>
          <div class="meta">作者：{{ a.authorName }} <span class="badge">{{ a.categoryName }}</span> 浏览：{{ a.viewCount }}</div>
        </div>
        <Pagination :page="page" :size="size" :pages="pages" @change="onPage"/>
      </div>
      <aside>
        <div class="card">
          <h3>分类</h3>
          <ul>
            <li v-for="c in categories" :key="c.id"><a href="#" @click.prevent="filterByCategory(c.id)">{{ c.name }}</a></li>
          </ul>
        </div>
        <div class="card">
          <h3>标签</h3>
          <div>
            <TagChip v-for="t in tags" :key="t.id" :name="t.name" @click="filterByTag(t.id)" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { apiClient } from '../api/client'
import Pagination from '../components/Pagination.vue'
import Spinner from '../components/Spinner.vue'
import TagChip from '../components/TagChip.vue'

const articles = ref([])
const page = ref(1)
const size = ref(10)
const pages = ref(1)
const categories = ref([])
const tags = ref([])
const keyword = ref('')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await apiClient.getArticles(page.value, size.value)
    articles.value = res.data.list || []
    pages.value = res.data.pages || 1
  } finally {
    loading.value = false
  }
}
async function loadMeta() {
  const cs = await apiClient.getCategories()
  categories.value = cs.data || []
  const ts = await apiClient.getTags()
  tags.value = ts.data || []
}
function onPage(p) { page.value = p; load() }
function onSearch() {
  if (!keyword.value) return load()
  apiClient.searchArticles(keyword.value, 1, size.value).then(res => {
    articles.value = res.data.list || []; pages.value = res.data.pages || 1; page.value = 1
  })
}
function filterByCategory(id) {
  fetch(`/api/articles/category/${id}?page=1&size=${size.value}`).then(r => r.json()).then(res => {
    articles.value = res.data.list || []; pages.value = res.data.pages || 1; page.value = 1
  })
}
function filterByTag(id) {
  fetch(`/api/articles/tag/${id}?page=1&size=${size.value}`).then(r => r.json()).then(res => {
    articles.value = res.data.list || []; pages.value = res.data.pages || 1; page.value = 1
  })
}
onMounted(() => { load(); loadMeta() })
</script>
