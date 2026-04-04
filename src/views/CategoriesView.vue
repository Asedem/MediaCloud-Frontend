<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import type { TagCategory } from '@/models/tag'
import CategoryCard from '@/components/CategoryCard.vue'
import CategoryCreateModal from '@/components/CategoryCreateModal.vue'
import CategoryEditModal from '@/components/CategoryEditModal.vue'
import TagAddModal from '@/components/TagAddModal.vue'
import TagEditModal from '@/components/TagEditModal.vue'
import type { Tag } from '@/models/tag'

const categories = ref<TagCategory[]>([])
const isCategoryModalOpen = ref(false)
const isCategoryEditModalOpen = ref(false)
const isTagModalOpen = ref(false)
const isTagEditModalOpen = ref(false)

const selectedCategory = ref<TagCategory | null>(null)
const selectedCategoryId = ref<number | null>(null)
const selectedTag = ref<Tag | null>(null)
const searchQuery = ref('')

const fetchCategories = async () => {
	try {
		const response = await fetch('/api/tags/categories')
		if (response.ok) categories.value = await response.json()
	} catch (error) {
		console.error(error)
	}
}

const filteredCategories = computed(() => {
	if (!searchQuery.value.trim()) return categories.value

	const query = searchQuery.value.toLowerCase()
	return categories.value.filter(
		(category) =>
			category.title.toLowerCase().includes(query) ||
			category.tags.some((tag) => tag.title.toLowerCase().includes(query)),
	)
})

const totalActiveTags = computed(() => {
	return categories.value.reduce((acc, category) => {
		return acc + (category.tags?.length || 0)
	}, 0)
})

const openTagAddModal = (categoryId: number) => {
	selectedCategoryId.value = categoryId
	isTagModalOpen.value = true
}

const openCategoryEditModal = (category: TagCategory) => {
	selectedCategory.value = category
	isCategoryEditModalOpen.value = true
}

const openTagEditModal = (tag: Tag, categoryId: number) => {
	selectedTag.value = tag
	selectedCategoryId.value = categoryId
	isTagEditModalOpen.value = true
}

onMounted(() => {
	fetchCategories()
})
</script>

<template>
	<main>
		<div class="header">
			<IconInput
				class="search"
				placeholder="Search tag categories or tags..."
				v-model="searchQuery"
			>
				<template #icon><SearchIcon></SearchIcon></template>
			</IconInput>
			<div class="vertical-line"></div>
			<GradientButton class="new" @click="isCategoryModalOpen = true">
				<template #text>Create New Category</template>
			</GradientButton>
		</div>

		<div class="filter">
			<div>
				<p>TOTAL CATEGORIES</p>
				<h3>{{ categories.length }}</h3>
			</div>
			<div class="vertical-line"></div>
			<div>
				<p>ACTIVE TAGS</p>
				<h3>
					{{ totalActiveTags }}
				</h3>
			</div>
		</div>

		<div class="gallery">
			<CategoryCard
				v-for="category in filteredCategories"
				:key="category.id"
				:category="category"
				@add="openTagAddModal"
				@edit="openCategoryEditModal"
				@edit-tag="openTagEditModal"
			></CategoryCard>
		</div>

		<CategoryCreateModal
			:isOpen="isCategoryModalOpen"
			@close="isCategoryModalOpen = false"
			@created="fetchCategories"
		/>

		<CategoryEditModal
			:isOpen="isCategoryEditModalOpen"
			:category="selectedCategory"
			@close="isCategoryEditModalOpen = false"
			@updated="fetchCategories"
		/>

		<TagAddModal
			:isOpen="isTagModalOpen"
			:categoryId="selectedCategoryId"
			:categories="categories"
			@close="isTagModalOpen = false"
			@created="fetchCategories"
		/>

		<TagEditModal
			:isOpen="isTagEditModalOpen"
			:tag="selectedTag"
			:currentCategoryId="selectedCategoryId"
			:categories="categories"
			@close="isTagEditModalOpen = false"
			@updated="fetchCategories"
		/>
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
