<script>
import { Toolbar, registerToolbarItem } from "@svar-ui/vue-toolbar";
import { RichSelect, Segmented } from "@svar-ui/vue-core";
import { getToolbarItems } from "@svar-ui/calendar-store";
import DateNav from "./DateNav.vue";
import TodayButton from "./TodayButton.vue";
import DateLabel from "./DateLabel.vue";
import MenuButton from "./MenuButton.vue";
import AddEventButton from "./AddEventButton.vue";

registerToolbarItem("richselect", RichSelect);
registerToolbarItem("segmented", Segmented);
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
	toolbar: { default: () => ({ items: getToolbarItems() }) },
	readonly: { type: Boolean, default: false },
});

const currentView = subscribe(store.getReactiveState().currentView);

const _ = inject("wx-i18n").getGroup("eventCalendar");

const items = computed(() => {
	const base = props.toolbar?.items;
	const viewOptions = props.views.map((v) => ({
		id: v.id,
		label: _(v.label || v.id.charAt(0).toUpperCase() + v.id.slice(1)),
	}));

	const res = [...(base ?? [])].map((item) => {
		if (item.id === "modes") {
			if (viewOptions.length > 1) {
				return {
					...item,
					value: currentView.value,
					options: viewOptions,
				};
			} else {
				return null;
			}
		}
		if (props.readonly && item.comp === "addEventButton") return null;
		return item;
	}).filter(Boolean);
	return res;
});

const onchange = ({ item, value }) => {
	if (item.id === "modes") {
		store.exec("navigate-to", { view: value });
	}
};
</script>

<template>
	<div class="wx-navigation" role="navigation" :aria-label="_('Calendar controls')">
		<Toolbar :items="items" :onchange="onchange" :css="toolbar?.css"></Toolbar>
	</div>
</template>

<style scoped>
.wx-navigation {
	border-bottom: var(--wx-border);
}
</style>
