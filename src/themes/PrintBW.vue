<script setup>
defineOptions({ name: "CalendarThemesPrintBW" });

import Willow from "./Willow.vue";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
	<Willow v-if="$slots.default" :fonts="props.fonts">
		<div class="wx-bw-theme">
			<slot />
		</div>
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style>
.wx-bw-theme {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	/* base palette - black with gray shades for print legibility */
	--wx-background: #ffffff;
	--wx-background-alt: #ffffff;
	--wx-background-hover: transparent;
	--wx-color-font: #000000;
	--wx-color-font-alt: #555555;
	--wx-color-font-disabled: #888888;
	--wx-color-primary: #000000;
	--wx-color-primary-font: #000000;
	--wx-color-primary-selected: transparent;
	--wx-color-secondary-hover: transparent;
	--wx-color-link: #000000;
	--wx-color-danger: #000000;
	--wx-icon-color: #000000;

	/* calendar surfaces */
	--wx-calendar-grid-color: #999999;
	--wx-calendar-weekend-background: #f2f2f2;
}

.wx-bw-theme .wx-calendar,
.wx-bw-theme .wx-calendar-content,
.wx-bw-theme .wx-calendar-main,
.wx-bw-theme .wx-calendar-sidebar,
.wx-bw-theme .wx-scroll-grid,
.wx-bw-theme .wx-scroll-inner,
.wx-bw-theme .wx-sections,
.wx-bw-theme .wx-section {
	background: #ffffff;
}

/* events - white body, gray outline; grayscale neutralizes any custom fill */
.wx-bw-theme .wx-bar-event:not(.wx-bar-single-day),
.wx-bw-theme .wx-box-event {
	background-color: #ffffff;
	color: #000000;
	border: 1px solid #999999;
	box-shadow: none;
	break-inside: avoid;
	filter: grayscale(1);
}

.wx-bw-theme .wx-bar-event:hover,
.wx-bw-theme .wx-box-event:hover {
	box-shadow: none;
	opacity: 1;
}

.wx-bw-theme .wx-bar-single-day,
.wx-bw-theme .wx-list-event,
.wx-bw-theme .wx-event-dot,
.wx-bw-theme .wx-bar-marker {
	filter: grayscale(1);
}

.wx-bw-theme .wx-bar-single-day:hover {
	background-color: transparent;
}

/* now-line reads as a dashed black rule without color */
.wx-bw-theme .wx-now-line::after {
	background: #000000;
}

.wx-bw-theme .wx-now-dot {
	background: #000000;
}

/* today marker - outline the day number instead of filling it */
.wx-bw-theme .wx-month-day.wx-today .wx-day-num {
	background: #ffffff;
	color: #000000;
	border: 1px solid #000000;
}

.wx-bw-theme .wx-event-placeholder {
	background: transparent;
	border: 1px dashed #000000;
}

.wx-bw-theme .wx-list-event:hover {
	background-color: transparent;
}

.wx-bw-theme .wx-navigation button {
	display: none;
}
</style>
