<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TagCategory } from '@/models/tag'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import SimpleInput from './SimpleInput.vue'

const props = defineProps<{
	isOpen: boolean
	category: TagCategory | null
}>()

const emit = defineEmits(['close', 'updated', 'delete'])

const title = ref('')

watch(
	() => props.isOpen,
	(newVal) => {
		if (newVal && props.category) {
			title.value = props.category.title
		}
	},
)

const updateCategory = async () => {
	if (!title.value || !props.category) return

	const params = new URLSearchParams({ title: title.value })

	try {
		const response = await fetch(`/api/tags/categories/${props.category.id}?${params.toString()}`, {
			method: 'PUT',
		})

		if (response.ok) {
			emit('updated')
			emit('close')
		}
	} catch (error) {
		console.error('Failed to update category:', error)
	}
}
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<div>
					<h2>Edit Category</h2>
					<p>Change the name of this tag category.</p>
				</div>
				<button v-if="category" class="delete-btn" @click="emit('delete', category)">
					Delete
				</button>
			</div>
			<br />
			<SimpleInput v-model="title" placeholder="Category Title" />

			<div class="actions">
				<SubtleButton @click="emit('close')">
					<template #text>Cancel</template>
				</SubtleButton>
				<GradientButton @click="updateCategory" :disabled="!title">
					<template #text>Save Changes</template>
				</GradientButton>
			</div>
		</div>
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
}

.modal-content {
	background: var(--color-background);
	padding: 2rem;
	border-radius: 8px;
	width: 450px;
	max-width: 90vw;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
}

.delete-btn {
	background: rgba(231, 76, 60, 0.1);
	color: #e74c3c;
	border: 1px solid rgba(231, 76, 60, 0.2);
	padding: 6px 12px;
	border-radius: 8px;
	font-size: 0.8em;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	flex-shrink: 0;
}

.delete-btn:hover {
	background: #e74c3c;
	color: white;
}

h2 {
	margin-bottom: 0.2rem;
}

p {
	color: var(--color-subtext);
	font-size: 0.9em;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 24px;
}
</style>
