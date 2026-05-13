<script setup>
import { inject } from 'vue';
import { Button } from '@svar-ui/vue-core';

const store = inject('calendar-api');
const _ = inject('wx-i18n').getGroup('eventCalendar');

function next() {
	store.exec('navigate-time', { direction: 'next' });
}

function prev() {
	store.exec('navigate-time', { direction: 'previous' });
}
</script>

<template>
	<div class="wx-date-nav" role="group" :aria-label="_('Date navigation')">
		<Button icon="wxi-angle-left" :onclick="prev" />
		<Button icon="wxi-angle-right" :onclick="next" />
	</div>
</template>

<style scoped>
.wx-date-nav {
	display: flex;
	align-items: center;
}
.wx-date-nav :deep(button:first-child) {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
.wx-date-nav :deep(button:last-child) {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
