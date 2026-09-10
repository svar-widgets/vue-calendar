<script setup>
import { ref } from "vue";
import { Calendar, Editor } from "../../src/";
import { RestDataProvider } from "../../src/";

const server = "https://calendar-backend.svar.dev";
const provider = new RestDataProvider(server);

const api = ref(null);
const data = ref([]);
const date = ref(new Date());

provider.getData().then((events) => {
	data.value = events;
	date.value = new Date(events[0].start);
});

function init(api) {
	api.setNext(provider);
}
</script>

<template>
	<Calendar ref="api" :init="init" :events="data" :date="date" />
	<Editor v-if="api" :api="api" />
</template>
