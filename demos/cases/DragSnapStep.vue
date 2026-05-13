<script setup>
import { ref, computed } from "vue";
import { getData } from "../data";
import { Calendar } from "../../src/";
import { Segmented } from "@svar-ui/vue-core";
import { Layout } from "@svar-ui/vue-layout";

const { data, date } = getData();

const snap = ref("15");
const options = [
	{ id: "15", label: "15 min" },
	{ id: "5", label: "5 min" },
	{ id: "off", label: "Off" },
];

const snapStep = computed(() =>
	snap.value === "off" ? false : Number(snap.value)
);

const views = computed(() => [
	{
		id: "week",
		sections: {
			timeGrid: {
				yScale: { snapStep: snapStep.value },
			},
		},
	},
	{
		id: "day",
		sections: {
			timeGrid: {
				yScale: { snapStep: snapStep.value },
			},
		},
	},
]);
</script>

<template>
	<Layout>
		<div class="controls">
			<span class="hint">Drag an event to see how snap step affects positioning</span>
			<Segmented
				:options="options"
				:value="snap"
				:onchange="v => (snap = v.value)"
			/>
		</div>
		<Calendar :events="data" view="week" :date="date" :views="views" />
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
	color: #666;
	font-size: 13px;
}
</style>
