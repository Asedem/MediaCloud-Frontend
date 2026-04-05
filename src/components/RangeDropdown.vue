<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DropdownIcon from './icons/DropdownIcon.vue'
import NumericInput from './NumericInput.vue'

const props = defineProps<{
	title: string
	min: number | null
	max: number | null
}>()

const emit = defineEmits<{
	(e: 'update:min', value: number | null): void
	(e: 'update:max', value: number | null): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => (isOpen.value = !isOpen.value)
const closeDropdown = () => (isOpen.value = false)

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

const isActive = () => props.min !== null || props.max !== null
</script>

<template>
	<div id="dropdown-container" ref="dropdownRef">
		<div id="field" @click="toggleDropdown" :class="{ active: isOpen, 'has-value': isActive() }">
			<div id="side">
				<span>{{ title }}</span>
				<div id="icon" :class="{ rotated: isOpen }">
					<DropdownIcon />
				</div>
			</div>
		</div>

		<div v-if="isOpen" class="menu">
			<div class="range-inputs">
				<div class="input-group">
					<label>Min</label>
					<NumericInput
						:modelValue="min"
						@update:modelValue="emit('update:min', $event)"
						placeholder="Min"
					/>
				</div>
				<div class="input-group">
					<label>Max</label>
					<NumericInput
						:modelValue="max"
						@update:modelValue="emit('update:max', $event)"
						placeholder="Max"
					/>
				</div>
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
	white-space: nowrap;
}

#field.has-value {
	border-color: var(--color-primary);
	background: color-mix(in srgb, var(--color-primary), transparent 90%);
	font-weight: 600;
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
	width: 200px;
	background: var(--color-background);
	border: 2px solid var(--color-border);
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	z-index: 10;
	padding: 16px;
}

.range-inputs {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.input-group label {
	font-size: 0.75em;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--color-subtext);
	font-weight: 600;
}
</style>
