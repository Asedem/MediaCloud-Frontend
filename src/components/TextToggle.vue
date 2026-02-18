<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
	modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const containerRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)

const indicatorStyle = ref({
	width: '0px',
	transform: 'translateX(0px)',
})

const updateIndicator = () => {
	const activeElement = props.modelValue ? rightRef.value : leftRef.value
	if (activeElement && containerRef.value) {
		const containerRect = containerRef.value.getBoundingClientRect()
		const activeRect = activeElement.getBoundingClientRect()

		indicatorStyle.value = {
			width: `${activeRect.width}px`,
			transform: `translateX(${activeRect.left - containerRect.left}px)`,
		}
	}
}

const toggle = () => {
	emit('update:modelValue', !props.modelValue)
}

watch(
	() => props.modelValue,
	() => {
		nextTick(updateIndicator)
	},
)

onMounted(() => {
	updateIndicator()
	window.addEventListener('resize', updateIndicator)
})
</script>

<template>
	<div
		ref="containerRef"
		id="text-toggle-container"
		@click="toggle"
		:class="{ active: props.modelValue }"
	>
		<div id="indicator" :style="indicatorStyle"></div>

		<div ref="leftRef" class="label-wrapper left">
			<slot name="left"></slot>
		</div>
		<div ref="rightRef" class="label-wrapper right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<style scoped>
#text-toggle-container {
	position: relative;
	display: inline-flex;
	align-items: center;
	padding: 4px;
	background: var(--color-background-soft);
	border-radius: 16px;
	cursor: pointer;
	user-select: none;
	border: 1px solid transparent;
	transition: border-color 0.2s ease;
}

#text-toggle-container:hover {
	border-color: var(--color-border-hover);
}

#indicator {
	position: absolute;
	height: calc(100% - 8px);
	background: var(--color-background);
	border-radius: 12px;
	transition:
		transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
		width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
	left: 0;
}

.label-wrapper {
	position: relative;
	z-index: 1;
	padding: 6px 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
	font-weight: 500;
	color: var(--color-subtext);
	transition: color 0.2s ease;
	white-space: nowrap;
}

#text-toggle-container:not(.active) .left,
#text-toggle-container.active .right {
	color: var(--color-text);
}
</style>
