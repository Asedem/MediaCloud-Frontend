<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import ImageUploadModal from '@/components/ImageUploadModal.vue'
import ImageViewModal from '@/components/ImageViewModal.vue'
import ImageCrad from '@/components/ImageCrad.vue'

interface ImageMetadata {
	id: number
	title: string
}
const images = ref<ImageMetadata[]>([])
const isModalOpen = ref(false)
const isImageViewOpen = ref(false)
const imageViewId = ref(-1)

const fetchImages = async () => {
	try {
		const response = await fetch('/api/images')
		if (response.ok) images.value = await response.json()
	} catch (error) {
		console.error('Failed to fetch images:', error)
	}
}

const deleteImage = async (id: number) => {
	await fetch(`/api/images/${id}`, { method: 'DELETE' })
	fetchImages()
}

function openImage(id: number) {
	imageViewId.value = id
	isImageViewOpen.value = true
}

onMounted(fetchImages)
</script>

<template>
	<main>
		<div class="header">
			<IconInput class="search"></IconInput>
			<div class="vertical-line"></div>
			<GradientButton class="new" @click="isModalOpen = true">
				<template #text>Upload Media</template>
			</GradientButton>
		</div>

		<div class="filter">
			<GradientButton class="all" @click="fetchImages">
				<template #text>Show all Media</template>
			</GradientButton>
		</div>

		<ImageUploadModal :isOpen="isModalOpen" @close="isModalOpen = false" @uploaded="fetchImages" />

		<ImageViewModal :id="imageViewId" :isOpen="isImageViewOpen" @close="isImageViewOpen = false" />

		<div class="gallery">
			<ImageCrad
				v-for="img in images"
				:id="img.id"
				:title="img.title"
				@open="openImage(img.id)"
				@delete="deleteImage(img.id)"
			></ImageCrad>
		</div>
	</main>
</template>

<style scoped>
.header,
.filter {
	width: 100%;
	height: 5rem;
	border-bottom: 1px solid var(--color-border);
	display: flex;
	justify-content: left;
	align-items: center;
	padding: 0 32px;
}

.search {
	width: 100%;
}

.vertical-line {
	border-left: 1px solid var(--color-border);
	height: 1.5em;
	margin: 0 16px;
}

.gallery {
	padding: 2rem;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
}
</style>
