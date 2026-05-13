<script setup>
import { ref, computed } from "vue";
import { Calendar, Editor } from "../../src/";
import { isMultiDay } from "@svar-ui/calendar-store";
import { Layout, Cell } from "@svar-ui/vue-layout";
import { relDate } from "../data.js";

const date = relDate(0);
const api = ref(null);

const data = [
	{
		id: 1,
		text: "Company Holiday",
		start: relDate(0, 0, 0),
		end: relDate(0, 23, 59),
		allDay: true,
	},
	{
		id: 2,
		text: "Office days",
		start: relDate(1, 9, 0),
		end: relDate(3, 17, 0),
		allDay: true,
	},
	{
		id: 3,
		text: "Standup",
		start: relDate(2, 9, 0),
		end: relDate(2, 9, 30),
	},
	{
		id: 4,
		text: "Design Review",
		start: relDate(2, 14, 0),
		end: relDate(2, 15, 30),
	},
	{
		id: 5,
		text: "Conference setup",
		start: relDate(0, 8, 0),
		end: relDate(2, 18, 0),
	},
	{
		id: 6,
		text: "Hackathon",
		start: relDate(3, 10, 0),
		end: relDate(4, 16, 0),
	},
	{
		id: 7,
		text: "Overnight deploy",
		start: relDate(2, 17, 0),
		end: relDate(3, 9, 0),
	},
];

const filterMode = ref("default");

function multidayFilter(mode) {
	if (mode === "allday-only") {
		return (ev) => ev.allDay === true;
	}
	if (mode === "duration") {
		const DAY_MS = 24 * 60 * 60 * 1000;
		return (ev) =>
			ev.allDay === true ||
			ev.end.getTime() - ev.start.getTime() >= DAY_MS;
	}
	return (ev) => isMultiDay(ev);
}

const views = computed(() => [
	{
		id: "week",
		sections: {
			multiday: {
				filter: multidayFilter(filterMode.value),
			},
			timeGrid: {
				filter: (ev) => !multidayFilter(filterMode.value)(ev),
			},
		},
	},
]);
</script>

<template>
	<Layout>
		<div class="controls">
			<label>
				Multiday filter:
				<select v-model="filterMode">
					<option value="default">
						Default (allDay + cross-day)
					</option>
					<option value="allday-only">Only allDay flag</option>
					<option value="duration">
						allDay + duration &ge; 24h
					</option>
				</select>
			</label>
			<span class="hint">Events are split between the multi-day bar at the top and the
				time grid below.<br />
				Switch the filter to control which events go to the bar
				area.</span>
		</div>
		<Cell :flex="1">
			<Calendar
				:events="data"
				view="week"
				:date="date"
				:toolbar="null"
				:views="views"
				ref="api"
			/>
			<Editor v-if="api" :api="api" />
		</Cell>
	</Layout>
</template>

<style scoped>
.controls {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 8px;
	border-bottom: 1px solid #ccc;
}
.hint {
	font-size: 13px;
}
select {
	padding: 4px 8px;
}
</style>
