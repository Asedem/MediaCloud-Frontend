<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'uploaded']);

const title = ref<string>('');
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
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
      if (fileInput.value) fileInput.value.value = '';
      emit('uploaded'); // Tell parent to refresh list
      emit('close');    // Close the modal
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h3>Upload New Image</h3>
      <div class="form-group">
        <input v-model="title" type="text" placeholder="Enter image title" class="modal-input" />
        <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" class="modal-file" />
        
        <div class="actions">
          <button @click="emit('close')" class="btn-secondary">Cancel</button>
          <button @click="uploadImage" :disabled="!file || !title" class="btn-primary">
            Upload & Encrypt
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>