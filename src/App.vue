<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarButton from './components/SidebarButton.vue'
import ImageIcon from './components/icons/ImageIcon.vue'
import ImageIconFilled from './components/icons/ImageIconFilled.vue'
import VideoIcon from './components/icons/VideoIcon.vue'
import VideoIconFilled from './components/icons/VideoIconFilled.vue'
import ComponentIcon from './components/icons/ComponentIcon.vue'
import ComponentIconFilled from './components/icons/ComponentIconFilled.vue'
import HomeIcon from './components/icons/HomeIcon.vue'
import HomeIconFilled from './components/icons/HomeIconFilled.vue'
import TagIcon from './components/icons/TagIcon.vue'
import TagIconFilled from './components/icons/TagIconFilled.vue'
</script>

<template>
	<div class="sidebar">
		<div class="profile">
			<img src="./assets/mock_profile.png" alt="Profile Picture" />
			<div class="pair">
				<p class="name">Lukas King</p>
				<p class="plan">PRO MEMBER</p>
			</div>
		</div>
		<div class="navigation">
			<SidebarButton route="/" class="sidebar-button">
				<template #icon><HomeIcon /></template>
				<template #icon-active><HomeIconFilled /></template>
				<template #text>Home</template>
			</SidebarButton>
			<SidebarButton route="/images" class="sidebar-button">
				<template #icon><ImageIcon /></template>
				<template #icon-active><ImageIconFilled /></template>
				<template #text>Images</template>
			</SidebarButton>
			<SidebarButton route="/videos" class="sidebar-button">
				<template #icon><VideoIcon /></template>
				<template #icon-active><VideoIconFilled /></template>
				<template #text>Videos</template>
			</SidebarButton>
			<SidebarButton route="/categories" class="sidebar-button">
				<template #icon><TagIcon /></template>
				<template #icon-active><TagIconFilled /></template>
				<template #text>Categories</template>
			</SidebarButton>
			<SidebarButton route="/components" class="sidebar-button">
				<template #icon><ComponentIcon /></template>
				<template #icon-active><ComponentIconFilled /></template>
				<template #text>Components</template>
			</SidebarButton>
		</div>
	</div>
	<RouterView class="body" />
</template>

<style>
/* Base Mobile Layout (Mobile First) */
#app {
	display: flex;
	flex-direction: column;
	height: 100dvh;
	overflow: hidden;
}

.body {
	flex: 1;
	overflow-y: auto;
	order: 1; /* Content stays on top */
}

.sidebar {
	order: 2; /* Sidebar moves to bottom */
	border-top: 1px solid var(--color-border);
	background: var(--color-background);
	z-index: 10;
}

/* Desktop Layout Overrides */
@media (min-width: 768px) {
	#app {
		display: grid;
		grid-template-columns: 16rem 1fr;
		flex-direction: row;
	}

	.sidebar {
		order: 0;
		border-top: none;
		border-right: 1px solid var(--color-border);
	}
}
</style>

<style scoped>
/* Profile: Hidden on mobile to save space, shown on desktop */
.profile {
	display: none;
}

@media (min-width: 768px) {
	.profile {
		display: flex;
		align-items: center;
		margin-top: 30px;
		margin-left: 30px;
	}
}

.profile img {
	height: 48px;
	width: 48px;
	border-radius: 16px;
	border: 2px solid var(--color-border);
	margin-right: 0.5em;
}

/* Navigation: Horizontal on mobile, Vertical on desktop */
.navigation {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 10px 0;
}

@media (min-width: 768px) {
	.navigation {
		flex-direction: column;
		justify-content: flex-start;
		margin-top: 30px;
	}
}

.sidebar-button {
	margin: 0;
	width: auto;
}

@media (min-width: 768px) {
	.sidebar .sidebar-button {
		width: 80%;
		margin: 5px auto 0 auto;
	}
}

.name {
	color: var(--color-text);
}
.plan {
	font-size: 0.7em;
}
</style>
