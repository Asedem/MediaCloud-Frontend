<script setup lang="ts">
import GradientButton from '@/components/GradientButton.vue'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <main>
    <div class="header">
      <SearchBar class="search"></SearchBar>
      <div class="vertical-line"></div>
      <GradientButton class="new">
        <template #text>Upload Media</template>
      </GradientButton>
    </div>
    <div class="filter">
      <GradientButton class="all">
        <template #text>Show all Media</template>
      </GradientButton>
    </div>
  </main>
</template>

<style scoped>
.header,
.filter {
  width: 100%;
  height: 5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0 32px;
}

.search {
  width: 100%;
}

.vertical-line {
  border-left: 1px solid var(--color-border);
  height: 1.5em;
  margin: 0 16px;
}
</style>
