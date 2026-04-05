<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import ImageUploadModal from '@/components/ImageUploadModal.vue'
import ImageViewModal from '@/components/ImageViewModal.vue'
import ImageEditModal from '@/components/ImageEditModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import ImageCard from '@/components/ImageCard.vue'
import type { Image } from '@/models/image'
import type { TagCategory, Tag } from '@/models/tag'
import type { StaticTagDefinition } from '@/models/staticTag'
import ToggleDropdown from '@/components/ToggleDropdown.vue'
import RangeDropdown from '@/components/RangeDropdown.vue'
import IconToggle from '@/components/IconToggle.vue'
import SingleSelectDropdown from '@/components/SingleSelectDropdown.vue'
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

// Pagination & Sorting state
const currentPage = ref(0)
const pageSize = ref(24)
const hasMore = ref(true)
const isLoading = ref(false)
const sortValue = ref('random') // Default sort is now random

const confirmation = reactive({
	isOpen: false,
	title: '',
	message: '',
	onConfirm: () => {},
})

const selectedFilters = reactive<Record<string, string[]>>({})
const staticFilters = reactive<Record<number, { min: number | null; max: number | null }>>({})

const sortOptions = ref<{ label: string; value: string }[]>([
	{ label: 'Random', value: 'random' },
	{ label: 'Newest First', value: 'default' },
	{ label: 'Title (A-Z)', value: 'title:asc' },
	{ label: 'Title (Z-A)', value: 'title:desc' },
])

const updateSortOptions = () => {
	const base = [
		{ label: 'Random', value: 'random' },
		{ label: 'Newest First', value: 'default' },
		{ label: 'Title (A-Z)', value: 'title:asc' },
		{ label: 'Title (Z-A)', value: 'title:desc' },
	]

	staticDefinitions.value.forEach((def) => {
		base.push({ label: `${def.title} (Low to High)`, value: `static_${def.id}:asc` })
		base.push({ label: `${def.title} (High to Low)`, value: `static_${def.id}:desc` })
	})

	sortOptions.value = base
}

const fetchImages = async (append = false) => {
	if (isLoading.value) return
	isLoading.value = true

	if (!append) {
		currentPage.value = 0
		hasMore.value = true
	}

	const allSelectedTitles = Object.values(selectedFilters).flat()
	
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

	let sortBy = 'id'
	let sortDirection = 'desc'

	if (sortValue.value === 'random') {
		sortBy = 'random'
	} else if (sortValue.value !== 'default') {
		const [s, d] = sortValue.value.split(':')
		sortBy = s
		sortDirection = d
	}

	try {
		const response = await fetch('/api/images/filtered', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tags: tagPayload,
				title: searchQuery.value.trim(),
				filterMode: isExact.value ? 'exact' : 'inclusive',
				staticTagFilters: staticFilterPayload,
				page: currentPage.value,
				size: pageSize.value,
				sortBy,
				sortDirection,
			}),
		})

		if (response.ok) {
			const data: Image[] = await response.json()
			if (append) {
				images.value = [...images.value, ...data]
			} else {
				images.value = data
			}

			if (data.length < pageSize.value) {
				hasMore.value = false
			}
		}
	} catch (error) {
		console.error(error)
	} finally {
		isLoading.value = false
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
			updateSortOptions()
		}
	} catch (error) {
		console.error(error)
	}
}

const resetFilters = () => {
	searchQuery.value = ''
	isExact.value = false
	sortValue.value = 'random' // Reset to random
	Object.keys(selectedFilters).forEach((key) => {
		selectedFilters[key] = []
	})
	Object.keys(staticFilters).forEach((key) => {
		staticFilters[Number(key)] = { min: null, max: null }
	})
	fetchImages()
}

const deleteImage = (image: Image) => {
	confirmation.title = 'Delete Image'
	confirmation.message = `Are you sure you want to permanently delete "${image.title}"? This action cannot be undone.`
	confirmation.onConfirm = async () => {
		try {
			const response = await fetch(`/api/images/${image.id}`, { method: 'DELETE' })
			if (response.ok) {
				fetchImages()
			}
		} catch (error) {
			console.error('Error deleting image:', error)
		}
		confirmation.isOpen = false
	}
	confirmation.isOpen = true
}

function openImage(id: number) {
	imageViewId.value = id
	isImageViewOpen.value = true
}

function editImage(image: Image) {
	selectedImage.value = image
	isImageEditOpen.value = true
}

// Lazy loading observer
const loadMoreSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = () => {
	if (observer) observer.disconnect()

	observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
			currentPage.value++
			fetchImages(true)
		}
	}, { threshold: 0.1 })

	if (loadMoreSentinel.value) {
		observer.observe(loadMoreSentinel.value)
	}
}

watch(searchQuery, () => fetchImages())
watch(isExact, () => fetchImages())
watch(sortValue, () => fetchImages())
watch(
	staticFilters,
	() => {
		fetchImages()
	},
	{ deep: true },
)

onMounted(async () => {
	await fetchData()
	await fetchImages()
	nextTick(setupObserver)
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

			<SingleSelectDropdown :options="sortOptions" v-model="sortValue" class="drop" />

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
				@update:modelValue="fetchImages()"
			>
				<template #text>{{ category.title }}</template>
			</ToggleDropdown>
		</div>

		<ImageUploadModal :isOpen="isModalOpen" @close="isModalOpen = false" @uploaded="fetchImages()" />

		<ImageViewModal :id="imageViewId" :isOpen="isImageViewOpen" @close="isImageViewOpen = false" />

		<ImageEditModal
			:image="selectedImage"
			:isOpen="isImageEditOpen"
			@close="isImageEditOpen = false"
			@updated="fetchImages()"
		/>

		<ConfirmationModal
			:isOpen="confirmation.isOpen"
			:title="confirmation.title"
			:message="confirmation.message"
			@close="confirmation.isOpen = false"
			@confirm="confirmation.onConfirm"
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
				@delete="deleteImage(img)"
				@edit="editImage(img)"
			></ImageCard>
		</div>

		<div ref="loadMoreSentinel" class="sentinel">
			<p v-if="isLoading">Loading more...</p>
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
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1.6rem;
	width: 100%;
}

.gallery > * {
	width: 100%;
}

.sentinel {
	width: 100%;
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-subtext);
}

@media (max-width: 1400px) {
	.gallery {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 1000px) {
	.gallery {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 700px) {
	.gallery {
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>
