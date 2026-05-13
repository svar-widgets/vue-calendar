<script setup>
import { ref } from "vue";
import { Calendar, Editor, parseICal, serializeICal } from "../../src/";
import { Button } from "@svar-ui/vue-core";
import { Layout, Cell } from "@svar-ui/vue-layout";
import { getData } from "../data.js";

const { data: initialData, date } = getData();
const data = ref(initialData);
const api = ref(null);
const fileInput = ref(null);

function importIcal(e) {
	const file = e.target.files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = ev => {
		data.value = parseICal(ev.target.result);
	};
	reader.readAsText(file);
}

function exportIcal() {
	const events = api.value.getEvents();
	const ics = serializeICal(events);
	const blob = new Blob([ics], { type: "text/calendar" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "calendar.ics";
	a.click();
	URL.revokeObjectURL(url);
}

function clearAll() {
	data.value = [];
}
</script>

<template>
	<Layout>
		<Cell :height="52" css="wx-toolbar-2">
			<input
				ref="fileInput"
				type="file"
				accept=".ics"
				@change="importIcal"
				style="display:none"
			/>
			<Button :onclick="exportIcal">Export .ics</Button>
			<Button :onclick="clearAll">Clear all</Button>
			<Button :onclick="() => fileInput.click()">Import .ics</Button>
		</Cell>
		<Calendar ref="api" :events="data" :date="date" />
	</Layout>
	<Editor v-if="api" :api="api" />
</template>

<style scoped>
:global(.wx-toolbar-2) {
	display: flex;
	gap: 8px;
	padding: 8px;
	border-bottom: 1px solid #ccc;
}
</style>
