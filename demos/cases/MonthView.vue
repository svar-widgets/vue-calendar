<script setup>
import { ref, computed } from "vue";
import { getData } from "../data";
import { Calendar, Editor } from "../../src/";
import { Checkbox, Locale } from "@svar-ui/vue-core";
import { Layout } from "@svar-ui/vue-layout";

const { data, date } = getData();
const wNumbers = ref(false);
const sundayStart = ref(false);
const api = ref(null);

const weekStart = computed(() => (sundayStart.value ? 0 : 1));
const words = computed(() => ({ calendar: { weekStart: weekStart.value } }));

const views = computed(() => [
	{
		id: "month",
		sections: {
			month: {
				yScale: {
					visible: wNumbers.value,
					format: wNumbers.value ? "weekNumberFormat" : undefined,
				},
			},
		},
	},
]);
</script>

<template>
	<Layout preset="space">
		<Checkbox :label="'Week numbers'" v-model:value="wNumbers"></Checkbox>
		<Checkbox
			:label="'Start week on Sunday'"
			v-model:value="sundayStart"
		></Checkbox>

		<Locale :words="words" :key="weekStart">
			<Calendar
				ref="api"
				:events="data"
				view="month"
				:date="date"
				:views="views"
			/>
		</Locale>
	</Layout>

	<Editor v-if="api" :api="api" />
</template>
