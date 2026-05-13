<script setup>
defineOptions({ name: "CalendarDemoLocales" });
import { ref, computed } from "vue";
import { getData } from "../data.js";
import { Calendar, Editor } from "../../src/";
import { Layout } from "@svar-ui/vue-layout";
import { Segmented, Locale } from "@svar-ui/vue-core";

import {
	en as enCore,
	cn as cnCore,
	de as deCore,
	es as esCore,
	fr as frCore,
	it as itCore,
	ja as jaCore,
	pt as ptCore,
	ru as ruCore,
} from "@svar-ui/core-locales";
import {
	en,
	cn,
	de,
	es,
	fr,
	it,
	jp,
	pt,
	ru,
} from "@svar-ui/calendar-locales";

const api = ref(undefined);
const { data, date } = getData();

const dictionaries = {
	en: { calendar: en, core: enCore },
	cn: { calendar: cn, core: cnCore },
	de: { calendar: de, core: deCore },
	es: { calendar: es, core: esCore },
	fr: { calendar: fr, core: frCore },
	it: { calendar: it, core: itCore },
	jp: { calendar: jp, core: jaCore },
	pt: { calendar: pt, core: ptCore },
	ru: { calendar: ru, core: ruCore },
};

const locale = ref("en");
const words = computed(() => ({
	...dictionaries[locale.value].calendar,
	...dictionaries[locale.value].core,
}));

const options = [
	{ id: "en", label: "English" },
	{ id: "cn", label: "Chinese" },
	{ id: "de", label: "German" },
	{ id: "es", label: "Spanish" },
	{ id: "fr", label: "French" },
	{ id: "it", label: "Italian" },
	{ id: "jp", label: "Japanese" },
	{ id: "pt", label: "Portuguese" },
	{ id: "ru", label: "Russian" },
];
</script>

<template>
	<Layout direction="column">
		<Segmented
			:options="options"
			:value="locale"
			:onchange="v => (locale = v.value)"
		/>
		<Locale :words="words" :key="locale">
			<Calendar :init="(v) => (api = v)" :events="data" view="week" :date="date" />
			<Editor v-if="api" :api="api" />
		</Locale>
	</Layout>
</template>
