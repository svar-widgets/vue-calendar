<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

defineOptions({ name: "CalendarRenderNowLine" });

const props = defineProps({
	yHeaders: { default: null },
	dy: {},
});

const now = ref(new Date());

let intervalId;

onMounted(() => {
	intervalId = setInterval(() => {
		now.value = new Date();
	}, 60_000);
});

onUnmounted(() => {
	if (intervalId !== undefined) clearInterval(intervalId);
});

const position = computed(() => {
	if (!props.yHeaders) return null;
	const inner = props.yHeaders[props.yHeaders.length - 1];
	if (!inner?.length) return null;

	const first = inner[0]?.ui?.date;
	const last = inner[inner.length - 1]?.ui?.date;
	if (!first || !last) return null;

	const rangeStart = first.getTime();
	// range end = last unit position + last unit size worth of time
	const unitMs =
		(last.getTime() - first.getTime()) / (inner.length - 1 || 1);
	const rangeEnd = last.getTime() + unitMs;
	const nowMs = now.value.getTime();

	if (nowMs < rangeStart || nowMs > rangeEnd) return null;

	// same math as LinearScale.eventToPosition
	const pos = ((nowMs - rangeStart) / (rangeEnd - rangeStart)) * 100;
	return pos;
});
</script>

<template>
	<div
		v-if="position !== null"
		class="wx-now-line"
		:style="{ top: `${dy * position}px` }"
		aria-hidden="true"
	>
		<div class="wx-now-dot"></div>
	</div>
</template>

<style scoped>
.wx-now-line {
	position: absolute;
	left: 0;
	right: 0;
	height: 0;
	z-index: 3;
	pointer-events: none;
}
.wx-now-line::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 2px;
	background: var(--wx-color-danger);
	transform: translateY(-50%);
}
.wx-now-dot {
	position: absolute;
	left: 0;
	top: 0;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--wx-color-danger);
	transform: translate(-50%, -50%);
}
</style>
