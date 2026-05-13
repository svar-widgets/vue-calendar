<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { drag } from "../../directives/drag.js";
import { clickevent } from "../../directives/clickevent.js";
import { clickdate } from "../../directives/clickdate.js";
import { Popup } from "@svar-ui/vue-core";
import Headers from "./Headers.vue";
import SectionContent from "./SectionContent.vue";
import { useEventOverlay } from "./useEventOverlay.js";

const props = defineProps({
	data: {},
	cellCss: { default: undefined },
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	view: { default: undefined },
	tooltip: { default: undefined },
	eventPopup: { default: undefined },
	readonly: { default: undefined },
});

const api = inject("calendar-api");
const reactiveState = api.getReactiveState();
const _view = subscribe(reactiveState._view);

const section = computed(() => props.data[0]);
const xHeaders = computed(() => section.value?.xHeaders ?? null);
const yHeaders = computed(() => section.value?.yHeaders ?? null);
const showXHeaders = computed(
	() => xHeaders.value !== null && section.value?.xVisible !== false
);
const showYHeaders = computed(
	() => yHeaders.value !== null && section.value?.yVisible !== false
);

const contentEl = ref(null);
const contentWidth = ref(0);
const contentHeight = ref(0);
const ready = ref(false);

function measure() {
	if (contentEl.value) {
		const rect = contentEl.value.getBoundingClientRect();
		const w = Math.round(rect.width * 1000) / 1000;
		const h = Math.round(rect.height * 1000) / 1000;
		if (w !== contentWidth.value || h !== contentHeight.value) {
			contentWidth.value = w;
			contentHeight.value = h;
		}
	}
}

let ro;

onMounted(() => {
	measure();
	ready.value = true;
	ro = new ResizeObserver(() => measure());
	if (contentEl.value) ro.observe(contentEl.value);
});

onUnmounted(() => {
	ro?.disconnect();
});

const dx = computed(() => contentWidth.value / 100);
const dy = computed(() => contentHeight.value / 100);

function getMinContentWidth() {
	if (!xHeaders.value) return 0;
	const inner = xHeaders.value[xHeaders.value.length - 1];
	if (!inner?.length) return 0;
	const v = inner[0].ui?.minUnitWidth;
	return typeof v === "number" ? inner.length * v : 0;
}

function getMinContentHeight() {
	if (!yHeaders.value) return 0;
	const inner = yHeaders.value[yHeaders.value.length - 1];
	if (!inner?.length) return 0;
	const v = inner[0].ui?.minUnitHeight;
	return typeof v === "number" ? inner.length * v : 0;
}

const minW = computed(() => getMinContentWidth());
const minH = computed(() => getMinContentHeight());

const overlay = useEventOverlay(
	id => api.getEvent(id),
	() => (section.value?.mode === "boxes" ? "right-start" : "bottom-start")
);

// trackScroll exists in Popup but is missing from its .d.ts
const popupExtra = { trackScroll: true };

// Custom directives
const vDrag = {
	mounted(el, binding) {
		el._inst = drag(el, binding.value);
	},
	updated(el, binding) {
		el._inst?.update(binding.value);
	},
	unmounted(el) {
		el._inst?.destroy();
	},
};

const vClickevent = {
	mounted(el, binding) {
		el._inst = clickevent(el, binding.value);
	},
	updated(el, binding) {
		el._inst?.update(binding.value);
	},
	unmounted(el) {
		el._inst?.destroy();
	},
};

const vClickdate = {
	mounted(el, binding) {
		el._inst = clickdate(el, binding.value);
	},
	updated(el, binding) {
		el._inst?.update(binding.value);
	},
	unmounted(el) {
		el._inst?.destroy();
	},
};
</script>

<template>
	<div class="wx-scrollable-section">
		<div
			class="wx-scroll-grid"
			:class="{
				'wx-has-x-headers': showXHeaders,
				'wx-has-y-headers': showYHeaders,
			}"
		>
			<div
				v-if="showXHeaders && showYHeaders"
				class="wx-corner"
			></div>
			<div v-if="showXHeaders" class="wx-x-headers-sticky">
				<Headers :headers="xHeaders" direction="x" />
			</div>
			<div v-if="showYHeaders" class="wx-y-headers-sticky">
				<Headers :headers="yHeaders" direction="y" />
			</div>
			<div
				ref="contentEl"
				class="wx-content"
				:style="{
					minWidth: minW > 0 ? `${minW}px` : undefined,
					minHeight: minH > 0 ? `${minH}px` : undefined,
				}"
				v-clickevent="{
					exec: api.exec,
					getEvent: (id) => api.getEvent(id),
					onEventPopup: eventPopup ? overlay.handleEventPopup : undefined,
				}"
				v-clickdate="{ exec: api.exec }"
				@mousemove="tooltip ? overlay.handleTooltipMove($event) : undefined"
				@mouseleave="tooltip ? overlay.handleTooltipLeave() : undefined"
				v-drag="{
					mode: section?.mode ?? 'boxes',
					dx: dx,
					dy: dy,
					xHeaders: xHeaders,
					yHeaders: yHeaders,
					sectionName: section?.name ?? '',
					model: _view,
					exec: api.exec,
					getEvent: (id) => api.getEvent(id),
					move: !readonly && !!section?.ui?.drag,
					clipDrag: section?.ui?.clipDrag !== false,
					create: !readonly && !!section?.ui?.dragCreate,
				}"
			>
				<div
					v-if="section?.ui?.dragCreate"
					class="wx-drag-stub"
					data-drag-stub
					aria-hidden="true"
				></div>
				<SectionContent
					v-if="section"
					:section="section"
					:dx="dx"
					:dy="dy"
					:scroll-height="null"
					:measured="ready && contentWidth > 0 && contentHeight > 0"
					:cell-css="cellCss"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:tooltip="tooltip"
				/>
			</div>
		</div>

		<div
			v-if="overlay.tooltipState.value && tooltip"
			class="wx-calendar-tooltip"
			:style="`position:fixed;left:${overlay.mousePos.value.x + 12}px;top:${overlay.mousePos.value.y + 16}px;z-index:10000;pointer-events:none`"
			aria-hidden="true"
		>
			<component
				:is="tooltip"
				:event="overlay.tooltipState.value.event"
			/>
		</div>

		<Popup
			v-if="overlay.eventPopupState.value && eventPopup"
			:at="overlay.eventPopupState.value.at"
			:parent="overlay.eventPopupState.value.element"
			:oncancel="overlay.hideEventPopup"
			v-bind="popupExtra"
		>
			<component
				:is="eventPopup"
				:event="overlay.eventPopupState.value.event"
				:close="overlay.hideEventPopup"
			/>
		</Popup>
	</div>
</template>

<style scoped>
.wx-scrollable-section {
	flex: 1;
	min-height: 0;
	overflow: auto;
}

.wx-scroll-grid {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;
	min-height: 100%;
}
.wx-scroll-grid.wx-has-y-headers {
	grid-template-columns: auto 1fr;
}
.wx-scroll-grid.wx-has-x-headers {
	grid-template-rows: auto 1fr;
}

.wx-corner {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 3;
	background: var(--wx-background);
	width: var(--wx-calendar-y-scale-width, 60px);
	border-right: var(--wx-border);
	border-bottom: var(--wx-border);
}

.wx-x-headers-sticky {
	position: sticky;
	top: 0;
	z-index: 2;
	background: var(--wx-background);
}

.wx-y-headers-sticky {
	position: sticky;
	left: 0;
	z-index: 1;
	background: var(--wx-background);
}

.wx-content {
	position: relative;
	z-index: 0;
}
</style>
