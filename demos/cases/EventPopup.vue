<script setup>
import { getData } from "../data";
import { Calendar } from "../../src/";
import EventPopup from "../custom/EventPopup.vue";

const { data } = getData();
</script>

<template>
	<Calendar
		:events="data"
		view="week"
		:event-popup="EventPopup"
		:views="['day', 'week', 'month']"
	/>
</template>
