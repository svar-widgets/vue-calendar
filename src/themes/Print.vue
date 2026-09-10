<script setup>
defineOptions({ name: "CalendarThemesPrint" });

import Willow from "./Willow.vue";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
	<Willow v-if="$slots.default" :fonts="props.fonts">
		<div class="wx-print-theme">
			<slot />
		</div>
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style>
.wx-print-theme {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	/* surfaces - strip filled backgrounds, keep neutral page */
	--wx-background: #ffffff;
	--wx-background-alt: #ffffff;
	--wx-background-hover: transparent;
	--wx-color-primary: #1f6bd9;
	--wx-color-primary-selected: transparent;
	--wx-color-secondary-hover: transparent;
	--wx-color-font-alt: #555d68;
	--wx-icon-color: #555d68;

	/* calendar surfaces */
	--wx-calendar-grid-color: #b8bec8;
	--wx-calendar-weekend-background: #ffffff;
}

.wx-print-theme .wx-calendar,
.wx-print-theme .wx-calendar-content,
.wx-print-theme .wx-calendar-main,
.wx-print-theme .wx-calendar-sidebar,
.wx-print-theme .wx-scroll-grid,
.wx-print-theme .wx-scroll-inner,
.wx-print-theme .wx-sections,
.wx-print-theme .wx-section {
	background: #ffffff;
}

/* events - white body with a colored outline instead of a solid fill */
.wx-print-theme .wx-bar-event:not(.wx-bar-single-day),
.wx-print-theme .wx-box-event {
	background-color: #ffffff;
	color: var(--wx-color-font);
	border: 2px solid var(--wx-color-primary);
	box-shadow: none;
	break-inside: avoid;
}

.wx-print-theme .wx-bar-event:hover,
.wx-print-theme .wx-box-event:hover {
	box-shadow: none;
	opacity: 1;
}

.wx-print-theme .wx-bar-single-day:hover {
	background-color: transparent;
}

/* today marker - outline the day number instead of filling it */
.wx-print-theme .wx-month-day.wx-today .wx-day-num {
	background: #ffffff;
	color: var(--wx-color-primary);
	border: 1px solid currentColor;
}

.wx-print-theme .wx-event-placeholder {
	background: transparent;
	border: 1px dashed var(--wx-color-primary);
}

.wx-print-theme .wx-list-event:hover {
	background-color: transparent;
}

.wx-print-theme .wx-navigation button {
	display: none;
}
</style>
