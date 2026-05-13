<script setup>
defineOptions({ name: "CalendarDemoTooltip" });
import { getData } from "../data";
import { Calendar } from "../../src/";
import EventTooltip from "../custom/EventTooltip.vue";

const { data, date } = getData();
</script>

<template>
	<Calendar :events="data" view="month" :date="date" :tooltip="EventTooltip" />
</template>
