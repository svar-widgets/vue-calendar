<script setup>
defineOptions({ name: "CalendarRenderGrid" });

import GridLines from "./GridLines.vue";
import GridCells from "./GridCells.vue";

const props = defineProps({
	xHeaders: { default: null },
	yHeaders: { default: null },
	dx: {},
	dy: {},
	cellCss: { default: undefined },
	view: {},
	section: {},
	mode: {},
});

function hasWeekend(headers) {
	if (!headers) return false;
	const last = headers[headers.length - 1];
	for (const u of last) if (u.weekend) return true;
	return false;
}
</script>

<template>
	<GridCells
		v-if="cellCss || hasWeekend(xHeaders)"
		:x-headers="xHeaders"
		:y-headers="yHeaders"
		:dx="dx"
		:dy="dy"
		:cell-css="cellCss"
		:view="view"
		:section="section"
		:mode="mode"
	/>
	<GridLines
		v-else
		:x-headers="xHeaders"
		:y-headers="yHeaders"
		:dx="dx"
		:dy="dy"
	/>
</template>
