<script setup>
defineOptions({ name: "CalendarDemoResponsive" });
import { ref } from "vue";
import { getData } from "../data.js";
import { Calendar, Editor, getToolbarItems } from "../../src/";
import { Layout, Cell } from "@svar-ui/vue-layout";
import { Segmented } from "@svar-ui/vue-core";

const buttons = getToolbarItems().filter((item) => item.id !== "today");
buttons.find((item) => item.id === "modes").comp = "segmented-navigation";

const { data, date } = getData();
const api = ref(null);
const options = [
	{ id: "mobile", label: "Mobile" },
	{ id: "desktop", label: "Desktop" },
];

const size = ref("mobile");
function setSize({ value }) {
	size.value = value;
}
</script>

<template>
	<div class="responsive">
		<Layout direction="column">
			<Cell :height="32" css="toolbar">
				<Segmented :options="options" :onchange="setSize" :value="size" />
			</Cell>
			<Cell :css="`wrapper size-${size}`">
				<Calendar
					:toolbar="{ items: buttons }"
					ref="api"
					:events="data"
					:date="date"
					:views="['day', 'month', 'agenda', 'year']"
				>
					<Editor v-if="api" :api="api" />
				</Calendar>
			</Cell>
		</Layout>
	</div>
</template>

<style scoped>
.responsive {
	height: 100%;
}
.responsive :deep(.toolbar) {
	margin: 10px 0 0 10px;
}
.responsive :deep(.wrapper) {
	border: var(--wx-border);
	border-width: 16px;
	border-radius: 16px;
	margin: 10px;
	box-sizing: border-box;
	flex: 0;
}
.responsive :deep(.size-mobile) {
	max-width: 480px;
}
</style>
