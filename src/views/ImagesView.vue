<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import UploadModal from '@/components/UploadModal.vue'

interface ImageMetadata { id: number; title: string; }
const images = ref<ImageMetadata[]>([]);
const isModalOpen = ref(false);

const fetchImages = async () => {
  try {
    const response = await fetch('/api/images');
    if (response.ok) images.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch images:", error);
  }
};

onMounted(fetchImages);
</script>

<template>
  <main>
    <div class="header">
      <SearchBar class="search"></SearchBar>
      <div class="vertical-line"></div>
      <GradientButton class="new" @click="isModalOpen = true">
        <template #text>Upload Media</template>
      </GradientButton>
    </div>

    <div class="filter">
      <GradientButton class="all" @click="fetchImages">
        <template #text>Show all Media</template>
      </GradientButton>
    </div>

    <UploadModal 
      :isOpen="isModalOpen" 
      @close="isModalOpen = false" 
      @uploaded="fetchImages" 
    />

    <div class="gallery">
       <div v-for="img in images" :key="img.id" class="image-card">
          <img :src="`/api/images/${img.id}/raw`" :alt="img.title" />
          <p>{{ img.title }}</p>
       </div>
    </div>
  </main>
</template>

<style scoped>
.header, .filter {
  width: 100%;
  height: 5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0 32px;
}

.search {
    width: 100%;
}

.vertical-line {
  border-left: 1px solid var(--color-border);
  height: 1.5em;
  margin: 0 16px;
}

/* Temporary for displaying images */
.gallery {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.image-card img { width: 100%; border-radius: 8px; }
</style>