<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import ImageUploadModal from '@/components/ImageUploadModal.vue'
import ImageViewModal from '@/components/ImageViewModal.vue'
import ImageCrad from '@/components/ImageCrad.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

interface ImageMetadata {
	id: number
	title: string
	tags: Tag[]
}

interface Tag {
	title: string
	description: string
	color: string
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
			<IconInput class="search" placeholder="Serach for anything...">
				<template #icon><SearchIcon></SearchIcon></template>
			</IconInput>
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
				:tags="img.tags"
				@open="openImage(img.id)"
				@delete="deleteImage(img.id)"
			></ImageCrad>
		</div>
	</main>
</template>

<style scoped>
main {
	background: var(--color-background-panel);
}

.header,
.filter {
	width: 100%;
	height: 5rem;
	border-bottom: 1px solid var(--color-border);
	background: var(--color-background);
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
	column-count: 4;
	column-gap: 1.6rem;
	width: 100%;
}

.gallery > * {
	break-inside: avoid;
	margin-bottom: 1.6rem;
	display: inline-block;
	width: 100%;
}

@media (max-width: 1400px) {
	.gallery {
		column-count: 3;
	}
}

@media (max-width: 1000px) {
	.gallery {
		column-count: 2;
	}
}

@media (max-width: 700px) {
	.gallery {
		column-count: 1;
	}
}
</style>
