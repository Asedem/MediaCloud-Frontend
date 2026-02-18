<script setup lang="ts">
import type { Tag } from '@/models/tag'
import TagDisplay from './TagDisplay.vue'

defineProps<{ id: number; title: string; tags: Tag[] }>()
const emit = defineEmits(['open', 'delete', 'edit'])
</script>

<template>
	<div class="image-card">
		<div class="image-container">
			<img :src="`/api/images/${id}/preview`" :alt="title" class="card-img" @click="emit('open')" />

			<div class="card-overlay">
				<div class="action-group">
					<button class="glass-btn" @click.stop="emit('edit')">Edit</button>
					<button class="glass-btn delete" @click.stop="emit('delete')">Delete</button>
				</div>
			</div>
		</div>

		<div class="card-body">
			<h2 class="card-title">{{ title }}</h2>
			<div class="tag-row">
				<TagDisplay v-for="tag in tags" :key="tag.id" :color="tag.color">
					<template #text>{{ tag.title }}</template>
				</TagDisplay>
			</div>
		</div>
	</div>
</template>

<style scoped>
.image-card {
	width: 100%;
	background: var(--color-background-card);
	border-radius: 24px;
	overflow: hidden;
	height: fit-content;
	transition: 0.3s ease;
	position: relative;
}

.image-container {
	width: 100%;
	overflow: hidden;
	cursor: pointer;
	position: relative;
}

.card-img {
	width: 100%;
	display: block;
	transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.card-overlay {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	opacity: 0;
	background: radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.2) 0%, transparent 50%);
	transition: opacity 0.3s ease;
	pointer-events: none;
}

.action-group {
	display: flex;
	gap: 8px;
	padding: 16px;
	transform: translateY(8px);
	transition: transform 0.3s ease;
	pointer-events: auto;
}

.image-container:hover .card-overlay {
	opacity: 1;
}

.image-container:hover .action-group {
	transform: translateY(0);
}

.image-container:hover .card-img {
	transform: scale(1.05);
}

.glass-btn {
	border: 1px solid rgba(255, 255, 255, 0.2);
	padding: 6px 14px;
	border-radius: 12px;
	font-size: 0.8em;
	font-weight: 600;
	cursor: pointer;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	color: white;
	transition: all 0.2s ease;
}

.glass-btn:hover {
	background: rgba(255, 255, 255, 0.2);
	border-color: rgba(255, 255, 255, 0.4);
	transform: translateY(-2px);
}

.glass-btn.delete:hover {
	background: rgba(231, 76, 60, 0.7);
	border-color: rgba(231, 76, 60, 0.3);
}

.image-card:has(.image-container:hover) {
	box-shadow: 0 10px 30px color-mix(in srgb, var(--color-text), transparent 92%);
}

.card-body {
	padding: 1.2em;
}

.card-title {
	margin: 0 0 1em 0;
	font-size: 1em;
	font-weight: 600;
	color: var(--color-text);
}

.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px 12px;
	align-items: center;
}
</style>
