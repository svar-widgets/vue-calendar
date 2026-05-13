<script setup>
import { ref } from "vue";
import {
	Calendar,
	CalendarPanel,
	Editor,
	getEditorItems,
	registerEditorItem,
} from "../../src/";
import { RichSelect } from "@svar-ui/vue-core";
import { relDate } from "../data.js";

registerEditorItem("richselect", RichSelect);

const date = relDate(0);

const calendars = [
	{ id: "work", label: "Work", css: "cal-work" },
	{ id: "home", label: "Home", css: "cal-home" },
	{ id: "holiday", label: "Holidays", css: "cal-holiday", active: false },
];

const data = [
	{
		id: 1,
		text: "Team Standup",
		start: relDate(0, 9, 0),
		end: relDate(0, 9, 30),
		calendarId: "work",
	},
	{
		id: 2,
		text: "Sprint Review",
		start: relDate(0, 14, 0),
		end: relDate(0, 15, 0),
		calendarId: "work",
	},
	{
		id: 3,
		text: "Gym",
		start: relDate(0, 8, 0),
		end: relDate(0, 8, 30),
		calendarId: "home",
	},
	{
		id: 4,
		text: "Dentist",
		start: relDate(1, 10, 0),
		end: relDate(1, 11, 0),
		calendarId: "home",
	},
	{
		id: 5,
		text: "Music Festival",
		start: relDate(5),
		end: relDate(6),
		calendarId: "holiday",
	},
	{
		id: 6,
		text: "Design Sync",
		start: relDate(2, 11, 0),
		end: relDate(2, 12, 0),
		calendarId: "work",
	},
	{
		id: 7,
		text: "Gym",
		start: relDate(3, 8, 0),
		end: relDate(3, 8, 30),
		calendarId: "home",
	},
	{
		id: 8,
		text: "Grocery Run",
		start: relDate(4, 17, 0),
		end: relDate(4, 18, 0),
		calendarId: "home",
	},
];

const toolbar = {
	items: [
		{ id: "menu", comp: "menuButton" },
		{ comp: "spacer" },
		{ id: "title", comp: "dateLabel" },
		{ comp: "spacer" },
		{ id: "nav", comp: "dateNav" },
	],
};

const panelVisible = ref(true);
const handleAction = (ev) => {
	if (ev.id === "menu-button") {
		panelVisible.value = !panelVisible.value;
	}
};

function cssByCalendar(ctx) {
	return `cal-${ctx.event.calendarId}`;
}

let activeCalendarIds = ref(
	calendars.filter((c) => c.active !== false).map((c) => c.id)
);
const handleCalendarChange = (ev) => {
	activeCalendarIds.value = ev.value;
};

const handleInit = (api) => {
	api.intercept("add-event", (action) => {
		if (!action.event.calendarId) {
			action.event.calendarId =
				activeCalendarIds.value[0] ?? calendars[0].id;
		}
	});
};

const api = ref(null);

const editorItems = [
	...getEditorItems(),
	{
		comp: "richselect",
		key: "calendarId",
		label: "Calendar",
		options: calendars.map((c) => ({ id: c.id, label: c.label })),
	},
];
</script>

<template>
	<div class="layout">
		<Calendar
			ref="api"
			:events="data"
			view="week"
			:date="date"
			:toolbar="toolbar"
			@action="handleAction"
			:event-css="cssByCalendar"
			:init="handleInit"
		>
			<CalendarPanel
				:open="panelVisible"
				:calendars="calendars"
				:onchange="handleCalendarChange"
			/>
		</Calendar>
		<Editor v-if="api" :api="api" :items="editorItems" />
	</div>
</template>

<style scoped>
.layout {
	height: 100%;
}

:global(.cal-work.wx-calendar-name),
:global(.cal-work.wx-calendar-name label) {
	background-color: #9797f8;
	color: white;
}
:global(.cal-work.wx-box-event),
:global(.cal-work.wx-bar-event) {
	background-color: #9797f8;
}

:global(.cal-home.wx-calendar-name),
:global(.cal-home.wx-calendar-name label) {
	background-color: #a0e4c3;
	color: #444;
}
:global(.cal-home.wx-box-event),
:global(.cal-home.wx-bar-event) {
	background-color: #a0e4c3;
	color: #444;
}

:global(.cal-holiday.wx-calendar-name),
:global(.cal-holiday.wx-calendar-name label) {
	background-color: #f1e1b4;
	color: #444;
}
:global(.cal-holiday.wx-box-event),
:global(.cal-holiday.wx-bar-event) {
	background-color: #f1e1b4;
	color: #444;
}
</style>
