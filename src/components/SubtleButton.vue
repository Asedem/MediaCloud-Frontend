<template>
	<button>
		<slot name="text"></slot>
	</button>
</template>

<style scoped>
button {
	padding: 12px 24px;
	font-weight: 600;
	font-size: 1em;
	white-space: nowrap;
	color: var(--color-text);
	border: none;
	border-radius: 16px;
	background: transparent;
	transition: 0.2s ease-out;
}

button:hover {
	background: var(--color-background-soft);
	cursor: pointer;
}

button:active {
	transform: scale(97%);
}
</style>
