<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

const toggle = () => {
	isActive.value = !isActive.value
}
</script>

<template>
	<div id="toggle-container" @click="toggle" :class="{ active: isActive }">
		<div id="indicator"></div>

		<div class="icon-wrapper left">
			<slot name="icon-left"></slot>
		</div>
		<div class="icon-wrapper right">
			<slot name="icon-right"></slot>
		</div>
	</div>
</template>

<style scoped>
#toggle-container {
	position: relative;
	display: flex;
	align-items: center;
	padding: 6px;
	background: var(--color-background-soft);
	border-radius: 16px;
	cursor: pointer;
	user-select: none;
	width: fit-content;
	transition: 0.2s ease-out;
	border: 1px solid transparent;
}

#toggle-container:hover {
	border-color: var(--color-border-hover);
}

#indicator {
	position: absolute;
	height: calc(100% - 12px);
	width: calc(50% - 6px);
	background: var(--color-background);
	border-radius: 8px;
	transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

#toggle-container.active #indicator {
	transform: translateX(100%);
}

.icon-wrapper {
	position: relative;
	z-index: 1;
	width: 2.2em;
	height: 1.8em;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-subtext);
	transition: color 0.2s ease;
}

#toggle-container:not(.active) .left,
#toggle-container.active .right {
	color: var(--color-text);
}

.icon-wrapper :deep(svg) {
	width: 1.2em;
	height: 1.2em;
	display: block;
}
</style>
