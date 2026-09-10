<script setup>
import { ref, inject } from "vue";
import { getData } from "../data.js";
import { Calendar, ContextMenu, Editor, getMenuOptions } from "../../src/";

const helpers = inject("wx-helpers");

const { data, date } = getData();
const api = ref(null);

const options = [
	...getMenuOptions(),
	{ id: "my-action", text: "My action", icon: "wxi-empty" },
];

function onclick({ action }) {
	if (action.id === "my-action") {
		helpers.showNotice({ text: "`My action` clicked", type: "success" });
	}
}
</script>

<template>
	<ContextMenu :api="api" :options="options" :onclick="onclick">
		<Calendar ref="api" :events="data" :date="date" />
	</ContextMenu>
	<Editor v-if="api" :api="api" />
</template>
