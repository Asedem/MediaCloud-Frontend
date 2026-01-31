<script setup lang="ts">
import { watch, onUnmounted } from 'vue';

const props = defineProps<{ isOpen: boolean, id: number }>();
const emit = defineEmits(['close']);

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

watch(() => props.isOpen, (value) => {
  if (value) {
    document.addEventListener('keydown', handleEsc);
  } else {
    document.removeEventListener('keydown', handleEsc);
  }
}, { immediate: true });

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc);
});
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <img 
      :src="`/api/images/${props.id}/raw`" 
      alt="Preview" 
      class="fullscreen-preview"
    />
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.fullscreen-preview {
  max-width: 95dvw;
  max-height: 95dvh;
  border-radius: 16px;
  object-fit: contain;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>