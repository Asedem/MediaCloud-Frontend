<script setup lang="ts">
import SubtleButton from './SubtleButton.vue'
import GradientButton from './GradientButton.vue'

defineProps<{
	isOpen: boolean
	title: string
	message: string
	confirmText?: string
	cancelText?: string
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
		<div class="modal-content">
			<div class="header">
				<h2>{{ title }}</h2>
			</div>
			<p class="message">{{ message }}</p>

			<div class="actions">
				<SubtleButton @click="emit('close')">
					<template #text>{{ cancelText || 'Cancel' }}</template>
				</SubtleButton>
				<button class="confirm-btn" @click="emit('confirm')">
					{{ confirmText || 'Confirm' }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(8px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2000;
}

.modal-content {
	background: var(--color-background);
	padding: 2rem;
	border-radius: 24px;
	width: 400px;
	max-width: 90vw;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.header h2 {
	margin: 0 0 1rem 0;
	font-size: 1.4rem;
	font-weight: 700;
	color: var(--color-text);
}

.message {
	color: var(--color-subtext);
	line-height: 1.5;
	margin-bottom: 2rem;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.confirm-btn {
	background: #e74c3c;
	color: white;
	border: none;
	padding: 10px 24px;
	border-radius: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
}

.confirm-btn:hover {
	background: #c0392b;
	transform: translateY(-2px);
}

.confirm-btn:active {
	transform: translateY(0);
}
</style>
