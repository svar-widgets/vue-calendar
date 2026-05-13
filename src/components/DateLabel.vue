<script setup>
import { inject } from 'vue';
import { subscribe } from '@svar-ui/lib-vue';

const store = inject('calendar-api');
const { rangeLabel } = store.getReactiveState();
const rangeLabelValue = subscribe(rangeLabel);
</script>

<template>
	<span class="wx-date-label" role="heading" aria-level="2" aria-live="polite" aria-atomic="true">{{ rangeLabelValue }}</span>
</template>

<style scoped>
.wx-date-label {
	font-size: var(--wx-font-size-hd);
	flex-grow: 1;
}
</style>
