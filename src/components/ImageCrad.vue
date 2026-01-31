<script setup lang="ts">
import TagDisplay from './TagDisplay.vue'

const props = defineProps<{ id: number; title: string }>()
const emit = defineEmits(['open', 'delete'])
</script>

<template>
	<div class="image-card">
		<div class="image-container" @click="emit('open')">
			<img :src="`/api/images/${id}/preview`" :alt="title" class="card-img" />
		</div>

		<div class="card-body">
			<h2 class="card-title">{{ title }}</h2>
			<div class="actions-row">
				<TagDisplay color="#ff0000" @click="emit('delete')">
					<template #text>Delete</template>
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
	transition: 0.2s;
}

.image-container {
	width: 100%;
	overflow: hidden;
	cursor: pointer;
}

.card-img {
	width: 100%;
	display: block;
	transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.image-container:hover .card-img {
	transform: scale(1.1);
}

.image-card:has(.image-container:hover) {
	box-shadow: 0 5px 20px color-mix(in srgb, var(--color-text), transparent 90%);
}

.card-body {
	padding: 1em;
}

.card-title {
	margin: 0 0 1em 0;
	font-size: 1em;
	font-weight: 600;
	color: var(--color-text);
}

.actions-row {
	display: flex;
	gap: 12px;
}
</style>
