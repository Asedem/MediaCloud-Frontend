<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['color'])

const tagStyles = computed(() => ({
  '--base-color': props.color,
}))
</script>

<template>
  <div class="tag" :style="tagStyles">
    <slot name="text"></slot>
  </div>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75em;
  color: var(--base-color);
  background-color: color-mix(
    in srgb,
    var(--base-color),
    var(--color-foreward) var(--color-foreward-modifier)
  );
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
