<script setup>
import BoxSection from "./BoxSection.vue";
import BarSection from "./BarSection.vue";
import GridSection from "./GridSection.vue";
import ListSection from "./ListSection.vue";
import YearSection from "./YearSection.vue";
import Grid from "./Grid.vue";
import NowLine from "./NowLine.vue";

const props = defineProps({
	section: {},
	dx: {},
	dy: {},
	scrollHeight: { default: null },
	measured: {},
	cellCss: { default: undefined },
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	view: {},
	tooltip: { default: undefined },
	onoverflow: { default: undefined },
});
</script>

<template>
	<ListSection
		v-if="section.mode === 'list'"
		:primitives="section.primitives"
		:event-content="eventContent"
	/>
	<YearSection
		v-else-if="section.mode === 'year'"
		:section="section"
		:tooltip="tooltip"
		:event-content="eventContent"
	/>
	<template v-else-if="measured">
		<div
			v-if="scrollHeight !== null"
			class="wx-scroll-inner"
			:style="{ height: scrollHeight + 'px' }"
		>
			<GridSection
				v-if="section.mode === 'grid' && section.cells"
				:primitives="section.primitives"
				:cells="section.cells"
				:dx="dx"
				:dy="dy"
				:cell-css="cellCss"
				:event-css="eventCss"
				:event-content="eventContent"
				:view="view"
				:section="section.name"
				:event-overflow="section.ui?.eventOverflow"
				:onoverflow="onoverflow"
			/>
			<template v-else>
				<Grid
					:x-headers="section.xHeaders"
					:y-headers="section.yHeaders"
					:dx="dx"
					:dy="dy"
					:cell-css="cellCss"
					:view="view"
					:section="section.name"
					:mode="section.mode"
				/>
				<BoxSection
					v-if="section.mode === 'boxes'"
					:primitives="section.primitives"
					:dx="dx"
					:dy="dy"
					:layout-mode="section.ui?.boxLayout ?? 'split'"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:section="section.name"
				/>
				<BarSection
					v-else
					:primitives="section.primitives"
					:dx="dx"
					:dy="dy"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:section="section.name"
				/>
				<NowLine
					v-if="section.ui?.nowLine"
					:y-headers="section.yHeaders"
					:dy="dy"
				/>
			</template>
		</div>
		<template v-else>
			<GridSection
				v-if="section.mode === 'grid' && section.cells"
				:primitives="section.primitives"
				:cells="section.cells"
				:dx="dx"
				:dy="dy"
				:cell-css="cellCss"
				:event-css="eventCss"
				:event-content="eventContent"
				:view="view"
				:section="section.name"
				:event-overflow="section.ui?.eventOverflow"
				:onoverflow="onoverflow"
			/>
			<template v-else>
				<Grid
					:x-headers="section.xHeaders"
					:y-headers="section.yHeaders"
					:dx="dx"
					:dy="dy"
					:cell-css="cellCss"
					:view="view"
					:section="section.name"
					:mode="section.mode"
				/>
				<BoxSection
					v-if="section.mode === 'boxes'"
					:primitives="section.primitives"
					:dx="dx"
					:dy="dy"
					:layout-mode="section.ui?.boxLayout ?? 'split'"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:section="section.name"
				/>
				<BarSection
					v-else
					:primitives="section.primitives"
					:dx="dx"
					:dy="dy"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:section="section.name"
				/>
				<NowLine
					v-if="section.ui?.nowLine"
					:y-headers="section.yHeaders"
					:dy="dy"
				/>
			</template>
		</template>
	</template>
</template>

<style scoped>
.wx-scroll-inner {
	position: relative;
	width: 100%;
}
</style>
