<script setup>
import { ref, computed } from "vue";
import { getData } from "../data";
import { Calendar, Editor, WeekViewModel, registerCalendarView, getToolbarItems } from "../../src/";
import { Checkbox, Locale } from "@svar-ui/vue-core";
import { Layout } from "@svar-ui/vue-layout";

class WorkWeekViewModel extends WeekViewModel {
	getSections() {
		const sections = super.getSections();
		return sections.map(s => ({
			...s,
			xScale: { ...s.xScale, length: 5 },
		}));
	}

	rangeStart(date) {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		// work week is Mon-Fri regardless of locale's weekStart
		const diff = (((d.getDay() - 1) % 7) + 7) % 7;
		d.setDate(d.getDate() - diff);
		return d;
	}
}

class TwoWeeksViewModel extends WeekViewModel {
	getSections() {
		const sections = super.getSections();
		const days = sections[1];
		return [
			{
				...days,
				xScale: { ...days.xScale, length: 14 },
				boxLayout: "overlap",
			},
		];
	}

	getRangeLabel() {
		const opts = {
			month: "short",
			day: "numeric",
		};
		const start = this["startDate"];
		const end = new Date(this["endDate"].getTime() - 1);
		if (start.getMonth() === end.getMonth()) {
			return `${start.toLocaleDateString(undefined, { month: "long" })} ${start.getDate()}\u2013${end.getDate()}, ${start.getFullYear()}`;
		}
		return `${start.toLocaleDateString(undefined, opts)} \u2013 ${end.toLocaleDateString(undefined, opts)}, ${end.getFullYear()}`;
	}

	addRange(date, n) {
		const d = new Date(date);
		d.setDate(d.getDate() + n * 14);
		return d;
	}
}

registerCalendarView("workweek", WorkWeekViewModel);
registerCalendarView("2weeks", TwoWeeksViewModel);

const { data, date } = getData();
const api = ref(null);
const sundayStart = ref(false);

const weekStart = computed(() => (sundayStart.value ? 0 : 1));
const words = computed(() => ({ calendar: { weekStart: weekStart.value } }));

const toolbar = {
	items: getToolbarItems()
		.filter(item => item.id !== "add-event")
		.map(item =>
			item.id === "modes" ? { ...item, comp: "segmented" } : item
		),
};

const views = [
	{ id: "week", label: "Week" },
	{ id: "workweek", label: "Work Week" },
	{ id: "2weeks", label: "2 Weeks" },
];
</script>

<template>
	<Layout preset="space">
		<Checkbox label="Start week on Sunday" v-model:value="sundayStart" />

		<div :key="weekStart">
			<Locale :words="words">
				<Calendar
					ref="api"
					:events="data"
					view="week"
					:date="date"
					:views="views"
					:toolbar="toolbar"
/>
			</Locale>
		</div>
	</Layout>

	<Editor v-if="api" :api="api" />
</template>
