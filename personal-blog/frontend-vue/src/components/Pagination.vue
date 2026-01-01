<template>
  <div class="row" v-if="pages > 1">
    <button class="btn" :disabled="page<=1" @click="$emit('change', page-1)">上一页</button>
    <span>第 {{ page }} / {{ pages }} 页</span>
    <button class="btn" :disabled="page>=pages" @click="$emit('change', page+1)">下一页</button>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({ page: Number, size: Number, pages: Number })
</script>
