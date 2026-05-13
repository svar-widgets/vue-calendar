<script setup>
import { ref, computed } from "vue";
import { Calendar, Editor } from "../../src/";
import { Segmented } from "@svar-ui/vue-core";
import { Layout } from "@svar-ui/vue-layout";

const api = ref(null);
const mode = ref("work");

const modes = [
	{ id: "full", label: "Full day" },
	{ id: "work", label: "Working hours" },
];

function at(hour, minute = 0) {
	const d = new Date();
	d.setHours(hour, minute, 0, 0);
	return d;
}

const events = [
	{ id: 1, text: "Standup", start: at(9, 0), end: at(10, 15) },
	{ id: 2, text: "Design review", start: at(11, 0), end: at(12, 30) },
	{ id: 3, text: "Sprint planning", start: at(14, 0), end: at(15, 30) },
];

const views = computed(() => [
	{
		id: "day",
		sections: {
			timeGrid: {
				yScale: {
					startHour: mode.value === "work" ? 8 : 0,
					endHour: mode.value === "work" ? 18 : 24,
					step: mode.value === "work" ? 60 : 120,
					ui: { minUnitHeight: 40 },
				},
				ui: { nowLine: true },
			},
		},
	},
]);
</script>

<template>
	<Layout preset="space">
		<Segmented
			:options="modes"
			:value="mode"
			:onchange="v => (mode = v.value)"
/>
		<Calendar
			ref="api"
			:events="events"
			view="day"
			:date="new Date()"
			:views="views"
/>
	</Layout>

	<Editor v-if="api" :api="api" />
</template>
