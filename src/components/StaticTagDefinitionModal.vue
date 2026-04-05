<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StaticTagDefinition } from '@/models/staticTag'
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'
import SimpleInput from './SimpleInput.vue'

const props = defineProps<{
	isOpen: boolean
	definition: StaticTagDefinition | null
}>()

const emit = defineEmits(['close', 'saved', 'delete'])

const title = ref('')
const description = ref('')

watch(
	() => props.isOpen,
	(newVal) => {
		if (newVal) {
			if (props.definition) {
				title.value = props.definition.title
				description.value = props.definition.description || ''
			} else {
				title.value = ''
				description.value = ''
			}
		}
	},
)

const saveDefinition = async () => {
	if (!title.value) return

	try {
		const method = props.definition ? 'PUT' : 'POST'
		const url = props.definition
			? `/api/static-tags/definitions/${props.definition.id}`
			: '/api/static-tags/definitions'

		const params = new URLSearchParams({
			title: title.value,
			description: description.value,
		})

		const response = await fetch(`${url}?${params.toString()}`, {
			method,
		})

		if (response.ok) {
			emit('saved')
			emit('close')
		}
	} catch (error) {
		console.error('Failed to save static tag definition:', error)
	}
}
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<div>
					<h2>{{ definition ? 'Edit Static Tag' : 'Create Static Tag' }}</h2>
					<p>Every image will store a unique value for this tag.</p>
				</div>
				<button v-if="definition" class="delete-btn" @click="emit('delete', definition)">
					Delete
				</button>
			</div>
			<br />
			<SimpleInput v-model="title" placeholder="Tag Title" />
			<br />
			<SimpleInput v-model="description" placeholder="Description" />

			<div class="actions">
				<SubtleButton @click="emit('close')">
					<template #text>Cancel</template>
				</SubtleButton>
				<GradientButton @click="saveDefinition" :disabled="!title">
					<template #text>Save Tag</template>
				</GradientButton>
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
}

.modal-content {
	background: var(--color-background);
	padding: 2rem;
	border-radius: 8px;
	width: 400px;
	max-width: 90vw;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
}

.delete-btn {
	background: rgba(231, 76, 60, 0.1);
	color: #e74c3c;
	border: 1px solid rgba(231, 76, 60, 0.2);
	padding: 6px 12px;
	border-radius: 8px;
	font-size: 0.8em;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	flex-shrink: 0;
}

.delete-btn:hover {
	background: #e74c3c;
	color: white;
}

h2 {
	margin-bottom: 0.2rem;
	font-size: 1.2rem;
}

p {
	color: var(--color-subtext);
	font-size: 0.85em;
	line-height: 1.3;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 24px;
}
</style>
