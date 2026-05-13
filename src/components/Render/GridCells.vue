<script setup>
import { computed } from 'vue';

const props = defineProps({
	xHeaders: { default: null },
	yHeaders: { default: null },
	dx: {},
	dy: {},
	cellCss: {},
	view: {},
	section: {},
	mode: {},
});

function getDate(unit) {
	return unit?.ui?.date instanceof Date ? unit.ui.date : null;
}

function combineDates(dateUnit, timeUnit) {
	const d = new Date(dateUnit);
	d.setHours(
		timeUnit.getHours(),
		timeUnit.getMinutes(),
		timeUnit.getSeconds(),
		0
	);
	return d;
}

function resolveDate(x, y) {
	const xd = getDate(x);
	const yd = getDate(y);
	if (xd && yd) return combineDates(xd, yd);
	return xd ?? yd;
}

const cells = computed(() => {
	const xUnits = props.xHeaders
		? props.xHeaders[props.xHeaders.length - 1]
		: null;
	const yUnits = props.yHeaders
		? props.yHeaders[props.yHeaders.length - 1]
		: null;
	const result = [];

	const computeCss = props.cellCss
		? (x, y) =>
				props.cellCss({
					view: props.view,
					section: props.section,
					mode: props.mode,
					x,
					y,
					date: resolveDate(x, y),
				})
		: () => "";

	if (xUnits && yUnits) {
		for (const xUnit of xUnits) {
			for (const yUnit of yUnits) {
				result.push({
					x: xUnit.position,
					y: yUnit.position,
					width: xUnit.size,
					height: yUnit.size,
					css: computeCss(xUnit, yUnit),
					weekend: !!(xUnit.weekend || yUnit.weekend),
				});
			}
		}
	} else if (xUnits) {
		for (const xUnit of xUnits) {
			result.push({
				x: xUnit.position,
				y: 0,
				width: xUnit.size,
				height: 100,
				css: computeCss(xUnit, null),
				weekend: !!xUnit.weekend,
			});
		}
	} else if (yUnits) {
		for (const yUnit of yUnits) {
			result.push({
				x: 0,
				y: yUnit.position,
				width: 100,
				height: yUnit.size,
				css: computeCss(null, yUnit),
				weekend: !!yUnit.weekend,
			});
		}
	}

	return result;
});

function cellStyle(c) {
	return `left:${props.dx * c.x}px;top:${props.dy * c.y}px;width:${props.dx * c.width}px;height:${props.dy * c.height}px`;
}
</script>

<template>
	<div class="wx-grid" aria-hidden="true">
		<div
			v-for="(c, i) in cells"
			:key="i"
			:class="['wx-grid-cell', c.css, { 'wx-weekend': c.weekend }]"
			:style="cellStyle(c)"
		></div>
	</div>
</template>

<style scoped>
.wx-grid {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}
.wx-grid-cell {
	position: absolute;
	box-sizing: border-box;
	border-right: var(--wx-border);
	border-bottom: var(--wx-border);
}
.wx-grid-cell.wx-weekend {
	background-color: var(--wx-calendar-weekend-background);
}
</style>
