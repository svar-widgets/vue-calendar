<script setup>
defineOptions({ inheritAttrs: false });

import { inject } from 'vue';
import { Button } from '@svar-ui/vue-core';

const store = inject('calendar-api');
const _ = inject('wx-i18n').getGroup('eventCalendar');

function today() {
	store.exec('navigate-time', { direction: 'now' });
}
</script>

<template>
	<Button :onclick="today">{{ _('Today') }}</Button>
</template>
