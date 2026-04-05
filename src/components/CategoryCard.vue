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
			<p class="description">Standard category for boolean tags.</p>
			<div class="tag-list">
				<div
					v-for="tag in category.tags"
					:key="tag.id"
					class="tag-item"
					@click="emit('edit-tag', tag, category.id)"
				>
					<TagDisplay :color="tag.color" class="clickable-tag">
						<template #text>{{ tag.title }}</template>
					</TagDisplay>
					<span v-if="tag.description" class="tag-desc">{{ tag.description }}</span>
				</div>
			</div>
			<div class="actions">
				<ContrastButton @click="emit('add', category.id)">
					<template #text>Add Tag</template>
				</ContrastButton>
				<SubtleButton @click="emit('edit', category)">
					<template #text>Edit Category</template>
				</SubtleButton>
			</div>
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
	margin: 0 0 0.2em 0;
	font-size: 1.1em;
	font-weight: 700;
	color: var(--color-text);
}

.description {
	font-size: 0.8em;
	color: var(--color-subtext);
	margin-bottom: 1em;
}

.tag-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.tag-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 8px 12px;
	background: var(--color-background-soft);
	border-radius: 12px;
	cursor: pointer;
	transition: opacity 0.2s;
}

.tag-item:hover {
	opacity: 0.8;
}

.tag-desc {
	font-size: 0.75em;
	color: var(--color-subtext);
	padding-left: 4px;
}

.clickable-tag {
	width: fit-content;
}

.actions {
	display: flex;
	gap: 12px;
	margin-top: 24px;
	flex-wrap: wrap;
}
</style>
