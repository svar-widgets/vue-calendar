<script>
import { Editor as EditorBase, registerEditorItem } from "@svar-ui/vue-editor";
import DateTimePicker from "./DateTimePicker.vue";
import EventDatesForm from "./EventDatesForm.vue";

registerEditorItem("date-time-picker", DateTimePicker);
registerEditorItem("event-dates", EventDatesForm);
</script>

<script setup>
import { computed, inject, provide } from "vue";
import { subscribeLater } from "@svar-ui/lib-vue";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/calendar-locales";
import { en as coreEn } from "@svar-ui/core-locales";
import { getEditorItems } from "../defaults.js";

defineOptions({ name: "CalendarWidgetEditor" });

const props = defineProps({
	api: {},
	items: { default: undefined },
	placement: { default: undefined },
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
	() => props.api?.getReactiveState()?.editorData,
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
	return list.map((item) => {
		const next = { ...item };
		next.label = translate(next.label);
		return next;
	});
}

const calendarCtx = inject("calendar-api", undefined);
const finalPlacement = computed(
	() =>
		props.placement ?? (calendarCtx?.isCompact() ? "fullscreen" : "sidebar"),
);

const useRecurringForm = computed(
	() =>
		!!editorData().value?.recurring &&
		(editorData().value?.recurringMode ?? "series") !== "single",
);
const cItems = computed(() =>
	applyLocale(props.items ?? getEditorItems(useRecurringForm.value)),
);

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
	props.topBar === undefined ? defaultTopBar : props.topBar,
);
const editorCss = computed(() =>
	["wx-editor-calendar", props.css].filter(Boolean).join(" "),
);

function handleSave(ev) {
	props.onsave?.(ev);
	const data = editorData().value;
	if (!data) return;
	const mode = data.recurringMode ?? "series";
	// a series save must not carry the clicked occurrence's context in
	// rawId, or the store would treat it as a single-occurrence edit
	props.api.exec("update-event", {
		id: data.id,
		rawId: mode === "series" ? data.id : data.rawId,
		event: { ...ev.values },
		...(data.recurringOriginalDate && mode !== "series" ? { mode } : {}),
	});
}

function handleChange(ev) {
	props.onchange?.(ev);
}

function handleDelete() {
	const data = editorData().value;
	if (!data) return;
	props.api.exec("delete-event", { id: data.id, rawId: data.rawId });
	props.api.exec("select-event", { id: null, rawId: null });
}

function handleAction(ev) {
	props.onaction?.(ev);
	const { item } = ev;
	if (item.id === "close" && !!item.comp) {
		props.api.exec("select-event", { id: null, rawId: null });
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
		:placement="finalPlacement"
		:layout="layout"
		:values="editorData().value.values"
		:css="editorCss"
	/>
</template>

<style scoped>
:global(.wx-sidearea .wx-editor-calendar) {
	width: 450px;
}
</style>
