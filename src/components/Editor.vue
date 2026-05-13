<script>
import { Editor as EditorBase, registerEditorItem } from "@svar-ui/vue-editor";
import DateTimePicker from "./DateTimePicker.vue";

registerEditorItem("date-time-picker", DateTimePicker);
</script>

<script setup>
import { ref, computed, inject, provide } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/calendar-locales";
import { en as coreEn } from "@svar-ui/core-locales";
import { getEditorItems } from "./editorItems.js";

defineOptions({ name: "CalendarWidgetEditor" });

const props = defineProps({
	api: {},
	items: { default: () => getEditorItems() },
	placement: { default: "sidebar" },
	layout: { default: "default" },
	focus: { type: Boolean, default: true },
	css: { default: "" },
	topBar: { default: undefined },
	autoSave: { type: Boolean, default: true },
	onchange: { type: Function },
	onsave: { type: Function },
	onaction: { type: Function },
});

const editorData = subscribeLater(
	() => props.api?.getReactiveState()?.editorData
);

let l = inject("wx-i18n", undefined);
if (!l) {
	l = locale({ ...en, ...coreEn });
	provide("wx-i18n", l);
}
const _ = l.getGroup("eventCalendar");

function translate(value) {
	return typeof value === "string" ? _(value) : value;
}

function applyLocale(list) {
	return list.map(item => {
		const next = { ...item };
		next.label = translate(next.label);
		return next;
	});
}

const generation = ref(1);
const allDay = computed(() =>
	generation.value > 0 ? editorData().value?.allDay : false
);
const cItems = computed(() => applyLocale(props.items));

const defaultTopBar = {
	items: [
		{ comp: "icon", icon: "wxi-close", id: "close" },
		{ comp: "spacer" },
		{
			comp: "button",
			id: "delete",
			text: _("Delete"),
			type: "primary danger",
			onclick: handleDelete,
		},
	],
};
const editorTopBar = computed(() =>
	props.topBar === undefined ? defaultTopBar : props.topBar
);
const editorCss = computed(() =>
	["wx-editor-calendar", allDay.value ? "wx-editor-all-day" : "", props.css]
		.filter(Boolean)
		.join(" ")
);

function handleSave(ev) {
	props.onsave?.(ev);
	const data = editorData().value;
	if (!data) return;
	props.api.exec("update-event", { id: data.id, event: { ...ev.values } });
}

function sameDay(a, b) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function handleChange(ev) {
	const { key, value, update } = ev;
	const prev = editorData().value;
	generation.value++;

	if (prev && key === "start" && !update.allDay) {
		const oldStart = prev.start;
		const oldEnd = prev.end;
		if (
			oldStart instanceof Date &&
			oldEnd instanceof Date &&
			sameDay(oldStart, oldEnd) &&
			value instanceof Date
		) {
			const newEnd = new Date(oldEnd);
			newEnd.setFullYear(
				value.getFullYear(),
				value.getMonth(),
				value.getDate()
			);
			update.end = newEnd;
		}
	}
	props.onchange?.(ev);
}

function handleDelete() {
	const data = editorData().value;
	if (!data) return;
	props.api.exec("delete-event", { id: data.id });
	props.api.exec("select-event", { id: null });
}

function handleAction(ev) {
	props.onaction?.(ev);
	const { item } = ev;
	if (item.id === "close" && !!item.comp) {
		props.api.exec("select-event", { id: null });
	}
}
</script>

<template>
	<EditorBase
		v-if="editorData().value"
		:focus="focus"
		:items="cItems"
		:top-bar="editorTopBar"
		:auto-save="autoSave"
		:onchange="handleChange"
		:onaction="handleAction"
		:onsave="handleSave"
		:placement="placement"
		:layout="layout"
		:values="editorData().value"
		:css="editorCss"
	/>
</template>

<style scoped>
:global(.wx-sidearea .wx-editor-calendar) {
	width: 450px;
}
:global(.wx-editor-calendar.wx-editor-all-day .wx-timepicker) {
	visibility: hidden;
}
</style>
