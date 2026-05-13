<script setup>
defineOptions({ name: "CalendarDemoFilter" });
import { ref, inject } from "vue";
import { getData } from "../data";
import { Calendar } from "../../src/";
import { Segmented } from "@svar-ui/vue-core";
import { Layout, Cell } from "@svar-ui/vue-layout";
import {
	Willow,
	WillowDark,
	FilterQuery,
	FilterBar,
	FilterBuilder,
	createFilter,
	getQueryString,
} from "@svar-ui/vue-filter";

const { data, date } = getData();
const helpers = inject("wx-helpers");

let api;
const mode = ref("plain");
const textValue = ref("");

function onInit(obj) {
	api = obj;
}

const fields = [
	{
		id: "text",
		label: "Text",
		type: "text",
	},
	{
		id: "start",
		label: "Start Date",
		type: "date",
	},
	{
		id: "end",
		label: "End Date",
		type: "date",
	},
];

const url =
	"https://filter-backend.svar.dev/text-to-json";
async function text2filter(text, fields) {
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ text, fields }),
	});
	const json = await response.json();
	if (!response.ok) {
		helpers.showNotice({
			text: json.error || "Request failed",
			type: "danger",
		});
		return null;
	}
	return json;
}

async function applyQueryFilter({
	value,
	error,
	text,
	startProgress,
	endProgress,
}) {
	if (text) {
		error = null;
		try {
			startProgress();
			value = await text2filter(text, fields);
			textValue.value = value ? getQueryString(value).query : "";
		} catch (e) {
			error = e;
		} finally {
			endProgress();
		}
	}

	if (error) {
		helpers.showNotice({
			text: error.message,
			type: "danger",
		});

		if (error.code !== "NO_DATA") return;
	}

	api.exec("filter-events", { filter: createFilter(value, {}, fields) });
}

function applyFilter({ value }) {
	api.exec("filter-events", { filter: createFilter(value) });
}
</script>

<template>
	<Willow />
	<WillowDark />

	<Layout preset="space">
		<Segmented
			v-model:value="mode"
			:options="[
				{ id: 'plain', label: 'Plain' },
				{ id: 'query', label: 'Query' },
				{ id: 'builder', label: 'Builder' },
			]"
		/>
		<FilterBar
			v-if="mode === 'plain'"
			:debounce="0"
			:fields="[fields[0]]"
			:onchange="applyFilter"
		/>
		<FilterQuery
			v-else-if="mode === 'query'"
			:value="textValue"
			:fields="fields"
			:onchange="applyQueryFilter"
			placeholder="type your query as plain text"
		/>
		<FilterBuilder
			v-else-if="mode === 'builder'"
			:fields="fields"
			type="line"
			:onchange="applyFilter"
		/>

		<Cell>
			<Calendar :events="data" :date="date" :init="onInit" />
		</Cell>
	</Layout>
</template>

<style scoped>
:global(.wx-filter-bar) {
	width: 100% !important;
}
</style>
