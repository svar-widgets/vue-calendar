<script setup>
import { provide } from "vue";
import { relDate } from "../data";
import { Calendar } from "../../src/";
import { ResourcesViewModel, registerCalendarView } from "@svar-ui/calendar-store";
import EventCard from "../custom/EventCard.vue";

const resources = [
	{ id: "alice", label: "Alice" },
	{ id: "bob", label: "Bob" },
	{ id: "carol", label: "Carol" },
	{ id: "david", label: "David" },
	{ id: "eve", label: "Eve" },
	{ id: "frank", label: "Frank" },
	{ id: "grace", label: "Grace" },
	{ id: "heidi", label: "Heidi" },
	{ id: "ivan", label: "Ivan" },
	{ id: "judy", label: "Judy" },
	{ id: "kevin", label: "Kevin" },
	{ id: "lisa", label: "Lisa" },
	{ id: "mike", label: "Mike" },
	{ id: "nancy", label: "Nancy" },
	{ id: "oscar", label: "Oscar" },
	{ id: "patty", label: "Patty" },
];

class CustomResourcesViewModel extends ResourcesViewModel {
	getSections() {
		return [
			{
				name: "timeGrid",
				mode: "boxes",
				xScale: {
					type: "unit",
					items: resources,
					accessor: "unit_id",
					metadata: { minUnitWidth: 160 },
				},
				yScale: {
					type: "time",
					startHour: 8,
					endHour: 18,
					step: 60,
					metadata: { minUnitHeight: 100 },
					format: "timeScaleFormat",
				},
				size: 1,
			},
		];
	}
}

registerCalendarView("resources", CustomResourcesViewModel);

provide("resources", resources);

const resourceEvents = [];
let base = relDate(0, 9, 0);
for (const resource of resources) {
	const start = new Date(base.getTime());
	const end = new Date(base.getTime() + 60 * 60 * 1000);
	base = new Date(base.getTime() + 1000 * 60 * 30);
	resourceEvents.push({
		id: 200 + resource.id,
		text: "Design review",
		start,
		end,
		unit_id: resource.id,
	});
}
</script>

<template>
	<Calendar
		:events="[...resourceEvents]"
		:date="base"
		view="resources"
		:event-card="EventCard"
		:views="[
			'day',
			'week',
			'month',
			'agenda',
			{ id: 'resources', label: 'Resources' },
		]"
	/>
</template>
