<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import ImageUploadModal from '@/components/ImageUploadModal.vue'
import ImageViewModal from '@/components/ImageViewModal.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import ImageCard from '@/components/ImageCard.vue'
import type { Image } from '@/models/image'
import type { TagCategory, Tag } from '@/models/tag'
import ToggleDropdown from '@/components/ToggleDropdown.vue'

const images = ref<Image[]>([])
const categories = ref<TagCategory[]>([])
const isModalOpen = ref(false)
const isImageViewOpen = ref(false)
const imageViewId = ref(-1)

const selectedFilters = reactive<Record<string, string[]>>({})

const fetchImages = async () => {
	const allSelectedTitles = Object.values(selectedFilters).flat()

	if (allSelectedTitles.length === 0) {
		try {
			const response = await fetch('/api/images')
			if (response.ok) images.value = await response.json()
		} catch (error) {
			console.error(error)
		}
		return
	}

	const tagPayload: Tag[] = []
	allSelectedTitles.forEach((title) => {
		for (const category of categories.value) {
			const foundTag = category.tags.find((t) => t.title === title)
			if (foundTag) {
				tagPayload.push(foundTag)
				break
			}
		}
	})

	try {
		const response = await fetch('/api/images/filtered', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tagPayload),
		})
		if (response.ok) images.value = await response.json()
	} catch (error) {
		console.error(error)
	}
}

const fetchCategories = async () => {
	try {
		const response = await fetch('/api/tags/categories')
		if (response.ok) categories.value = await response.json()
	} catch (error) {
		console.error(error)
	}
}

const resetFilters = () => {
	Object.keys(selectedFilters).forEach((key) => {
		selectedFilters[key] = []
	})
	fetchImages()
}

const deleteImage = async (id: number) => {
	await fetch(`/api/images/${id}`, { method: 'DELETE' })
	fetchImages()
}

function openImage(id: number) {
	imageViewId.value = id
	isImageViewOpen.value = true
}

onMounted(() => {
	fetchImages()
	fetchCategories()
})
</script>

<template>
	<main>
		<div class="header">
			<IconInput class="search" placeholder="Search for anything...">
				<template #icon><SearchIcon></SearchIcon></template>
			</IconInput>
			<div class="vertical-line"></div>
			<GradientButton class="new" @click="isModalOpen = true">
				<template #text>Upload Media</template>
			</GradientButton>
		</div>

		<div class="filter">
			<GradientButton class="all" @click="resetFilters">
				<template #text>Show all Media</template>
			</GradientButton>
			<ToggleDropdown
				class="drop"
				v-for="category in categories"
				:key="category.title"
				:items="category.tags.map((tag) => tag.title)"
				v-model="selectedFilters[category.title]"
				@update:modelValue="fetchImages"
			>
				<template #text>{{ category.title }}</template>
			</ToggleDropdown>
		</div>

		<ImageUploadModal :isOpen="isModalOpen" @close="isModalOpen = false" @uploaded="fetchImages" />

		<ImageViewModal :id="imageViewId" :isOpen="isImageViewOpen" @close="isImageViewOpen = false" />

		<div class="gallery">
			<ImageCard
				v-for="img in images"
				:key="img.id"
				:id="img.id"
				:title="img.title"
				:tags="img.tags"
				@open="openImage(img.id)"
				@delete="deleteImage(img.id)"
			></ImageCard>
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

.drop {
	margin-left: 10px;
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
