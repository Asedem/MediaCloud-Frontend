<script setup lang="ts">
import type { StaticTagDefinition } from '@/models/staticTag'
import SubtleButton from './SubtleButton.vue'
import ContrastButton from './ContrastButton.vue'

defineProps<{ definitions: StaticTagDefinition[] }>()
const emit = defineEmits(['add', 'edit', 'delete'])
</script>

<template>
	<div class="image-card">
		<div class="card-body">
			<h1 class="card-title">Static Tags</h1>
			<p class="description">
				These tags apply to every image and store a numeric value.
			</p>
			<div class="tag-row">
				<div
					v-for="def in definitions"
					:key="def.id"
					class="definition-item"
					@click="emit('edit', def)"
				>
					<span class="def-title">{{ def.title }}</span>
					<span v-if="def.description" class="def-desc">{{ def.description }}</span>
				</div>
			</div>
			<br />
			<ContrastButton @click="emit('add')">
				<template #text>Add Definition</template>
			</ContrastButton>
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

.tag-row {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.definition-item {
	padding: 8px 12px;
	background: var(--color-background-soft);
	border-radius: 12px;
	cursor: pointer;
	transition: opacity 0.2s;
	display: flex;
	flex-direction: column;
}

.definition-item:hover {
	opacity: 0.8;
}

.def-title {
	font-size: 0.9em;
	font-weight: 600;
	color: var(--color-text);
}

.def-desc {
	font-size: 0.75em;
	color: var(--color-subtext);
}
</style>
