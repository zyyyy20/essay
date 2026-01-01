<template>
  <div>
    <transition name="fade">
      <Spinner v-if="loading" />
    </transition>
    <div class="card" v-if="article">
      <h2>{{ article.title }}</h2>
      <div v-html="htmlContent"></div>
    </div>
    <div class="card">
      <h3>评论</h3>
      <div class="space"></div>
      <transition name="fade">
        <Spinner v-if="loadingComments" />
      </transition>
      <div v-for="c in comments" :key="c.id" class="card">
        <div>{{ c.content }}</div>
      </div>
      <div class="row">
        <input class="input" v-model="commentText" placeholder="写下你的评论..." />
        <button class="btn primary" @click="submitComment">发布</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '../api/client'
import Spinner from '../components/Spinner.vue'

const route = useRoute()
const id = Number(route.params.id)
const article = ref(null)
const comments = ref([])
const commentText = ref('')
const loading = ref(false)
const loadingComments = ref(false)
const htmlContent = computed(() => (article.value?.content || '').replace(/\n/g, '<br/>'))

async function load() {
  loading.value = true
  try {
    const r = await apiClient.getArticleById(id)
    article.value = r.data
  } finally {
    loading.value = false
  }
  loadingComments.value = true
  try {
    const cs = await apiClient.getCommentsByArticle(id)
    comments.value = cs.data || []
  } finally {
    loadingComments.value = false
  }
}
function submitComment() {
  if (!commentText.value) return
  apiClient.addComment(id, commentText.value).then(() => {
    commentText.value = ''; load()
  }).catch(() => {})
}
onMounted(load)
</script>
