<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import TextToggle from './TextToggle.vue'
import SimpleInput from './SimpleInput.vue'
import TagDisplay from './TagDisplay.vue'
import type { TagCategory } from '@/models/tag'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'uploaded'])

const isWebLink = ref(false)

const title = ref<string>('')
const webUrl = ref<string>('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

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
		if (newVal) {
			fetchData()
		} else {
			title.value = ''
			file.value = null
			webUrl.value = ''
			isWebLink.value = false
			selectedTagIds.value = []
			if (previewUrl.value) {
				URL.revokeObjectURL(previewUrl.value)
				previewUrl.value = null
			}
			if (fileInput.value) fileInput.value.value = ''
		}
	},
)

const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files[0]) {
		const selectedFile = target.files[0]
		file.value = selectedFile
		if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
		previewUrl.value = URL.createObjectURL(selectedFile)
	}
}

const uploadImage = async () => {
	if (!title.value) return

	try {
		let imageData

		if (isWebLink.value) {
			const params = new URLSearchParams({
				title: title.value,
				sourceUrl: webUrl.value,
			})

			const response = await fetch(`/api/images/upload-remote?${params.toString()}`, {
				method: 'POST',
			})

			if (!response.ok) throw new Error('Remote upload failed')
			imageData = await response.json()
		} else {
			if (!file.value) return
			const formData = new FormData()
			formData.append('title', title.value)
			formData.append('file', file.value)

			const response = await fetch('/api/images/upload', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) throw new Error('Local upload failed')
			imageData = await response.json()
		}

		if (imageData && selectedTagIds.value.length > 0) {
			await fetch(`/api/images/${imageData.id}/tags`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(selectedTagIds.value),
			})
		}

		emit('uploaded')
		emit('close')
	} catch (error) {
		console.error('Upload failed:', error)
		alert('Upload failed. Please ensure the link is direct and the server is running.')
	}
}

onMounted(fetchData)
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<div>
					<h2>{{ isWebLink ? 'Import from Web' : 'Upload from local disk' }}</h2>
					<p>
						{{
							isWebLink
								? 'Paste a direct link to an image'
								: 'Upload media directly from your machine'
						}}
					</p>
				</div>
				<TextToggle v-model="isWebLink">
					<template #left>Local Files</template>
					<template #right>Web Link</template>
				</TextToggle>
			</div>

			<hr />

			<div class="form-container">
				<SimpleInput v-model="title" placeholder="Enter image title" />

				<div class="upload-grid">
					<div class="left-side">
						<div v-if="isWebLink" class="link-input-area">
							<SimpleInput v-model="webUrl" placeholder="https://example.com/image.jpg" />
							<div class="url-preview-box" :class="{ 'has-content': webUrl }">
								<img
									v-if="webUrl"
									:src="webUrl"
									alt="URL preview"
									class="image-preview"
									@error="webUrl = ''"
								/>
								<div v-else class="upload-placeholder">
									<p>Image preview will appear here</p>
								</div>
							</div>
						</div>

						<div v-else class="upload-box" @click="fileInput?.click()">
							<input
								ref="fileInput"
								type="file"
								@change="handleFileChange"
								accept="image/*"
								class="hidden-input"
							/>

							<template v-if="!previewUrl">
								<div class="upload-placeholder">
									<span class="upload-icon">+</span>
									<p>Choose an image</p>
								</div>
							</template>

							<template v-else>
								<div class="preview-container">
									<img :src="previewUrl" alt="Preview" class="image-preview" />
									<div class="preview-overlay">
										<span>Change</span>
									</div>
								</div>
							</template>
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
					<GradientButton
						@click="uploadImage"
						:disabled="!title || (!isWebLink && !file) || (isWebLink && !webUrl)"
						class="btn-primary"
					>
						<template #text>{{ isWebLink ? 'Save Link' : 'Upload to Cloud' }}</template>
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

.upload-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

.link-input-area {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.url-preview-box {
	width: 100%;
	min-height: 160px;
	border: 1px solid var(--color-background-soft);
	border-radius: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	background: var(--color-background-soft);
}

.upload-box {
	width: 100%;
	min-height: 160px;
	border: 2px dashed var(--color-background-soft);
	border-radius: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.2s ease;
	overflow: hidden;
	position: relative;
}

.upload-box:hover {
	border-color: var(--color-primary);
	background: var(--color-background-soft);
}

.upload-placeholder {
	text-align: center;
	color: var(--color-subtext);
	padding: 20px;
}

.image-preview {
	width: 100%;
	max-height: 350px;
	display: block;
	object-fit: contain;
}

.preview-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.preview-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
	transition: opacity 0.2s;
}

.preview-container:hover .preview-overlay {
	opacity: 1;
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

.hidden-input {
	display: none;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;
}
</style>
