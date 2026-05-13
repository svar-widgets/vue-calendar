<script setup>
import { setID } from "@svar-ui/lib-dom";

const props = defineProps({
	primitives: {},
	dx: {},
	dy: {},
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	view: {},
	section: {},
});

const laneHeight = 28;
const gap = 2;

function style(p) {
	const left = props.dx * p.x + gap;
	const width = props.dx * p.width - gap * 2;
	const lane = p.lane ?? 0;
	const lanes = p.totalLanes ?? 1;
	const groupTop = props.dy * p.y;
	const groupHeight = props.dy * p.height;
	const rowLaneHeight = Math.min(laneHeight, groupHeight / lanes);
	const top = groupTop + lane * rowLaneHeight + gap;
	const height = rowLaneHeight - gap * 2;

	return `left:${left}px;top:${top}px;width:${width}px;height:${height}px`;
}

function css(p) {
	const base = p.event.css || "";
	const dynamic = props.eventCss
		? props.eventCss({ event: p.event, view: props.view, section: props.section, mode: "bars" })
		: "";
	return base + (dynamic ? " " + dynamic : "");
}
</script>

<template>
	<div class="wx-bar-section">
		<div
			v-for="p in primitives"
			:key="p.id"
			:class="['wx-bar-event', css(p), { 'wx-bar-single-day': p.isMultiDay }]"
			:style="style(p)"
			:data-id="setID(p.id)"
		>
			<component
				v-if="eventContent"
				:is="eventContent"
				:event="p.event"
				mode="bars"
			/>
			<span v-else class="wx-bar-title">
				{{ p.event.text || " " }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.wx-bar-section {
	position: relative;
	width: 100%;
	height: 100%;
}
.wx-bar-event {
	position: absolute;
	background-color: var(--wx-color-primary);
	color: var(--wx-color-primary-font);
	border-radius: var(--wx-border-radius);
	overflow: hidden;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	display: flex;
	align-items: center;
}
.wx-bar-event:hover {
	opacity: 0.9;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}
.wx-bar-single-day {
	background-color: transparent;
	color: var(--wx-color-font);
	box-shadow: none;
	border-radius: 0;
}
.wx-bar-single-day:hover {
	background-color: var(--wx-color-secondary-hover);
	box-shadow: none;
	opacity: 1;
}
.wx-bar-title {
	padding: 0 8px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: var(--wx-font-size-sm);
	line-height: 1.2;
}
</style>
