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
				<template #icon><HomeIcon></HomeIcon></template>
				<template #icon-active><HomeIconFilled></HomeIconFilled></template>
				<template #text>Home</template>
			</SidebarButton>
			<SidebarButton route="/images" class="sidebar-button">
				<template #icon><ImageIcon></ImageIcon></template>
				<template #icon-active><ImageIconFilled></ImageIconFilled></template>
				<template #text>Images</template>
			</SidebarButton>
			<SidebarButton route="/videos" class="sidebar-button">
				<template #icon><VideoIcon></VideoIcon></template>
				<template #icon-active><VideoIconFilled></VideoIconFilled></template>
				<template #text>Videos</template>
			</SidebarButton>
			<SidebarButton route="/components" class="sidebar-button">
				<template #icon><ComponentIcon></ComponentIcon></template>
				<template #icon-active><ComponentIconFilled></ComponentIconFilled></template>
				<template #text>Componenets</template>
			</SidebarButton>
		</div>
	</div>
	<RouterView class="body" />
</template>

<style>
#app {
	display: grid;
	grid-template-columns: 16rem 1fr;
	grid-template-rows: 1fr;
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	height: 100dvh;
	overflow: hidden;
}

.sidebar {
	grid-area: 1 / 1 / 2 / 2;
	height: 100%;
	border-right: 1px solid var(--color-border);
	overflow-y: hidden;
}

.body {
	grid-area: 1 / 2 / 2 / 3;
	height: 100%;
	overflow-y: auto;
}
</style>

<style scoped>
.navigation {
	display: flex;
	flex-direction: column;
	margin-top: 30px;
}

.sidebar .sidebar-button {
	width: 80%;
	margin-top: 5px;
	margin-left: auto;
	margin-right: auto;
}

.profile {
	display: flex;
	align-items: center;
	margin-top: 30px;
	margin-left: 30px;
}

.profile img {
	height: 48px;
	width: 48px;
	border-radius: 16px;
	border: 2px solid var(--color-border);
	margin-right: 0.5em;
}

.name {
	color: var(--color-text);
}

.plan {
	font-size: 0.7em;
}
</style>
