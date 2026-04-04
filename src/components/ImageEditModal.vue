<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import SimpleInput from './SimpleInput.vue'
import TagDisplay from './TagDisplay.vue'
import type { TagCategory } from '@/models/tag'
import type { Image } from '@/models/image'

const props = defineProps<{
	isOpen: boolean
	image: Image | null
}>()
const emit = defineEmits(['close', 'updated'])

const title = ref<string>('')
const categories = ref<TagCategory[]>([])
const selectedTagIds = ref<number[]>([])

const fetchData = async () => {
	try {
		const res = await fetch('/api/tags/categories')
		if (res.ok) categories.value = await res.json()
	} catch (error) {
		console.error('Failed to fetch categories:', error)
	}
}

const toggleTag = (tagId: number) => {
	const index = selectedTagIds.value.indexOf(tagId)
	if (index === -1) {
		selectedTagIds.value.push(tagId)
	} else {
		selectedTagIds.value.splice(index, 1)
	}
}

watch(
	() => props.isOpen,
	(newVal) => {
		if (newVal && props.image) {
			title.value = props.image.title
			selectedTagIds.value = props.image.tags ? props.image.tags.map((t) => t.id) : []
			fetchData()
		}
	},
)

const updateImage = async () => {
	if (!title.value || !props.image) return

	try {
		const response = await fetch(`/api/images/${props.image.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: title.value,
				tagIds: selectedTagIds.value,
			}),
		})

		if (!response.ok) throw new Error('Update failed')

		emit('updated')
		emit('close')
	} catch (error) {
		console.error('Update failed:', error)
		alert('Update failed.')
	}
}

onMounted(fetchData)
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<div>
					<h2>Edit Image</h2>
					<p>Update image title and tags</p>
				</div>
			</div>

			<hr />

			<div class="form-container">
				<SimpleInput v-model="title" placeholder="Enter image title" />

				<div class="edit-grid">
					<div class="left-side">
						<div class="image-preview-container">
							<img
								v-if="image"
								:src="`/api/images/${image.id}/preview`"
								alt="Preview"
								class="image-preview"
							/>
						</div>
					</div>

					<div class="right-side">
						<h3 class="section-title">Assign Tags</h3>
						<div class="tags-container">
							<div v-for="cat in categories" :key="cat.id" class="category-group">
								<span class="category-label">{{ cat.title }}</span>
								<div class="tags-list">
									<div
										v-for="tag in cat.tags"
										:key="tag.id"
										@click="toggleTag(tag.id)"
										class="selectable-tag"
										:class="{ 'is-active': selectedTagIds.includes(tag.id) }"
									>
										<TagDisplay :color="tag.color">
											<template #text>{{ tag.title }}</template>
										</TagDisplay>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="actions">
					<SubtleButton @click="emit('close')" class="btn-secondary">
						<template #text>Cancel</template>
					</SubtleButton>
					<GradientButton @click="updateImage" :disabled="!title" class="btn-primary">
						<template #text>Save Changes</template>
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
	width: 800px;
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

.edit-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

.image-preview-container {
	width: 100%;
	min-height: 200px;
	border: 1px solid var(--color-background-soft);
	border-radius: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	background: var(--color-background-soft);
}

.image-preview {
	width: 100%;
	max-height: 400px;
	display: block;
	object-fit: contain;
}

.section-title {
	font-size: 0.9em;
	font-weight: 600;
	margin-bottom: 12px;
	color: var(--color-text);
}

.tags-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-height: 400px;
	overflow-y: auto;
	padding-right: 8px;
}

.category-label {
	display: block;
	font-size: 0.75em;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--color-subtext);
	margin-bottom: 8px;
}

.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.selectable-tag {
	cursor: pointer;
	transition:
		transform 0.1s ease,
		opacity 0.2s;
	opacity: 0.5;
}

.selectable-tag:hover {
	transform: translateY(-1px);
	opacity: 0.8;
}

.selectable-tag.is-active {
	opacity: 1;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;
}

/* Custom Scrollbar for tags container */
.tags-container::-webkit-scrollbar {
	width: 4px;
}

.tags-container::-webkit-scrollbar-track {
	background: transparent;
}

.tags-container::-webkit-scrollbar-thumb {
	background: var(--color-border);
	border-radius: 10px;
}
</style>
