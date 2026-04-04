<script setup lang="ts">
import type { TagCategory } from '@/models/tag'
import TagDisplay from './TagDisplay.vue'
import ContrastButton from './ContrastButton.vue'
import SubtleButton from './SubtleButton.vue'

defineProps<{ category: TagCategory }>()
const emit = defineEmits(['edit', 'delete', 'add', 'edit-tag'])
</script>

<template>
	<div class="image-card">
		<div class="card-body">
			<h1 class="card-title">{{ category.title }}</h1>
			<div class="tag-row">
				<TagDisplay
					v-for="tag in category.tags"
					:key="tag.id"
					:color="tag.color"
					class="clickable-tag"
					@click="emit('edit-tag', tag, category.id)"
				>
					<template #text>{{ tag.title }}</template>
				</TagDisplay>
			</div>
			<br />
			<ContrastButton @click="emit('add', category.id)">
				<template #text>Add Tag</template>
			</ContrastButton>
			<SubtleButton class="space" @click="emit('edit', category)">
				<template #text>Edit</template>
			</SubtleButton>
		</div>
	</div>
</template>

<style scoped>
.image-card {
	width: 100%;
	min-width: 234px;
	background: var(--color-background-card);
	border-radius: 24px;
	overflow: hidden;
	height: fit-content;
	transition: 0.3s ease;
	position: relative;
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

.clickable-tag {
	cursor: pointer;
	transition: opacity 0.2s;
}

.clickable-tag:hover {
	opacity: 0.8;
}

.space {
	margin-left: 14px;
}
</style>
