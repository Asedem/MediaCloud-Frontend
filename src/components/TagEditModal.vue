<script setup lang="ts">
import { ref, watch } from 'vue'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import SimpleInput from './SimpleInput.vue'
import type { Tag, TagCategory } from '@/models/tag'

const props = defineProps<{
	isOpen: boolean
	tag: Tag | null
	currentCategoryId: number | null
	categories: TagCategory[]
}>()
const emit = defineEmits(['close', 'updated', 'delete'])

const title = ref<string>('')
const description = ref<string>('')
const selectedColor = ref<string>('#3498db')
const selectedCategoryId = ref<number | null>(null)

const colorPalette = [
	'#3498db',
	'#e74c3c',
	'#2ecc71',
	'#f1c40f',
	'#9b59b6',
	'#e67e22',
	'#1abc9c',
	'#34495e',
]

watch(
	() => props.isOpen,
	(newVal) => {
		if (newVal && props.tag) {
			title.value = props.tag.title
			description.value = props.tag.description
			selectedColor.value = props.tag.color
			selectedCategoryId.value = props.currentCategoryId
		}
	},
)

const updateTag = async () => {
	if (!title.value || !selectedCategoryId.value || !props.tag) return

	const params = new URLSearchParams({
		title: title.value,
		description: description.value,
		color: selectedColor.value,
		categoryId: selectedCategoryId.value.toString(),
	})

	try {
		const response = await fetch(`/api/tags/${props.tag.id}?${params.toString()}`, {
			method: 'PUT',
		})

		if (!response.ok) throw new Error('Failed to update tag')

		emit('updated')
		emit('close')
	} catch (error) {
		console.error('Failed to update tag:', error)
	}
}
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<div>
					<h2>Edit Tag</h2>
					<p>Update tag details</p>
				</div>
				<button class="delete-btn" @click="emit('delete', tag)">Delete Tag</button>
			</div>

			<hr />

			<div class="form-container">
				<div class="form-group">
					<label>Category</label>
					<select v-model="selectedCategoryId" class="custom-select">
						<option v-for="cat in categories" :key="cat.id" :value="cat.id">
							{{ cat.title }}
						</option>
					</select>
				</div>

				<div class="form-group">
					<label>Tag Title</label>
					<SimpleInput v-model="title" placeholder="Enter tag title" />
				</div>

				<div class="form-group">
					<label>Description</label>
					<SimpleInput v-model="description" placeholder="Enter tag description" />
				</div>

				<div class="form-group">
					<label>Select Color</label>
					<div class="color-grid">
						<button
							v-for="color in colorPalette"
							:key="color"
							type="button"
							@click="selectedColor = color"
							class="color-option"
							:style="{ backgroundColor: color }"
							:class="{ active: selectedColor === color }"
						></button>
						<div class="custom-color-container">
							<input v-model="selectedColor" type="color" class="color-picker" />
							<span class="custom-label">Custom</span>
						</div>
					</div>
				</div>

				<div class="actions">
					<SubtleButton @click="emit('close')" class="btn-secondary">
						<template #text>Cancel</template>
					</SubtleButton>
					<GradientButton
						@click="updateTag"
						:disabled="!title || !selectedCategoryId"
						class="btn-primary"
					>
						<template #text>Update Tag</template>
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
}

.delete-btn:hover {
	background: #e74c3c;
	color: white;
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

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-group label {
	font-size: 0.8em;
	font-weight: 600;
	color: var(--color-subtext);
	text-transform: uppercase;
}

.custom-select {
	width: 100%;
	height: 48px;
	border-radius: 12px;
	border: 1px solid var(--color-border);
	background: var(--color-background-soft);
	color: var(--color-text);
	padding: 0 16px;
	outline: none;
	font-size: 1rem;
}

.color-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	align-items: center;
}

.color-option {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	border: 2px solid transparent;
	cursor: pointer;
	transition: all 0.2s;
}

.color-option.active {
	border-color: var(--color-text);
	transform: scale(1.1);
}

.custom-color-container {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-left: 10px;
	padding-left: 10px;
	border-left: 1px solid var(--color-border);
}

.color-picker {
	width: 32px;
	height: 32px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	background: none;
}

.custom-label {
	font-size: 0.75em;
	color: var(--color-subtext);
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;
}
</style>
