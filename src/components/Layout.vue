<script setup>
defineOptions({ name: "CalendarComponentsLayout" });

import { Comment, Fragment, Text, computed, inject, useSlots } from "vue";
import { subscribe } from "@svar-ui/lib-vue";
import Navigation from "./Navigation.vue";
import Sections from "./Render/Sections.vue";
import ScrollableSection from "./Render/ScrollableSection.vue";


const _ = inject("wx-i18n").getGroup("eventCalendar");
const slots = useSlots();

const props = defineProps({
	store: {},
	views: {},
	toolbar: { default: undefined },
	cellCss: { default: undefined },
	eventCss: { default: undefined },
	eventContent: { default: undefined },
	tooltip: { default: undefined },
	eventPopup: { default: undefined },
	brandmark: { default: undefined },
	readonly: { default: undefined },
});

const reactiveState = props.store.getReactiveState();
const viewData = subscribe(reactiveState.viewData);
const currentView = subscribe(reactiveState.currentView);
const _view = subscribe(reactiveState._view);

const renderMode = computed(() => _view.value?.render);

const hasRenderableNodes = (nodes = []) =>
	nodes.some((node) => {
		if (!node) return false;
		if (Array.isArray(node)) return hasRenderableNodes(node);
		if (node.type === Comment) return false;
		if (node.type === Text) return String(node.children ?? "").trim().length > 0;
		if (node.type === Fragment) {
			return hasRenderableNodes(
				Array.isArray(node.children) ? node.children : []
			);
		}
		return true;
	});

const hasSidebar = computed(() => {
	const slot = slots.default;
	return !!slot && hasRenderableNodes(slot());
});
</script>

<template>
	<div class="wx-calendar" role="region" :aria-label="_('Calendar')">
		<Navigation
			v-if="toolbar !== null"
			:views="views"
			:toolbar="toolbar"
			:readonly="readonly"
		/>
		<template v-if="hasSidebar">
			<div class="wx-layout-content">
				<div
					class="wx-layout-sidebar"
					role="complementary"
					:aria-label="_('Calendar sidebar')"
				>
					<slot />
				</div>
				<div class="wx-layout-main">
					<ScrollableSection
						v-if="renderMode === 'scrollable'"
						:data="viewData"
						:cell-css="cellCss"
						:event-css="eventCss"
						:event-content="eventContent"
						:view="currentView"
						:tooltip="tooltip"
						:event-popup="eventPopup"
						:readonly="readonly"
					/>
					<Sections
						v-else
						:data="viewData"
						:cell-css="cellCss"
						:event-css="eventCss"
						:event-content="eventContent"
						:view="currentView"
						:tooltip="tooltip"
						:event-popup="eventPopup"
						:readonly="readonly"
					/>
					<a
						v-if="brandmark"
						:style="brandmark.style"
						:href="brandmark.link"
						target="_blank"
					>
						{{ brandmark.text }}
					</a>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="wx-layout-main wx-layout-main--full">
				<ScrollableSection
					v-if="renderMode === 'scrollable'"
					:data="viewData"
					:cell-css="cellCss"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="currentView"
					:tooltip="tooltip"
					:event-popup="eventPopup"
					:readonly="readonly"
				/>
				<Sections
					v-else
					:data="viewData"
					:cell-css="cellCss"
					:event-css="eventCss"
					:event-content="eventContent"
					:view="currentView"
					:tooltip="tooltip"
					:event-popup="eventPopup"
					:readonly="readonly"
				/>
				<a
					v-if="brandmark"
					:style="brandmark.style"
					:href="brandmark.link"
					target="_blank"
				>
					{{ brandmark.text }}
				</a>
			</div>
		</template>
	</div>
</template>

<style scoped>
.wx-calendar {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.wx-layout-content {
	display: flex;
	flex: 1;
	min-height: 0;
}
.wx-layout-sidebar {
	flex-shrink: 0;
	border-right: var(--wx-border);
}
.wx-layout-main {
	flex: 1;
	min-width: 0;
	min-height: 0;
	position: relative;
	display: flex;
	flex-direction: column;
}
.wx-layout-main--full {
	min-height: 0;
}
</style>
