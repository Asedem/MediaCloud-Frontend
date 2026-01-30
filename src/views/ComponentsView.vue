<script setup lang="ts">
import GradientButton from '@/components/GradientButton.vue'
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue'
import BookmarksIcon from '@/components/icons/BookmarksIcon.vue'
import ComponentIcon from '@/components/icons/ComponentIcon.vue'
import ComponentIconFilled from '@/components/icons/ComponentIconFilled.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ImageIconFilled from '@/components/icons/ImageIconFilled.vue'
import IconToggle from '@/components/IconToggle.vue'
import SearchBar from '@/components/SearchBar.vue'
import SidebarButton from '@/components/SidebarButton.vue'
import TagDisplay from '@/components/TagDisplay.vue'
import ToggleDropdown from '@/components/ToggleDropdown.vue'
</script>

<template>
  <main>
    <h1>Component Library</h1>

    <h2>Main Button</h2>
    <p>The main Button for uploading media, or selecting all media</p>
    <GradientButton>
      <template #text>Upload Media</template>
    </GradientButton>

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

    <h2>Search Bar</h2>
    <p>The Search bar on top of every side, that displays media</p>
    <SearchBar></SearchBar>

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
