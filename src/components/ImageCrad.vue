<script setup lang="ts">
const props = defineProps<{ id: number; title: string }>()
const emit = defineEmits(['open', 'delete'])
</script>

<template>
	<div class="image-card">
		<img :src="`/api/images/${id}/preview`" :alt="title" @click="emit('open')" />
		<div class="card-footer">
			<p>{{ title }}</p>
			<button class="delete-btn" @click="emit('delete')">Delete</button>
		</div>
	</div>
</template>

<style scoped>
.image-card img {
	width: 100%;
	border-radius: 8px;
}
.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8px;
}
.delete-btn {
	background: #ff4d4f;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 4px 8px;
	cursor: pointer;
}
</style>
