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
  color: var(--color-background);
  border: none;
  border-radius: 16px;
  background: var(--color-text);
  transition: 0.2s ease-out;
}

button:hover {
  transform: scale(102%);
  box-shadow: 0 5px 20px color-mix(
    in srgb,
    var(--color-text),
    transparent 70%
  );
  cursor: pointer;
}

button:active {
  transform: scale(99%);
}
</style>
