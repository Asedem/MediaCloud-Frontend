<script setup lang="ts">
import { ref, watch } from 'vue'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import SimpleInput from './SimpleInput.vue'
import type { TagCategory } from '@/models/tag'

const props = defineProps<{
	isOpen: boolean
	category: TagCategory | null
}>()
const emit = defineEmits(['close', 'updated'])

const title = ref<string>('')

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

	try {
		const response = await fetch(
			`/api/tags/categories/${props.category.id}?title=${encodeURIComponent(title.value)}`,
			{
				method: 'PUT',
			},
		)

		if (!response.ok) throw new Error('Failed to update category')

		emit('updated')
		emit('close')
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
					<p>Change the title of your category</p>
				</div>
			</div>

			<hr />

			<div class="form-container">
				<SimpleInput v-model="title" placeholder="Enter category title" />

				<div class="actions">
					<SubtleButton @click="emit('close')" class="btn-secondary">
						<template #text>Cancel</template>
					</SubtleButton>
					<GradientButton @click="updateCategory" :disabled="!title" class="btn-primary">
						<template #text>Update Category</template>
					</GradientButton>
				</div>
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
	padding: 20px;
}

.modal-content {
	background: var(--color-background);
	padding: 2rem;
	border-radius: 8px;
	width: 500px;
	max-width: 95vw;
	max-height: 90vh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

hr {
	margin: 32px 0;
	border: 1px solid var(--color-background-soft);
}

.form-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;
}
</style>
