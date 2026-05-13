<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, watchEffect } from "vue";
import { inject } from "vue";
import { Calendar, Editor, registerEditorItem } from "../../src/";
import { Comments } from "@svar-ui/vue-comments";
import { Tasklist } from "@svar-ui/vue-tasklist";
import { subscribeLater } from "@svar-ui/lib-vue";
import { relDate } from "../data.js";
import DateTimeField from "../custom/DateTimeField.vue";

const { showModal } = inject("wx-helpers");

registerEditorItem("date-time", DateTimeField);
registerEditorItem("comments", Comments);
registerEditorItem("tasks", Tasklist);

const date = relDate(0);

const users = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Carol" },
];

const data = [
	{
		id: 1,
		text: "Team planning",
		start: relDate(0, 9, 0),
		end: relDate(0, 11, 0),
		comments: [
			{
				id: 1,
				user: 2,
				content: "Agenda is ready, let's align on priorities.",
				date: relDate(-1, 10, 0),
			},
			{
				id: 2,
				user: 3,
				content: "I'll join remotely, please share the link.",
				date: relDate(-1, 11, 30),
			},
		],
		tasks: [
			{ id: 1, content: "Book conference room", status: 1 },
			{ id: 2, content: "Send calendar invites", status: 1 },
			{ id: 3, content: "Prepare slides", status: 0 },
			{ id: 4, content: "Review Q2 goals", status: 0 },
		],
	},
	{
		id: 2,
		text: "Code review",
		start: relDate(0, 14, 0),
		end: relDate(0, 15, 0),
		comments: [],
		tasks: [
			{ id: 1, content: "Check PR #142", status: 0 },
			{ id: 2, content: "Update changelog", status: 0 },
		],
	},
	{
		id: 3,
		text: "Retrospective",
		start: relDate(1, 16, 0),
		end: relDate(1, 17, 0),
		comments: [],
		tasks: [],
	},
];

const currentStart = ref(null);

const items = [
	{
		comp: "text",
		key: "text",
		label: "Text",
		column: "left",
		required: true,
	},
	{
		comp: "date-time",
		key: "start",
		label: "Start date",
		required: true,
	},
	{
		comp: "date-time",
		key: "end",
		label: "End date",
		required: true,
		validation: (v) =>
			v instanceof Date &&
			currentStart.value instanceof Date &&
			v > currentStart.value,
		validationMessage: "End date must be after start date",
	},
	{
		key: "comments",
		comp: "comments",
		label: "Comments",
		users,
		activeUser: 1,
		column: "left",
	},
	{
		key: "tasks",
		comp: "tasks",
		label: "Checklist",
	},
];

const api = ref(null);
const editorDataStore = subscribeLater(
	() => api.value?.getReactiveState()?.editorData
);
const selected = computed(() => editorDataStore()?.value ?? null);

watchEffect(() => {
	if (selected.value) currentStart.value = selected.value.start ?? null;
});

const bottomBar = {
	items: [
		{
			comp: "button",
			id: "delete",
			text: "Delete",
			type: "danger",
			onclick: handleDelete,
		},
		{ comp: "spacer" },
		{
			comp: "button",
			id: "close",
			text: "Cancel",
			type: "default",
		},
		{
			comp: "button",
			id: "save",
			text: "Done",
			type: "primary",
		},
	],
};

function handleChange({ key, value }) {
	// Wrapper handles the same-day end-date shift; we only mirror
	// `start` into local state so the `end` validation closure can
	// compare against the latest value.
	if (key === "start") currentStart.value = value;
}

function closeEditor() {
	api.value?.exec("select-event", { id: null });
}

async function handleDelete() {
	if (!api.value || !selected.value) return;
	try {
		await showModal({
			title: "Delete event?",
			message: "This action cannot be undone.",
		});
	} catch {
		return;
	}
	api.value.exec("delete-event", { id: selected.value.id });
	closeEditor();
}

function handleAction({ item, changes }) {
	// Cancel button (`id: "close"`) is closed by the calendar Editor
	// wrapper itself. Save in autoSave-off mode finalises after the
	// editor empties its changes set; treat that as success and close.
	if (item.id === "save" && changes.length === 0) closeEditor();
}

watchEffect(() => {
	if (api.value) api.value.exec("select-event", { id: 1 });
});
</script>

<template>
	<Calendar ref="api" :events="data" :date="date" />
	<Editor
		v-if="api"
		:api="api"
		:items="items"
		:bottom-bar="bottomBar"
		:top-bar="false"
		:auto-save="false"
		placement="modal"
		layout="columns"
		:onchange="handleChange"
		:onaction="handleAction"
		css="editor-custom"
	/>
</template>

<style>
/* adjust paddings, prevent inner components from stretching the Editor window */
:global(div.wx-panel.wx-editor-calendar.editor-custom) {
	padding: 20px 20px 16px 20px;
}
:global(.wx-editor-calendar.editor-custom .wx-sections > div:last-child .wx-field) {
	margin-bottom: 4px;
}
:global(.wx-editor-calendar.editor-custom .wx-content .wx-right) {
	margin-left: 0px;
	min-height: auto;
}
:global(.wx-editor-calendar.editor-custom .wx-comments-list) {
	min-height: 250px;
	max-height: 370px;
}
:global(.wx-editor-calendar.editor-custom .wx-tasks-list) {
	max-height: 300px;
}
:global(.wx-editor-calendar.editor-custom div.wx-editor-toolbar),
:global(.wx-editor-calendar.editor-custom div.wx-editor-toolbar .wx-toolbar) {
	padding: 0;
}
</style>
