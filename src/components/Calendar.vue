<script setup>
defineOptions({ name: "CalendarComponentsCalendar" });

import { computed, provide, inject, watch, useAttrs } from "vue";

// locales
import { locale as l, dateToString } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/calendar-locales";
import { en as coreEn } from "@svar-ui/core-locales";

// stores
import { writable } from "@svar-ui/lib-vue";
import { EventBusRouter } from "@svar-ui/lib-state";
import { CalendarStore } from "@svar-ui/calendar-store";

// ui
import Layout from "./Layout.vue";

// incoming parameters
const props = defineProps({
	events: {},
	init: { default: undefined },
	readonly: { default: undefined },
	view: { default: undefined },
	views: { default: undefined },
	toolbar: { default: undefined },
	cellCss: { default: undefined },
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	date: { default: undefined },
	recurring: { default: undefined },
	tooltip: { default: undefined },
	eventPopup: { default: undefined },
});

const attrs = useAttrs();

// uses same logic as the Locale component
const words = { ...coreEn, ...en };
let locale = inject("wx-i18n", undefined);
if (!locale) locale = l(words);
else locale = locale.extend(words, true);
provide("wx-i18n", locale);

// create date format helper that resolves format names and format strings
const rawLocale = locale.getRaw();
const fmt = (format) => {
	const resolved = rawLocale?.eventCalendar?.[format] ?? format;
	return dateToString(resolved, rawLocale?.calendar);
};

// init stores
const dataStore = new CalendarStore(writable, {
	recurring: props.recurring ?? false,
	weekStart: rawLocale?.calendar?.weekStart ?? 1,
	dateFormat: fmt,
});

// define event route
const firstInRoute = dataStore.in;

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();
let lastInRoute = new EventBusRouter((a, b) => {
	emit(a, b);
});
firstInRoute.setNext(lastInRoute);

// public API
const getState = dataStore.getState.bind(dataStore);
const getReactiveState = dataStore.getReactive.bind(dataStore);
const getStores = () => ({ data: dataStore });
const getEvents = dataStore.getEvents.bind(dataStore);
const getEvent = dataStore.getEvent.bind(dataStore);
const exec = firstInRoute.exec;
const setNext = (ev) => (lastInRoute = lastInRoute.setNext(ev));
const intercept = firstInRoute.intercept.bind(firstInRoute);
const on = firstInRoute.on.bind(firstInRoute);
const detach = firstInRoute.detach.bind(firstInRoute);

const api = {
	exec,
	setNext,
	intercept,
	on,
	detach,
	getState,
	getReactiveState,
	getStores,
	getEvents,
	getEvent,
};

const viewOptions = computed(() =>
	(props.views ?? ["day", "week", "month"]).map(v => {
		if (typeof v === "string") {
			return { id: v };
		}
		return { ...v };
	})
);

// common API available in components
const stateStore = {
	getState: dataStore.getState.bind(dataStore),
	getReactiveState: dataStore.getReactive.bind(dataStore),
	exec: firstInRoute.exec.bind(firstInRoute),
	getEvent,
	fmt,
};
provide("calendar-api", stateStore);

let init_once = true;
const reinitStore = () => {
	dataStore.configureViews(viewOptions.value);
	dataStore.init({
		currentView: props.view ?? "day",
		currentDate: props.date,
		events: props.events,
	});

	if (init_once && props.init) {
		props.init(api);
		init_once = false;
	}
};

reinitStore();

watch(
	[() => props.events, () => props.view, () => props.date, () => props.views],
	() => {
		reinitStore();
	},
	{ deep: true }
);

defineExpose({
	getState,
	getReactiveState,
	getStores,
	getEvents,
	getEvent,
	exec,
	setNext,
	intercept,
	on,
	detach,
});
</script>

<template>
	<Layout
		:store="stateStore"
		:views="viewOptions"
		:brandmark="dataStore.getBrandmark()"
		:toolbar="toolbar"
		:cell-css="cellCss"
		:event-css="eventCss"
		:event-content="eventContent"
		:tooltip="tooltip"
		:event-popup="eventPopup"
		:readonly="readonly ?? false"
	>
		<slot v-if="$slots.default" />
	</Layout>
</template>
