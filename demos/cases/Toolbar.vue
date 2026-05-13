<script setup>
defineOptions({ name: "CalendarDemoToolbar" });
import { ref, computed } from "vue";
import { getData } from "../data.js";
import { Calendar, getToolbarItems } from "../../src/";
import { Layout } from "@svar-ui/vue-layout";
import { Segmented } from "@svar-ui/vue-core";

const { data, date } = getData();

const defaultConfig = { items: getToolbarItems() };

const invertedConfig = {
	items: [
		{ id: "modes", comp: "segmented" },
		{ comp: "spacer" },
		{ id: "title", comp: "dateLabel" },
		{ id: "nav", comp: "dateNav" },
	],
};

const sidesConfig = {
	items: [
		{ id: "nav", comp: "dateNav" },
		{ id: "title", comp: "dateLabel" },
		{ comp: "spacer" },
		{ id: "modes", comp: "segmented" },
	],
};

const minimalConfig = {
	items: [
		{ comp: "spacer" },
		{ id: "modes", comp: "segmented" },
	],
};

const noneConfig = { items: [] };

const mode = ref("default");
const modes = [
	{ id: "default", label: "Default", config: defaultConfig },
	{ id: "sides", label: "Sides", config: sidesConfig },
	{ id: "inverted", label: "Inverted", config: invertedConfig },
	{ id: "minimal", label: "Minimal", config: minimalConfig },
	{ id: "none", label: "None", config: noneConfig },
];

const toolbar = computed(() => modes.find(m => m.id === mode.value)?.config);
</script>

<template>
	<Layout direction="column">
		<Segmented
			:options="modes"
			:value="mode"
			:onchange="v => (mode = v.value)"
		/>
		<Calendar :events="data" :date="date" :toolbar="toolbar" />
	</Layout>
</template>
