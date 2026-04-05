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
import type { StaticTagDefinition } from '@/models/staticTag'
import StaticTagCategoryCard from '@/components/StaticTagCategoryCard.vue'
import StaticTagDefinitionModal from '@/components/StaticTagDefinitionModal.vue'

const categories = ref<TagCategory[]>([])
const staticDefinitions = ref<StaticTagDefinition[]>([])
const isCategoryModalOpen = ref(false)
const isCategoryEditModalOpen = ref(false)
const isTagModalOpen = ref(false)
const isTagEditModalOpen = ref(false)
const isStaticModalOpen = ref(false)

const selectedCategory = ref<TagCategory | null>(null)
const selectedCategoryId = ref<number | null>(null)
const selectedTag = ref<Tag | null>(null)
const selectedStaticDefinition = ref<StaticTagDefinition | null>(null)
const searchQuery = ref('')

const fetchData = async () => {
	try {
		const [catRes, staticRes] = await Promise.all([
			fetch('/api/tags/categories'),
			fetch('/api/static-tags/definitions'),
		])
		if (catRes.ok) categories.value = await catRes.json()
		if (staticRes.ok) staticDefinitions.value = await staticRes.json()
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

const filteredStaticDefinitions = computed(() => {
	if (!searchQuery.value.trim()) return staticDefinitions.value

	const query = searchQuery.value.toLowerCase()
	return staticDefinitions.value.filter(
		(def) =>
			def.title.toLowerCase().includes(query) ||
			def.description?.toLowerCase().includes(query),
	)
})

const totalActiveTags = computed(() => {
	return (
		categories.value.reduce((acc, category) => {
			return acc + (category.tags?.length || 0)
		}, 0) + staticDefinitions.value.length
	)
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

const openStaticAddModal = () => {
	selectedStaticDefinition.value = null
	isStaticModalOpen.value = true
}

const openStaticEditModal = (def: StaticTagDefinition) => {
	selectedStaticDefinition.value = def
	isStaticModalOpen.value = true
}

onMounted(() => {
	fetchData()
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
				<h3>{{ categories.length + 1 }}</h3>
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
			<StaticTagCategoryCard
				v-if="filteredStaticDefinitions.length > 0 || !searchQuery"
				:definitions="filteredStaticDefinitions"
				@add="openStaticAddModal"
				@edit="openStaticEditModal"
			></StaticTagCategoryCard>
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
			@created="fetchData"
		/>

		<CategoryEditModal
			:isOpen="isCategoryEditModalOpen"
			:category="selectedCategory"
			@close="isCategoryEditModalOpen = false"
			@updated="fetchData"
		/>

		<TagAddModal
			:isOpen="isTagModalOpen"
			:categoryId="selectedCategoryId"
			:categories="categories"
			@close="isTagModalOpen = false"
			@created="fetchData"
		/>

		<TagEditModal
			:isOpen="isTagEditModalOpen"
			:tag="selectedTag"
			:currentCategoryId="selectedCategoryId"
			:categories="categories"
			@close="isTagEditModalOpen = false"
			@updated="fetchData"
		/>

		<StaticTagDefinitionModal
			:isOpen="isStaticModalOpen"
			:definition="selectedStaticDefinition"
			@close="isStaticModalOpen = false"
			@saved="fetchData"
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
