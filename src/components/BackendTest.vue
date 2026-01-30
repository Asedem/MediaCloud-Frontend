<template>
  <div class="media-cloud-container">
    <h2>MediaCloud Image Manager</h2>

    <section class="upload-section">
      <h3>Upload New Image</h3>
      <div class="form-group">
        <input v-model="title" type="text" placeholder="Enter image title" />
        <input type="file" @change="handleFileChange" accept="image/*" />
        <button @click="uploadImage" :disabled="!file || !title">Upload & Encrypt</button>
      </div>
    </section>

    <hr />

    <section class="gallery-section">
      <h3>Stored Images</h3>
      <button @click="fetchImages">Refresh List</button>
      
      <div class="grid">
        <div v-for="img in images" :key="img.id" class="image-card">
          <img :src="`/api/images/${img.id}/raw`" :alt="img.title" />
          <div class="info">
            <strong>{{ img.title }}</strong>
            <span>ID: {{ img.id }}</span>
          </div>
        </div>
      </div>
      <p v-if="images.length === 0">No images found in database.</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

interface ImageMetadata {
  id: number;
  title: string;
}

export default defineComponent({
  name: 'ImageManager',
  setup() {
    const title = ref<string>('');
    const file = ref<File | null>(null);
    const images = ref<ImageMetadata[]>([]);

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        file.value = target.files[0];
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          images.value = await response.json();
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    const uploadImage = async () => {
      if (!file.value || !title.value) return;

      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('file', file.value);

      try {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          title.value = '';
          file.value = null;
          // Reset file input manually
          (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
          fetchImages();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    onMounted(fetchImages);

    return {
      title,
      file,
      images,
      handleFileChange,
      uploadImage,
      fetchImages
    };
  }
});
</script>

<style scoped>
.media-cloud-container {
  font-family: sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.upload-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
}

.form-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  text-align: center;
}

.image-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.info {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

button {
  cursor: pointer;
  padding: 5px 15px;
}

input[type="text"] {
  padding: 5px;
}
</style>