<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import ImageUploadModal from '@/components/ImageUploadModal.vue'
import ImageViewModal from '@/components/ImageViewModal.vue'
import ImageEditModal from '@/components/ImageEditModal.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import ImageCard from '@/components/ImageCard.vue'
import type { Image } from '@/models/image'
import type { TagCategory, Tag } from '@/models/tag'
import type { StaticTagDefinition } from '@/models/staticTag'
import ToggleDropdown from '@/components/ToggleDropdown.vue'
import RangeDropdown from '@/components/RangeDropdown.vue'
import IconToggle from '@/components/IconToggle.vue'
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue'
import BookmarksIcon from '@/components/icons/BookmarksIcon.vue'

const images = ref<Image[]>([])
const categories = ref<TagCategory[]>([])
const staticDefinitions = ref<StaticTagDefinition[]>([])
const isModalOpen = ref(false)
const isImageViewOpen = ref(false)
const isImageEditOpen = ref(false)
const imageViewId = ref(-1)
const selectedImage = ref<Image | null>(null)
const searchQuery = ref('')
const isExact = ref(false)

const selectedFilters = reactive<Record<string, string[]>>({})
const staticFilters = reactive<Record<number, { min: number | null; max: number | null }>>({})

const fetchImages = async () => {
	const allSelectedTitles = Object.values(selectedFilters).flat()
	const hasStaticFilters = Object.values(staticFilters).some((f) => f.min !== null || f.max !== null)

	if (allSelectedTitles.length === 0 && !searchQuery.value.trim() && !hasStaticFilters) {
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

	const staticFilterPayload: Record<number, { min: number | null; max: number | null }> = {}
	Object.entries(staticFilters).forEach(([id, filter]) => {
		if (filter.min !== null || filter.max !== null) {
			staticFilterPayload[Number(id)] = filter
		}
	})

	try {
		const response = await fetch('/api/images/filtered', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tags: tagPayload,
				title: searchQuery.value.trim(),
				filterMode: isExact.value ? 'exact' : 'inclusive',
				staticTagFilters: staticFilterPayload,
			}),
		})
		if (response.ok) images.value = await response.json()
	} catch (error) {
		console.error(error)
	}
}

const fetchData = async () => {
	try {
		const [catRes, staticRes] = await Promise.all([
			fetch('/api/tags/categories'),
			fetch('/api/static-tags/definitions'),
		])
		if (catRes.ok) categories.value = await catRes.json()
		if (staticRes.ok) {
			const defs: StaticTagDefinition[] = await staticRes.json()
			staticDefinitions.value = defs
			defs.forEach((def) => {
				if (def.id !== undefined && staticFilters[def.id] === undefined) {
					staticFilters[def.id] = { min: null, max: null }
				}
			})
		}
	} catch (error) {
		console.error(error)
	}
}

const resetFilters = () => {
	searchQuery.value = ''
	isExact.value = false
	Object.keys(selectedFilters).forEach((key) => {
		selectedFilters[key] = []
	})
	Object.keys(staticFilters).forEach((key) => {
		staticFilters[Number(key)] = { min: null, max: null }
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

function editImage(image: Image) {
	selectedImage.value = image
	isImageEditOpen.value = true
}

watch(searchQuery, () => {
	fetchImages()
})

watch(isExact, () => {
	fetchImages()
})

watch(staticFilters, () => {
	fetchImages()
}, { deep: true })

onMounted(() => {
	fetchImages()
	fetchData()
})
</script>

<template>
	<main>
		<div class="header">
			<IconInput class="search" placeholder="Search all images..." v-model="searchQuery">
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

			<div class="vertical-line"></div>

			<IconToggle v-model="isExact" title="Filter mode: Inclusive vs Exact">
				<template #icon-left><BookmarkIcon /></template>
				<template #icon-right><BookmarksIcon /></template>
			</IconToggle>

			<div class="vertical-line"></div>

			<RangeDropdown
				v-for="def in staticDefinitions"
				:key="def.id"
				:title="def.title"
				v-model:min="staticFilters[def.id!].min"
				v-model:max="staticFilters[def.id!].max"
				class="drop"
			/>

			<div v-if="staticDefinitions.length > 0" class="vertical-line"></div>

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

		<ImageEditModal
			:image="selectedImage"
			:isOpen="isImageEditOpen"
			@close="isImageEditOpen = false"
			@updated="fetchImages"
		/>

		<div class="gallery">
			<ImageCard
				v-for="img in images"
				:key="img.id"
				:id="img.id"
				:title="img.title"
				:tags="img.tags"
				:static-tag-values="img.staticTagValues"
				@open="openImage(img.id)"
				@delete="deleteImage(img.id)"
				@edit="editImage(img)"
			></ImageCard>
		</div>
	</main>
</template>

<style scoped>
main {
	background: var(--color-background-panel);
}

.header {
	width: 100%;
	height: 5rem;
	border-bottom: 1px solid var(--color-border);
	background: var(--color-background);
	display: flex;
	justify-content: left;
	align-items: center;
	padding: 0 32px;
}

.filter {
	width: 100%;
	min-height: 5rem;
	border-bottom: 1px solid var(--color-border);
	background: var(--color-background);
	display: flex;
	justify-content: left;
	align-items: center;
	padding: 16px 32px;
	flex-wrap: wrap;
	gap: 12px 0;
}

.drop {
	margin-right: 10px;
}

.search {
	width: 100%;
}

.vertical-line {
	border-left: 1px solid var(--color-border);
	height: 1.5em;
	margin: 0 16px;
	flex-shrink: 0;
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
