<script setup>
import { ref } from "vue";
import { getData } from "../data.js";
import { Calendar, Editor } from "../../src/";

const { data, date } = getData();
const api = ref(null);
</script>

<template>
	<Calendar ref="api" :events="data" :date="date" />
	<Editor v-if="api" :api="api" />
</template>
