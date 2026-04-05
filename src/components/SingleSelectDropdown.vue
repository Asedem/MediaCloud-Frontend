<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DropdownIcon from './icons/DropdownIcon.vue'

const props = defineProps<{
	options: { label: string; value: string }[]
	modelValue: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => (isOpen.value = !isOpen.value)
const closeDropdown = () => (isOpen.value = false)

const selectOption = (value: string) => {
	emit('update:modelValue', value)
	closeDropdown()
}

const getSelectedLabel = () => {
	const option = props.options.find((o) => o.value === props.modelValue)
	return option ? option.label : 'Select'
}

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
		closeDropdown()
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<div id="dropdown-container" ref="dropdownRef">
		<div id="field" @click="toggleDropdown" :class="{ active: isOpen }">
			<div id="side">
				<span class="label"><slot name="text">Sort By</slot>:</span>
				<span class="value">{{ getSelectedLabel() }}</span>
				<div id="icon" :class="{ rotated: isOpen }">
					<DropdownIcon />
				</div>
			</div>
		</div>

		<div v-if="isOpen" class="menu">
			<div
				v-for="option in options"
				:key="option.value"
				class="menu-item"
				:class="{ selected: modelValue === option.value }"
				@click="selectOption(option.value)"
			>
				{{ option.label }}
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
	gap: 8px;
}

.label {
	font-size: 0.9em;
	color: var(--color-subtext);
}

.value {
	font-weight: 600;
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
	background: color-mix(in srgb, var(--color-primary), transparent 90%);
}
</style>
