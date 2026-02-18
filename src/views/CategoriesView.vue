<!--<template>
	<main style="padding: 20px">
		<h1>MediaCloud Manager</h1>

		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px">
			<section>
				<div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px">
					<h3>Create New Category</h3>
					<input v-model="newCategoryTitle" placeholder="Category Title" />
					<button @click="addCategory">Add Category</button>
				</div>

				<div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px">
					<h3>Add Tag to Category</h3>
					<select
						v-model="newTag.categoryId"
						style="display: block; margin-bottom: 10px; width: 100%"
					>
						<option :value="null">Select a Category</option>
						<option v-for="cat in categories" :key="cat.id" :value="cat.id">
							{{ cat.title }}
						</option>
					</select>

					<div style="display: flex; gap: 10px; margin-bottom: 10px">
						<input v-model="newTag.title" placeholder="Tag Title" style="flex: 1" />
						<input v-model="newTag.description" placeholder="Description" style="flex: 2" />
					</div>

					<div style="margin-bottom: 15px">
						<p style="font-size: 0.8em; margin-bottom: 8px">Select Color:</p>
						<div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
							<button
								v-for="color in colorPalette"
								:key="color"
								type="button"
								@click="newTag.color = color"
								:style="{
									backgroundColor: color,
									width: '28px',
									height: '28px',
									border: newTag.color === color ? '2px solid #000' : '1px solid #ccc',
									borderRadius: '4px',
									cursor: 'pointer',
								}"
							></button>
							<div
								style="
									display: flex;
									align-items: center;
									gap: 5px;
									margin-left: 10px;
									border-left: 1px solid #ddd;
									padding-left: 10px;
								"
							>
								<input
									v-model="newTag.color"
									type="color"
									id="customColor"
									style="cursor: pointer"
								/>
								<label for="customColor" style="font-size: 0.7em">Custom</label>
							</div>
						</div>
					</div>

					<button @click="addTag" style="width: 100%">Add Tag</button>
				</div>

				<hr />

				<h2>Categories & Tags</h2>
				<button @click="fetchData">Refresh All Data</button>

				<div v-for="category in categories" :key="category.id" style="margin-top: 20px">
					<h4 style="margin-bottom: 5px">
						{{ category.title }} <small>(ID: {{ category.id }})</small>
					</h4>

					<div v-if="category.tags && category.tags.length">
						<TagDisplay v-for="tag in category.tags" :key="tag.id" :color="tag.color">
							<template #text>{{ tag.title }}</template>
						</TagDisplay>
					</div>
					<p v-else style="font-size: 0.9em; color: gray">No tags in this category.</p>
				</div>
			</section>

			<section style="border-left: 1px solid #eee; padding-left: 20px">
				<h2>Apply Tags to Images</h2>

				<div
					v-for="image in images"
					:key="image.id"
					style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px"
				>
					<div style="display: flex; gap: 15px">
						<img
							:src="`/api/images/${image.id}/preview`"
							style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px"
						/>

						<div style="flex-grow: 1">
							<h3 style="margin-top: 0">{{ image.title }}</h3>

							<div style="margin-bottom: 10px">
								<p style="font-size: 0.8em; color: #666; margin-bottom: 4px">Current Tags:</p>
								<TagDisplay v-for="tag in image.tags" :key="tag.id" :color="tag.color">
									<template #text>{{ tag.title }}</template>
								</TagDisplay>
							</div>

							<div style="background: #f9f9f9; padding: 10px; border-radius: 4px">
								<label style="display: block; font-size: 0.8em; margin-bottom: 5px"
									>Select Tags to Apply:</label
								>
								<select
									v-model="selectedTagsForImage[image.id]"
									multiple
									style="width: 100%; height: 80px"
								>
									<optgroup v-for="cat in categories" :key="cat.id" :label="cat.title">
										<option v-for="tag in cat.tags" :key="tag.id" :value="tag.id">
											{{ tag.title }}
										</option>
									</optgroup>
								</select>
								<button @click="applyTagsToImage(image.id)" style="margin-top: 8px; width: 100%">
									Update Image Tags
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</main>
</template>

<script setup>
import TagDisplay from '@/components/TagDisplay.vue'
import { ref, onMounted } from 'vue'

const categories = ref([])
const images = ref([])
const selectedTagsForImage = ref({})
const newCategoryTitle = ref('')

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

const newTag = ref({
	title: '',
	description: '',
	color: '#3498db',
	categoryId: null,
})

const API_TAGS = '/api/tags'
const API_IMAGES = '/api/images'

const fetchData = async () => {
	try {
		const [catRes, imgRes] = await Promise.all([fetch(`${API_TAGS}/categories`), fetch(API_IMAGES)])
		if (catRes.ok) categories.value = await catRes.json()
		if (imgRes.ok) {
			const imageData = await imgRes.json()
			images.value = imageData
			imageData.forEach((img) => {
				selectedTagsForImage.value[img.id] = img.tags ? img.tags.map((t) => t.id) : []
			})
		}
	} catch (error) {
		console.error('Failed to fetch data:', error)
	}
}

const addCategory = async () => {
	if (!newCategoryTitle.value) return
	try {
		const response = await fetch(
			`${API_TAGS}/categories?title=${encodeURIComponent(newCategoryTitle.value)}`,
			{ method: 'POST' },
		)
		if (response.ok) {
			newCategoryTitle.value = ''
			fetchData()
		}
	} catch (e) {
		console.error(e)
	}
}

const addTag = async () => {
	const { title, description, color, categoryId } = newTag.value
	if (!title || !categoryId) {
		alert('Title and Category are required')
		return
	}
	const params = new URLSearchParams({ title, description, color, categoryId })
	try {
		const response = await fetch(`${API_TAGS}?${params.toString()}`, { method: 'POST' })
		if (response.ok) {
			newTag.value = { title: '', description: '', color: '#3498db', categoryId: null }
			fetchData()
		}
	} catch (e) {
		console.error(e)
	}
}

const applyTagsToImage = async (imageId) => {
	const tagIds = selectedTagsForImage.value[imageId]
	try {
		const response = await fetch(`${API_IMAGES}/${imageId}/tags`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tagIds),
		})
		if (response.ok) {
			fetchData()
			alert('Image tags updated!')
		}
	} catch (error) {
		console.error('Error updating image tags:', error)
	}
}

onMounted(fetchData)
</script>
-->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import type { TagCategory } from '@/models/tag'

const categories = ref<TagCategory[]>([])
const isModalOpen = ref(false)

const fetchCategories = async () => {
	try {
		const response = await fetch('/api/tags/categories')
		if (response.ok) categories.value = await response.json()
	} catch (error) {
		console.error(error)
	}
}

const totalActiveTags = computed(() => {
	return categories.value.reduce((acc, category) => {
		return acc + (category.tags?.length || 0)
	}, 0)
})

onMounted(() => {
	fetchCategories()
})
</script>

<template>
	<main>
		<div class="header">
			<IconInput class="search" placeholder="Search tag categories...">
				<template #icon><SearchIcon></SearchIcon></template>
			</IconInput>
			<div class="vertical-line"></div>
			<GradientButton class="new" @click="isModalOpen = true">
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

		<div class="gallery"></div>
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
</style>
