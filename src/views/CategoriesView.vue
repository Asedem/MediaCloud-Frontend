<template>
	<main style="padding: 20px; font-family: sans-serif">
		<h1>MediaCloud Tag Manager</h1>

		<section style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px">
			<h3>Create New Category</h3>
			<input v-model="newCategoryTitle" placeholder="Category Title" />
			<button @click="addCategory">Add Category</button>
		</section>

		<section style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px">
			<h3>Add Tag to Category</h3>
			<select v-model="newTag.categoryId">
				<option :value="null">Select a Category</option>
				<option v-for="cat in categories" :key="cat.id" :value="cat.id">
					{{ cat.title }}
				</option>
			</select>
			<input v-model="newTag.title" placeholder="Tag Title" />
			<input v-model="newTag.description" placeholder="Description" />
			<input v-model="newTag.color" type="color" title="Pick a color" />
			<button @click="addTag">Add Tag</button>
		</section>

		<hr />

		<section>
			<h2>Categories & Tags</h2>
			<button @click="fetchData">Refresh Data</button>

			<div v-for="category in categories" :key="category.id" style="margin-top: 20px">
				<h4 style="margin-bottom: 5px">
					{{ category.title }} <small>(ID: {{ category.id }})</small>
				</h4>

				<ul v-if="category.tags && category.tags.length">
					<li v-for="tag in category.tags" :key="tag.id" :style="{ color: tag.color }">
						<strong>{{ tag.title }}</strong
						>: {{ tag.description }}
					</li>
				</ul>
				<p v-else style="font-size: 0.9em; color: gray">No tags in this category.</p>
			</div>
		</section>
	</main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- State ---
const categories = ref([])
const newCategoryTitle = ref('')
const newTag = ref({
	title: '',
	description: '',
	color: '#3498db',
	categoryId: null,
})

const API_BASE = '/api/tags'

// --- Methods ---

// GET /api/tags/categories
const fetchData = async () => {
	try {
		const response = await fetch(`${API_BASE}/categories`)
		if (response.ok) {
			categories.value = await response.json()
		}
	} catch (error) {
		console.error('Failed to fetch data:', error)
	}
}

// POST /api/tags/categories?title=...
const addCategory = async () => {
	if (!newCategoryTitle.value) return

	try {
		const response = await fetch(
			`${API_BASE}/categories?title=${encodeURIComponent(newCategoryTitle.value)}`,
			{
				method: 'POST',
			},
		)
		if (response.ok) {
			newCategoryTitle.value = ''
			fetchData() // Refresh list
		}
	} catch (error) {
		console.error('Error adding category:', error)
	}
}

// POST /api/tags?title=...&description=...&color=...&categoryId=...
const addTag = async () => {
	const { title, description, color, categoryId } = newTag.value
	if (!title || !categoryId) {
		alert('Title and Category are required')
		return
	}

	const params = new URLSearchParams({
		title,
		description,
		color,
		categoryId,
	})

	try {
		const response = await fetch(`${API_BASE}?${params.toString()}`, {
			method: 'POST',
		})
		if (response.ok) {
			// Reset tag form
			newTag.value = { title: '', description: '', color: '#3498db', categoryId: null }
			fetchData() // Refresh list
		}
	} catch (error) {
		console.error('Error adding tag:', error)
	}
}

// Load initial data
onMounted(fetchData)
</script>
