<script setup lang="ts">
defineProps<{
	placeholder?: string
	modelValue: number | null
	min?: number
	max?: number
	step?: number
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const val = target.value === '' ? null : Number(target.value)
	emit('update:modelValue', val)
}
</script>

<template>
	<div id="bar">
		<div id="side">
			<input
				type="number"
				:placeholder="placeholder"
				:value="modelValue"
				:min="min"
				:max="max"
				:step="step"
				@input="onInput"
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

/* Hide spin buttons for cleaner look, but keep them accessible if needed */
#bar #side input::-webkit-outer-spin-button,
#bar #side input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

#bar #side input[type='number'] {
	-moz-appearance: textfield;
}
</style>
