<template>
  <span class="chip" @click="$emit('click')">{{ name }}</span>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({ name: String })
</script>
