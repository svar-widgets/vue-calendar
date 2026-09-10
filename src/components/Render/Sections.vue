<script setup>
defineOptions({ name: "CalendarRenderSections" });

import {
	ref,
	computed,
	watchEffect,
	inject,
	onMounted,
	onUnmounted,
	nextTick,
	toRaw,
} from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import { Popup } from "@svar-ui/vue-core";
import Headers from "./Headers.vue";
import SectionContent from "./SectionContent.vue";
import EventProjection from "./EventProjection.vue";
import { resolveEventPosition } from "./resolveEventPosition";
import { useEventOverlay } from "../useEventOverlay.js";
import { drag } from "../../directives/drag.js";
import { clickevent } from "../../directives/clickevent.js";
import { clickdate } from "../../directives/clickdate.js";

const api = inject("calendar-api");
const reactiveState = api.getReactiveState();
const _view = subscribe(reactiveState._view);

const props = defineProps({
	data: {},
	cellCss: { type: Function },
	eventCss: { type: Function },
	eventContent: {},
	view: {},
	tooltip: {},
	eventPopup: {},
	readonly: { type: Boolean, default: false },
	eventProjection: {},
});

// Custom directives
const vDrag = {
	mounted(el, binding) {
		const inst = drag(el, binding.value);
		el._dragInst = inst;
	},
	updated(el, binding) {
		el._dragInst?.update(binding.value);
	},
	unmounted(el) {
		el._dragInst?.destroy();
	},
};

const vClickevent = {
	mounted(el, binding) {
		const inst = clickevent(el, binding.value);
		el._clickeventInst = inst;
	},
	updated(el, binding) {
		el._clickeventInst?.update(binding.value);
	},
	unmounted(el) {
		el._clickeventInst?.destroy();
	},
};

const vClickdate = {
	mounted(el, binding) {
		const inst = clickdate(el, binding.value);
		el._clickdateInst = inst;
	},
	updated(el, binding) {
		el._clickdateInst?.update(binding.value);
	},
	unmounted(el) {
		el._clickdateInst?.destroy();
	},
};

const ready = ref(false);
const sectionEls = ref({});
const contentEls = ref({});
const sizes = ref({});
const xHeadersEl = ref(undefined);
const xHeadersHeight = ref(0);
const gridOverflow = ref({});

function measure() {
	const next = {};
	let changed = false;
	for (const section of props.data) {
		const sectionEl = sectionEls.value[section.name];
		const contentEl = contentEls.value[section.name];
		if (sectionEl && contentEl) {
			const w = contentEl.clientWidth;
			const h = sectionEl.clientHeight;
			next[section.name] = { width: w, height: h };
			const prev = sizes.value[section.name];
			if (!prev || prev.width !== w || prev.height !== h) {
				changed = true;
			}
		}
	}
	if (changed) sizes.value = next;
	const xh = xHeadersEl.value ? xHeadersEl.value.clientHeight : 0;
	if (xh !== xHeadersHeight.value) xHeadersHeight.value = xh;
}

let ro = null;

function observeAll() {
	if (!ro) return;
	ro.disconnect();
	for (const section of props.data) {
		const el = sectionEls.value[section.name];
		if (el) ro.observe(el);
	}
	if (xHeadersEl.value) ro.observe(xHeadersEl.value);
}

onMounted(() => {
	measure();
	ready.value = true;

	ro = new ResizeObserver(() => measure());
	observeAll();
});

onUnmounted(() => {
	ro?.disconnect();
});

watchEffect(() => {
	if (!ready.value || !ro) return;
	// access props.data to track it
	void props.data;
	nextTick().then(() => {
		observeAll();
		measure();
	});
});

function dx(name) {
	return (sizes.value[name]?.width ?? 0) / 100;
}

function getMinContentHeight(section) {
	if (!section.yHeaders) return 0;
	const innerLevel = section.yHeaders[section.yHeaders.length - 1];
	if (!innerLevel || innerLevel.length === 0) return 0;
	const first = innerLevel[0];
	const minUnitHeight = first.ui?.minUnitHeight;
	return typeof minUnitHeight === "number"
		? innerLevel.length * minUnitHeight
		: 0;
}

// Lane height must match BarSection.vue
const BAR_LANE_HEIGHT = 28;

function getBarSectionHeight(section) {
	if (section.mode !== "bars" || typeof section.size === "number") return 0;
	let maxLanes = 0;
	for (const p of section.primitives) {
		const lanes = p.totalLanes ?? 1;
		if (lanes > maxLanes) maxLanes = lanes;
	}
	if (!maxLanes && projectionFor(section.name)) {
		maxLanes = 1;
	}
	return maxLanes * BAR_LANE_HEIGHT;
}

function dy(name, section) {
	const containerHeight = sizes.value[name]?.height ?? 0;
	const minHeight = getMinContentHeight(section);
	const barHeight = getBarSectionHeight(section);
	return Math.max(containerHeight, minHeight, barHeight) / 100;
}

function sectionMinHeight(section) {
	if (typeof section.size !== "number") {
		return getBarSectionHeight(section);
	}
	return getMinContentHeight(section);
}

const projections = computed(() => {
	const source = props.eventProjection;
	if (!source || !source.htmlEvent) return [];
	let event;
	for (const item of visibleSections.value) {
		const el = contentEls.value[item.name];
		if (!el) continue;
		event = resolveEventPosition(
			source.htmlEvent,
			source.event,
			item,
			el,
			dx(item.name),
			dy(item.name, item),
			_view.value,
			document,
		);
		if (event) break;
	}
	if (!event) return [];
	// store calculated props on the original projection object
	// (toRaw keeps the write out of Vue's reactivity, like untrack in Svelte)
	Object.assign(toRaw(source.event), event);
	return _view.value.projectEvent(event);
});

function projectionFor(section) {
	// projections can be read re-entrantly while it is being evaluated,
	// in which case Vue returns the previous (possibly undefined) value
	return projections.value?.find((item) => item.section === section);
}

const visibleSections = computed(() =>
	props.data.filter(
		(s) =>
			s.size !== "content-optional" ||
			s.primitives.length > 0 ||
			!!projectionFor(s.name),
	),
);

// Sticky prefix: consecutive content-sized sections from the top.
const stickyCount = computed(() => {
	let count = 0;
	for (const s of visibleSections.value) {
		const sz = s.size ?? 1;
		if (sz === "content" || sz === "content-optional") count++;
		else break;
	}
	return count;
});

// Cumulative `top` for each sticky section, starting after x-headers.
const stickyOffsets = computed(() => {
	const offsets = [];
	let acc = xHeadersHeight.value;
	for (let i = 0; i < stickyCount.value; i++) {
		offsets[i] = acc;
		const name = visibleSections.value[i].name;
		acc += sizes.value[name]?.height ?? 0;
	}
	return offsets;
});

function onGridOverflow(section, overflow) {
	if (!!gridOverflow.value[section] === overflow) return;
	gridOverflow.value = { ...gridOverflow.value, [section]: overflow };
}

const hasYHeaders = computed(() =>
	visibleSections.value.some(
		(s) => s.yHeaders !== null && s.yVisible !== false,
	),
);

const xHeaders = computed(
	() =>
		visibleSections.value.find(
			(s) => s.xHeaders !== null && s.xVisible !== false,
		)?.xHeaders ?? null,
);

function sectionFlex(section, sticky) {
	if (sticky) return "0 0 auto";
	if (section.mode === "list" || section.mode === "year") return "0 0 auto";
	return typeof section.size === "number" ? "1" : "0 0 auto";
}

const overlay = useEventOverlay(
	(id) => api.getEvent(id),
	(el) => {
		const section = visibleSections.value.find((s) =>
			sectionEls.value[s.name]?.contains(el),
		);
		return section?.mode === "boxes" ? "right-start" : "bottom-start";
	},
);

// trackScroll exists in Popup but is missing from its .d.ts
const popupExtra = { trackScroll: true };
</script>

<template>
	<div class="wx-sections">
		<div
			v-if="xHeaders"
			class="wx-x-headers-row"
			:ref="
				(el) => {
					xHeadersEl = el;
				}
			"
		>
			<div v-if="hasYHeaders" class="wx-header-corner"></div>
			<div class="wx-x-headers-area">
				<Headers :headers="xHeaders" direction="x" />
			</div>
		</div>

		<div
			v-for="(section, idx) in visibleSections"
			:key="section.name"
			class="wx-section"
			:class="{
				'wx-section-last': idx === visibleSections.length - 1,
				'wx-section-sticky': idx < stickyCount,
				'wx-section-grid':
					section.mode === 'grid' && !!gridOverflow[section.name],
				'wx-has-y-headers': hasYHeaders,
			}"
			:style="{
				flex: sectionFlex(section, idx < stickyCount),
				minHeight:
					sectionMinHeight(section) > 0
						? sectionMinHeight(section) + 'px'
						: undefined,
				top: idx < stickyCount ? (stickyOffsets[idx] ?? 0) + 'px' : undefined,
				zIndex: idx < stickyCount ? 10 - idx : undefined,
			}"
			:ref="
				(el) => {
					if (el) sectionEls[section.name] = el;
				}
			"
		>
			<template v-if="section.yVisible !== false">
				<div class="wx-y-headers-area">
					<Headers :headers="section.yHeaders" direction="y" />
				</div>
			</template>
			<div v-else-if="hasYHeaders" class="wx-header-spacer"></div>

			<div
				class="wx-section-content"
				:ref="
					(el) => {
						if (el) contentEls[section.name] = el;
					}
				"
				v-drag="{
					mode: section.mode,
					dx: dx(section.name),
					dy: dy(section.name, section),
					xHeaders: section.xHeaders,
					yHeaders: section.yHeaders,
					sectionName: section.name,
					model: _view,
					exec: api.exec,
					getEvent: (id) => api.getEvent(id),
					move: !readonly && !!section.ui?.drag,
					clipDrag: section.ui?.clipDrag !== false,
					create: !readonly && !!section.ui?.dragCreate,
				}"
				v-clickevent="{
					exec: api.exec,
					getEvent: (id) => api.getEvent(id),
					onEventPopup: eventPopup ? overlay.handleEventPopup : undefined,
				}"
				v-clickdate="{ exec: api.exec }"
				@mousemove="tooltip ? overlay.handleTooltipMove($event) : undefined"
				@mouseleave="tooltip ? overlay.handleTooltipLeave() : undefined"
			>
				<div
					v-if="section.ui?.dragCreate"
					class="wx-drag-stub"
					data-drag-stub
					aria-hidden="true"
				></div>
				<SectionContent
					:section="section"
					:dx="dx(section.name)"
					:dy="dy(section.name, section)"
					:scroll-height="null"
					:measured="ready && !!sizes[section.name]"
					:cell-css="cellCss"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="view"
					:tooltip="tooltip"
					:onoverflow="
						section.mode === 'grid'
							? (overflow) => onGridOverflow(section.name, overflow)
							: undefined
					"
				/>
				<EventProjection
					v-if="projectionFor(section.name)"
					:primitives="projectionFor(section.name).primitives"
					:dx="dx(section.name)"
					:dy="dy(section.name, section)"
				/>
			</div>
		</div>

		<div
			v-if="overlay.tooltipState.value && tooltip"
			class="wx-calendar-tooltip"
			:style="{
				position: 'fixed',
				left: overlay.mousePos.value.x + 12 + 'px',
				top: overlay.mousePos.value.y + 16 + 'px',
				zIndex: 10000,
				pointerEvents: 'none',
			}"
			aria-hidden="true"
		>
			<component :is="tooltip" :event="overlay.tooltipState.value.event" />
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
.wx-sections {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}

.wx-x-headers-row {
	display: flex;
	flex-shrink: 0;
	position: sticky;
	top: 0;
	z-index: 11;
	background: var(--wx-background);
}
.wx-header-corner {
	width: var(--wx-calendar-y-scale-width, 60px);
	flex-shrink: 0;
	border-right: var(--wx-border);
	border-bottom: var(--wx-border);
}
.wx-x-headers-area {
	flex: 1;
	min-width: 0;
}

.wx-section {
	display: grid;
	grid-template-columns: 1fr;
	overflow: hidden;
	border-bottom: var(--wx-border);
}
.wx-section-last {
	border-bottom: none;
}
.wx-section.wx-has-y-headers {
	grid-template-columns: auto 1fr;
}
.wx-section-sticky {
	position: sticky;
	background: var(--wx-background);
}
.wx-section-grid {
	overflow: visible;
	min-height: 0;
}

.wx-y-headers-area {
	align-self: stretch;
}
.wx-header-spacer {
	width: var(--wx-calendar-y-scale-width, 60px);
	border-right: var(--wx-border);
}

.wx-section-content {
	min-width: 0;
	position: relative;
}

.wx-sections :deep(.wx-dragging),
.wx-sections :deep(.wx-resizing) {
	box-shadow: var(--wx-shadow-light) !important;
	transition: none !important;
	z-index: 100 !important;
	pointer-events: none;
}
.wx-sections :deep(.wx-dragging) {
	cursor: grabbing !important;
}

:deep(.wx-drag-stub) {
	display: none;
	position: absolute;
	background: var(--wx-color-primary);
	opacity: 0.3;
	border-radius: var(--wx-border-radius);
	pointer-events: none;
	z-index: 50;
}
</style>
