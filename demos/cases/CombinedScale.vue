<script setup>
import {
	Calendar,
	WeekViewModel,
	getToolbarItems,
	registerCalendarView,
} from "../../src/";
import { Cell, Layout } from "@svar-ui/vue-layout";
import { relDate } from "../data.js";

const units = [
	{ id: "design", label: "Design" },
	{ id: "engineering", label: "Engineering" },
	{ id: "marketing", label: "Marketing" },
];

class CombinedViewModel extends WeekViewModel {
	render = "scrollable";
	dateFirst = true;

	getSections() {
		const timeGrid = super.getSections()[1];
		const dateScale = {
			type: "date",
			length: 3,
			format: "weekScaleFormat",
		};
		const unitScale = {
			type: "unit",
			items: units,
			accessor: "units",
			multiple: true,
			ui: { minUnitWidth: 130 },
		};

		return [
			{
				...timeGrid,
				filter: () => true,
				xScale: {
					type: "combined",
					outer: this.dateFirst ? dateScale : unitScale,
					inner: this.dateFirst ? unitScale : dateScale,
				},
			},
		];
	}

	rangeStart(date) {
		const result = new Date(date);
		result.setHours(0, 0, 0, 0);
		return result;
	}

	addRange(date, n) {
		const result = new Date(date);
		result.setDate(result.getDate() + n * 3);
		return result;
	}
}

class DateUnitsViewModel extends CombinedViewModel {}

class UnitsDateViewModel extends CombinedViewModel {
	dateFirst = false;
}

registerCalendarView("date-units", DateUnitsViewModel);
registerCalendarView("units-date", UnitsDateViewModel);

const date = relDate(0);
const events = [
	{
		id: 1,
		text: "Product kickoff",
		start: relDate(0, 9),
		end: relDate(0, 10, 30),
		units: ["design", "engineering"],
	},
	{
		id: 2,
		text: "Campaign review",
		start: relDate(0, 11),
		end: relDate(0, 12),
		units: ["marketing"],
	},
	{
		id: 3,
		text: "Prototype workshop",
		start: relDate(1, 10),
		end: relDate(1, 12, 30),
		units: ["design", "engineering"],
	},
	{
		id: 4,
		text: "Launch handoff",
		start: relDate(1, 14),
		end: relDate(1, 15, 30),
		units: ["engineering", "marketing"],
	},
	{
		id: 5,
		text: "Overnight release",
		start: relDate(1, 17),
		end: relDate(2, 10),
		units: ["engineering", "marketing"],
	},
	{
		id: 6,
		text: "Retrospective",
		start: relDate(2, 13),
		end: relDate(2, 14, 30),
		units: ["design", "engineering", "marketing"],
	},
];

const views = [
	{ id: "date-units", label: "Date → Unit" },
	{ id: "units-date", label: "Unit → Date" },
];

const toolbar = {
	items: getToolbarItems()
		.filter((item) => item.id !== "add-event")
		.map((item) =>
			item.id === "modes" ? { ...item, comp: "segmented" } : item,
		),
};
</script>

<template>
	<Layout>
		<div class="description">
			Switch the grouping order to compare Date → Unit with Unit → Date. Events
			assigned to several units are rendered in every matching leaf.
		</div>
		<Cell>
			<Calendar
				:events="events"
				:date="date"
				:views="views"
				:toolbar="toolbar"
				view="date-units"
			/>
		</Cell>
	</Layout>
</template>

<style scoped>
.description {
	padding: 8px 12px;
	color: var(--wx-color-font-alt);
	border-bottom: var(--wx-border);
}
</style>
