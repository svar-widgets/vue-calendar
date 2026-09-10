<script>
import { Toolbar, registerToolbarItem, ButtonList } from "@svar-ui/vue-toolbar";
import { RichSelect, Segmented } from "@svar-ui/vue-core";
import { getToolbarItems } from "@svar-ui/calendar-store";
import DateNav from "./DateNav.vue";
import TodayButton from "./TodayButton.vue";
import DateLabel from "./DateLabel.vue";
import MenuButton from "./MenuButton.vue";
import AddEventButton from "./AddEventButton.vue";

registerToolbarItem("richselect", RichSelect);
registerToolbarItem("richselect-navigation", RichSelect);
registerToolbarItem("richselect-navigation", ButtonList, { menu: true });
registerToolbarItem("segmented", Segmented);
registerToolbarItem("segmented-navigation", Segmented);
registerToolbarItem("segmented-navigation", ButtonList, { menu: true });
registerToolbarItem("segmented", ButtonList, { menu: true });
registerToolbarItem("dateNav", DateNav);
registerToolbarItem("todayButton", TodayButton);
registerToolbarItem("dateLabel", DateLabel);
registerToolbarItem("menuButton", MenuButton);
registerToolbarItem("addEventButton", AddEventButton);
</script>

<script setup>
import { inject, computed } from "vue";
import { subscribe } from "@svar-ui/lib-vue";

defineOptions({ name: "CalendarComponentsNavigation" });

const store = inject("calendar-api");

const props = defineProps({
	views: {},
	toolbar: { default: undefined },
	readonly: { type: Boolean, default: false },
	history: { type: Boolean, default: false },
});

const reactiveState = store.getReactiveState();
const currentView = subscribe(reactiveState.currentView);

const _ = inject("wx-i18n").getGroup("eventCalendar");

const items = computed(() => {
	const base = props.toolbar
		? props.toolbar.items
		: getToolbarItems({ history: props.history });
	const viewOptions = props.views.map((v) => ({
		id: v.id,
		label: _(v.label || v.id.charAt(0).toUpperCase() + v.id.slice(1)),
	}));

	const res = [...(base ?? [])]
		.map((item) => {
			let next = item;
			if (next.id === "modes") {
				if (viewOptions.length > 1) {
					return {
						...next,
						value: currentView.value,
						options: viewOptions,
					};
				} else {
					return null;
				}
			} else if (!props.readonly) {
			} else if (
				next.comp === "addEventButton" ||
				next.id === "undo" ||
				next.id === "redo"
			)
				return null;

			return next;
		})
		.filter(Boolean);
	return res;
});

const onchange = ({ item, value }) => {
	if (item.id === "modes") {
		store.exec("navigate-to", { view: value });
	}
};
</script>

<template>
	<div
		v-if="items.length"
		class="wx-navigation"
		role="navigation"
		:aria-label="_('Calendar controls')"
	>
		<Toolbar :items="items" :onchange="onchange" :css="toolbar?.css"></Toolbar>
	</div>
</template>

<style scoped>
.wx-navigation {
	border-bottom: var(--wx-border);
}
</style>
