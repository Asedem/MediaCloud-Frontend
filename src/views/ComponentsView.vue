<script setup lang="ts">
import { ref } from 'vue'
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
import ImageCard from '@/components/ImageCard.vue'
import SidebarButton from '@/components/SidebarButton.vue'
import SimpleInput from '@/components/SimpleInput.vue'
import NumericInput from '@/components/NumericInput.vue'
import SubtleButton from '@/components/SubtleButton.vue'
import TagDisplay from '@/components/TagDisplay.vue'
import TextToggle from '@/components/TextToggle.vue'
import ToggleDropdown from '@/components/ToggleDropdown.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const demoNumber = ref(42)
const isConfirmOpen = ref(false)
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

		<h2>Numeric Input</h2>
		<p>Custom number input component for static tag values</p>
		<div style="width: 200px">
			<NumericInput v-model="demoNumber" placeholder="Enter number"></NumericInput>
			<p style="font-size: 0.8em; margin-top: 5px">Value: {{ demoNumber }}</p>
		</div>

		<h2>Confirmation Modal</h2>
		<p>Custom dialogue for confirming destructive actions</p>
		<ContrastButton @click="isConfirmOpen = true">
			<template #text>Show Demo Modal</template>
		</ContrastButton>
		<ConfirmationModal
			:isOpen="isConfirmOpen"
			title="Confirm Action"
			message="This is a custom confirmation dialogue. Are you sure you want to proceed?"
			@close="isConfirmOpen = false"
			@confirm="isConfirmOpen = false"
		/>

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
		<IconToggle :modelValue="false">
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
		<ImageCard
			:id="1"
			title="Card title"
			:tags="[{ id: 1, title: 'Tag', description: 'Boolean Tag', color: '#2352cc' }]"
			:static-tag-values="[
				{
					id: 1,
					definition: { title: 'HP', description: 'Horsepower' },
					value: 350,
				},
			]"
			class="image-card"
		>
		</ImageCard>
	</main>
</template>

<style scoped>
main {
	width: 100%;
	padding: 40px 50px;
	overflow-y: scroll;
}

h2 {
	margin-top: 32px;
}

p {
	margin-bottom: 10px;
}

.image-card {
	width: 280px;
}
</style>
