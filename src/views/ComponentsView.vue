<script setup lang="ts">
import ContrastButton from '@/components/ContrastButton.vue'
import GradientButton from '@/components/GradientButton.vue'
import IconInput from '@/components/IconInput.vue'
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue'
import BookmarksIcon from '@/components/icons/BookmarksIcon.vue'
import ComponentIcon from '@/components/icons/ComponentIcon.vue'
import ComponentIconFilled from '@/components/icons/ComponentIconFilled.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ImageIconFilled from '@/components/icons/ImageIconFilled.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import IconToggle from '@/components/IconToggle.vue'
import ImageCrad from '@/components/ImageCrad.vue'
import SidebarButton from '@/components/SidebarButton.vue'
import SimpleInput from '@/components/SimpleInput.vue'
import SubtleButton from '@/components/SubtleButton.vue'
import TagDisplay from '@/components/TagDisplay.vue'
import TextToggle from '@/components/TextToggle.vue'
import ToggleDropdown from '@/components/ToggleDropdown.vue'
</script>

<template>
	<main>
		<h1>Component Library</h1>

		<h2>Gradient Button</h2>
		<p>The main Button for uploading media, or selecting all media</p>
		<GradientButton>
			<template #text>Upload Media</template>
		</GradientButton>

		<h2>Contrast Button</h2>
		<p>Button used for secondary, but important tasks</p>
		<ContrastButton>
			<template #text>Fetch</template>
		</ContrastButton>

		<h2>Subtle Button</h2>
		<p>A Button used to unlikely options</p>
		<SubtleButton>
			<template #text>Cancel</template>
		</SubtleButton>

		<h2>Sidebar Button</h2>
		<p>The button used for navigation, sitting in the sidebar</p>
		<SidebarButton route="/components">
			<template #icon><ComponentIcon></ComponentIcon></template>
			<template #icon-active><ComponentIconFilled></ComponentIconFilled></template>
			<template #text>Componenets</template>
		</SidebarButton>
		<SidebarButton route="/images">
			<template #icon><ImageIcon></ImageIcon></template>
			<template #icon-active><ImageIconFilled></ImageIconFilled></template>
			<template #text>Images</template>
		</SidebarButton>

		<h2>Tag</h2>
		<p>How a tag is displayed below a represtentation of a media</p>
		<TagDisplay color="#2563eb">
			<template #text>CLASSIC</template>
		</TagDisplay>
		<TagDisplay color="#9333ea">
			<template #text>MANUAL</template>
		</TagDisplay>

		<h2>Simple Input</h2>
		<p>Simple text input component</p>
		<SimpleInput placeholder="Enter name"></SimpleInput>

		<h2>Icon Input</h2>
		<p>Text input component with an icon up front</p>
		<IconInput placeholder="Serach for anything...">
			<template #icon><SearchIcon></SearchIcon></template>
		</IconInput>

		<h2>Toggle Dropdown</h2>
		<p>A dropdown menu to expose multiple toggle buttons</p>
		<ToggleDropdown :items="['Item 1', 'Item 2', 'Item 3']">
			<template #text>Option</template>
		</ToggleDropdown>

		<h2>Icon Toggle</h2>
		<p>A Toggle, that can toggle between 2 stated, indecated by icons</p>
		<IconToggle>
			<template #icon-left><BookmarkIcon></BookmarkIcon></template>
			<template #icon-right><BookmarksIcon></BookmarksIcon></template>
		</IconToggle>

		<h2>Text Toggle</h2>
		<p>A Toggle, that can toggle between 2 stated, indecated by text</p>
		<TextToggle>
			<template #left>First text</template>
			<template #right>Second text</template>
		</TextToggle>

		<h2>Image Card</h2>
		<p>The card to display the images and corresponding data</p>
		<ImageCrad :id="3" title="Test"></ImageCrad>
	</main>
</template>

<style scoped>
main {
	width: 100%;
	padding: 40px 50px;
	overflow-y: scroll;
}

h2 {
	margin-top: 24px;
}
p {
	margin-bottom: 10px;
}
</style>
