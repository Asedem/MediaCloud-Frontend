<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DropdownIcon from './icons/DropdownIcon.vue'

const props = defineProps<{
	items: string[]
	modelValue?: string[]
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', selected: string[]): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => (isOpen.value = !isOpen.value)

const closeDropdown = () => {
	isOpen.value = false
}

const toggleItem = (item: string) => {
	const current = [...(props.modelValue || [])]
	const index = current.indexOf(item)

	if (index === -1) {
		current.push(item)
	} else {
		current.splice(index, 1)
	}
	emit('update:modelValue', current)
}

const isSelected = (item: string) => props.modelValue?.includes(item) || false

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		closeDropdown()
	}
}

const handleEscKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		closeDropdown()
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleEscKey)
})
</script>

<template>
	<div id="dropdown-container" ref="dropdownRef">
		<div id="field" @click="toggleDropdown" :class="{ active: isOpen }">
			<div id="side">
				<slot name="text">Select Items</slot>
				<div id="icon" :class="{ rotated: isOpen }">
					<DropdownIcon />
				</div>
			</div>
		</div>

		<div v-if="isOpen" class="menu">
			<div
				v-for="item in items"
				:key="item"
				class="menu-item"
				:class="{ selected: isSelected(item) }"
				@click="toggleItem(item)"
			>
				<span class="checkbox">{{ isSelected(item) ? '✓' : '' }}</span>
				{{ item }}
			</div>
		</div>
	</div>
</template>

<style scoped>
#dropdown-container {
	position: relative;
	width: fit-content;
	user-select: none;
}

#field {
	padding: 10px 24px;
	border: 1px solid var(--color-border);
	border-radius: 16px;
	cursor: pointer;
	color: var(--color-text);
	background: var(--color-background);
	transition: 0.2s ease-out;
}

#field:hover {
	border-color: var(--color-border-hover);
}

#field #side {
	display: flex;
	align-items: center;
	gap: 12px;
}

#field #side #icon {
	width: 1.2em;
	height: 1.2em;
	display: flex;
	align-items: center;
	color: var(--color-subtext);
	transition: transform 0.3s ease;
}

#icon.rotated {
	transform: rotate(180deg);
}

.menu {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	min-width: 100%;
	background: var(--color-background);
	border: 2px solid var(--color-border);
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	z-index: 10;
	overflow: hidden;
}

.menu-item {
	padding: 10px 16px;
	cursor: pointer;
	display: flex;
	color: var(--color-text);
	align-items: center;
	gap: 10px;
	white-space: nowrap;
	transition: background 0.2s;
}

.menu-item:hover {
	background: var(--color-background-soft);
}

.menu-item.selected {
	font-weight: bold;
	color: var(--color-primary);
}

.checkbox {
	width: 16px;
	height: 16px;
	border: 1px solid var(--color-text);
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
}
</style>
