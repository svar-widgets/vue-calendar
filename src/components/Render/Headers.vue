<script setup>
defineOptions({ name: "CalendarRenderHeaders" });


const props = defineProps({
	headers: {},
	direction: {},
});
</script>

<template>
	<div v-if="props.direction === 'x'" class="wx-x-headers">
		<div v-for="(level, li) in props.headers" :key="li" class="wx-x-header-row">
			<div
				v-for="(unit, ui) in level"
				:key="ui"
				class="wx-x-header-cell"
				role="columnheader"
				:style="`left:${unit.position}%;width:${unit.size}%`"
			>
				{{ unit.label }}
			</div>
		</div>
	</div>
	<div v-else class="wx-y-headers">
		<div v-for="(level, li) in props.headers" :key="li" class="wx-y-header-col">
			<div
				v-for="(unit, ui) in level"
				:key="ui"
				class="wx-y-header-cell"
				role="rowheader"
				:style="`top:${unit.position}%;height:${unit.size}%`"
			>
				{{ unit.label }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.wx-x-headers {
	flex-shrink: 0;
	border-bottom: var(--wx-border);
}
.wx-x-header-row {
	position: relative;
	display: flex;
	height: 32px;
}
.wx-x-header-cell {
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	font-weight: 500;
	border-right: var(--wx-border);
}
.wx-x-header-cell:last-child {
	border-right: none;
}

.wx-y-headers {
	display: flex;
	flex-shrink: 0;
	width: var(--wx-calendar-y-scale-width, 60px);
	height: 100%;
	border-right: var(--wx-border);
}
.wx-y-header-col {
	position: relative;
	flex: 1;
	min-width: 0;
	height: 100%;
}
.wx-y-header-cell {
	position: absolute;
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	font-size: 11px;
	color: var(--wx-color-font-alt);
	padding-top: 2px;
}
</style>
