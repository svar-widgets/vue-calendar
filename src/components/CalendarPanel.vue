<script setup>
import { inject, ref, computed, watch } from "vue";
import { writable, subscribe } from "@svar-ui/lib-vue";
import { Calendar, Checkbox } from "@svar-ui/vue-core";

const props = defineProps({
	calendars: {},
	accessor: { default: "calendarId" },
	open: { default: true },
	onchange: { default: undefined },
});

// i18n support with fallback
const i18n = inject("wx-i18n");
const _ = i18n?.getGroup("eventCalendar");

// Calendar API from context (available when placed inside Calendar widget)
const calendarApi = inject("calendar-api");
const reactiveState = calendarApi?.getReactiveState();
const currentDate = subscribe(
	reactiveState?.currentDate ?? writable(new Date())
);
const visibleDateRange = subscribe(
	reactiveState?.visibleDateRange ??
		writable({ start: new Date(), end: new Date() })
);

const rangeMarkers = computed(() => {
	const range = visibleDateRange.value;
	const startTime = range.start.getTime();
	const endTime = range.end.getTime();
	return (date) => {
		const t = date.getTime();
		return t >= startTime && t < endTime ? "wx-view-range" : "";
	};
});

const active = ref({});

function buildActive(cals) {
	return cals.reduce(
		(acc, cal) => {
			acc[cal.id] = cal.active !== false;
			return acc;
		},
		{}
	);
}

function applyFilter() {
	const value = [];
	for (const a in active.value) {
		if (active.value[a]) value.push(a);
	}

	const filter =
		value.length === props.calendars.length
			? null
			: (event) =>
					active.value[event[props.accessor]];

	if (calendarApi) {
		calendarApi.exec("filter-events", {
			filter,
			tag: "calendar-panel",
		});
	}
	props.onchange?.({ value, filter });
}

function toggle(id) {
	active.value[id] = !active.value[id];
	applyFilter();
}

watch(
	() => props.calendars,
	(cals) => {
		active.value = buildActive(cals);
		if (cals.some((c) => c.active === false)) applyFilter();
	},
	{ immediate: true }
);

function onDateChange({ value }) {
	if (value && calendarApi) {
		calendarApi.exec("navigate-to", { date: value });
	}
}
</script>

<template>
	<div v-if="props.open"
		class="wx-calendar-panel"
	>
		<div role="group" :aria-label="_('Calendar filters')">
			<div
				v-for="cal in props.calendars"
				:key="cal.id"
				class="wx-calendar-name"
				:class="cal.css"
			>
				<Checkbox
					:value="active[cal.id] ?? true"
					:onchange="() => toggle(cal.id)"
					:label="cal.label"
				/>
			</div>
		</div>

		<div class="wx-calendar-panel-bottom">
			<Calendar
				:buttons="false"
				:value="currentDate"
				:onchange="onDateChange"
				:markers="rangeMarkers"
			/>
		</div>
	</div>
</template>

<style scoped>
.wx-calendar-panel {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: var(--wx-padding);
	overflow: hidden;
}


.wx-calendar-panel-toggle {
	background: none;
	border: var(--wx-border);
	cursor: pointer;
	padding: 4px 3px;
	font-size: var(--wx-icon-size);
	line-height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--wx-color-font);
	flex-shrink: 0;
	border-radius: var(--wx-border-radius);
	outline: none;
}

.wx-calendar-panel-toggle:hover {
	background: var(--wx-background-hover);
}

.wx-calendar-name {
	margin-top: 4px;
	border: none !important;
	border-radius: var(--wx-border-radius);
	padding: 4px;
}

.wx-calendar-panel-color {
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: var(--wx-icon-border-radius);
	flex-shrink: 0;
}

.wx-calendar-panel-label {
	white-space: nowrap;
	overflow: hidden;
	opacity: 1;
	max-width: 200px;
	transition:
		opacity 0.3s ease,
		max-width 0.3s ease;
}

.wx-calendar-panel-bottom :deep(.wx-view-range:not(.wx-selected):not(.wx-out)) {
	background: var(--wx-color-primary-selected);
	border-radius: 0;
}
</style>
