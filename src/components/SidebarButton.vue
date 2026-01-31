<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps(['route'])
</script>

<template>
	<RouterLink :to="route" id="button" active-class="active">
		<div id="side">
			<div id="icon">
				<span id="icon-default"><slot name="icon"></slot></span>
				<span id="icon-active"><slot name="icon-active"></slot></span>
			</div>
			<slot name="text"></slot>
		</div>
	</RouterLink>
</template>

<style scoped>
#button {
	display: inline-block;
	text-decoration: none;
	padding: 10px 24px;
	font-weight: 600;
	font-size: 1em;
	color: var(--color-text);
	border: none;
	border-radius: 16px;
	background: var(--color-background);
	transition: 0.2s ease-out;
}

#button #side {
	display: flex;
	justify-content: center;
	align-items: center;
	width: min-content;
}

#button #side #icon {
	width: 1.2em;
	height: 1.2em;
	margin-right: 0.5em;
	display: flex;
	align-items: center;
	justify-content: center;
}

#icon-default,
#icon-active {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

#icon svg {
	display: block;
}

#icon-active {
	display: none;
}

#button.active #icon-default {
	display: none;
}

#button.active #icon-active {
	display: inline-block;
}

#button:hover,
#button.active {
	background: var(--color-background-soft);
	cursor: pointer;
}
</style>
