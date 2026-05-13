<script setup>
defineOptions({ inheritAttrs: false });

import { inject } from 'vue';
import { Button } from '@svar-ui/vue-core';

const store = inject('calendar-api');

function addEvent() {
	store.exec('add-event', { event: {}, edit: true });
}
</script>

<template>
	<Button icon="wxi-plus" type="primary" :onclick="addEvent"></Button>
</template>
