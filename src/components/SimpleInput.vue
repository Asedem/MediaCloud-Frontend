<script setup lang="ts">
defineProps(['placeholder', 'modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
	<div id="bar">
		<div id="side">
			<input
				type="text"
				:placeholder="placeholder"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			/>
		</div>
	</div>
</template>

<style scoped>
#bar {
	display: flex;
	padding: 10px 14px;
	border: 2px solid transparent;
	border-radius: 16px;
	background: var(--color-background-soft);
	transition: 0.2s ease-out;
}

#bar:focus-within {
	border-color: color-mix(
		in srgb,
		var(--color-primary),
		var(--color-foreward) var(--color-backward-modifier)
	);
}

#bar #side {
	display: flex;
	align-items: center;
	width: 100%;
}

#bar #side #icon {
	width: 1.2em;
	height: 1.2em;
	margin-right: 0.5em;
	display: flex;
	align-items: center;
	color: var(--color-subtext);
	flex-shrink: 0;
	transition: color 0.2s ease;
}

#bar #side input {
	background: transparent;
	border: none;
	outline: none;
	font-weight: 500;
	font-size: 1em;
	flex-grow: 1;
	width: 100%;
	color: var(--color-text);
}

#bar #side input::placeholder {
	color: var(--color-subtext);
}

#icon svg {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
