<script setup>
import { setID } from "@svar-ui/lib-dom";

const props = defineProps({
	primitives: {},
	dx: {},
	dy: {},
	layoutMode: { default: "split" },
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	view: {},
	section: {},
});

const gap = 2;
const overlap = 20;

function style(p) {
	const top = props.dy * p.y;
	const height = props.dy * p.height - 1;

	if (props.layoutMode === "overlap") {
		const slot = p.slot ?? 0;
		const laneOffset = slot * overlap;
		const left = props.dx * p.x + gap + laneOffset;
		const width = Math.max(0, props.dx * p.width - gap * 2 - laneOffset);
		return `left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:${slot}`;
	}

	const slotWidth = p.width / (p.maxConcurrency ?? 1);
	const left = props.dx * (p.x + (p.slot ?? 0) * slotWidth) + gap;
	const width = props.dx * slotWidth - gap * 2;
	return `left:${left}px;top:${top}px;width:${width}px;height:${height}px`;
}

function formatTime(d) {
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function css(p) {
	const base = p.event.css || "";
	const dynamic = props.eventCss
		? props.eventCss({ event: p.event, view: props.view, section: props.section, mode: "boxes" })
		: "";
	return base + (dynamic ? " " + dynamic : "");
}
</script>

<template>
	<div class="wx-box-section">
		<div
			v-for="p in primitives"
			:key="p.id"
			:class="'wx-box-event ' + css(p)"
			:style="style(p)"
			:data-id="setID(p.id)"
		>
			<component
				v-if="eventContent"
				:is="eventContent"
				:event="p.event"
				mode="boxes"
			/>
			<template v-else>
				<div class="wx-box-time">
					{{ formatTime(p.event.start) }} – {{ formatTime(p.event.end) }}
				</div>
				<div class="wx-box-title">
					{{ p.event.text || "" }}
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped>
.wx-box-section {
	position: relative;
	width: 100%;
	height: 100%;
}
.wx-box-event {
	position: absolute;
	background-color: var(--wx-color-primary);
	color: var(--wx-color-primary-font);
	border-radius: var(--wx-border-radius);
	padding: 4px 8px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	font-size: var(--wx-font-size-sm);
	line-height: 1.3;
	cursor: pointer;
	z-index: 1;
}
.wx-box-event:hover {
	opacity: 0.9;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.wx-box-time {
	font-weight: var(--wx-font-weight-md);
	font-size: 12px;
	margin-bottom: 2px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.wx-box-title {
	overflow: hidden;
}
</style>
