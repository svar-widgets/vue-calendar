<script setup>

const props = defineProps({
	xHeaders: { default: null },
	yHeaders: { default: null },
	dx: {},
	dy: {},
});
</script>

<template>
	<div class="wx-grid" aria-hidden="true">
		<template v-if="props.xHeaders">
			<div
				v-for="unit in props.xHeaders[props.xHeaders.length - 1].slice(0, -1)"
				:key="unit.position"
				class="wx-grid-line wx-vertical"
				:style="{ left: dx * (unit.position + unit.size) + 'px' }"
			></div>
		</template>
		<template v-if="props.yHeaders">
			<div
				v-for="unit in props.yHeaders[props.yHeaders.length - 1].slice(0, -1)"
				:key="unit.position"
				class="wx-grid-line wx-horizontal"
				:style="{ top: dy * (unit.position + unit.size) + 'px' }"
			></div>
		</template>
	</div>
</template>

<style scoped>
.wx-grid {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}
.wx-grid-line {
	position: absolute;
	background-color: var(--wx-calendar-grid-color);
}
.wx-grid-line.wx-vertical {
	top: 0;
	width: 1px;
	height: 100%;
}
.wx-grid-line.wx-horizontal {
	left: 0;
	height: 1px;
	width: 100%;
}
</style>
