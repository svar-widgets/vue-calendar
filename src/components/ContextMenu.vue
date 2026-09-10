<script setup>
import { ref, computed, inject, provide } from "vue";
import { ContextMenu } from "@svar-ui/vue-menu";
import { locale } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/calendar-locales";
import { en as coreEn } from "@svar-ui/core-locales";
import { getMenuOptions } from "@svar-ui/calendar-store";

const props = defineProps({
	options: { type: Array, default: () => [] },
	api: { default: null },
	resolver: { type: Function, default: null },
	filter: { type: Function, default: null },
	at: { type: String, default: "point" },
	onclick: { type: Function },
	css: { type: String },
});

let activeId = null;
let rawId = null;

// set locale
let l = inject("wx-i18n", undefined);
if (!l) {
	l = locale({ ...en, ...coreEn });
	provide("wx-i18n", l);
}
const _ = l.getGroup("eventCalendar");

function applyLocale(opts) {
	return opts.map((op) => {
		op = { ...op };
		if (op.text) op.text = _(op.text);
		if (op.subtext) op.subtext = _(op.subtext);
		if (op.data) op.data = applyLocale(op.data);
		return op;
	});
}

function getOptions() {
	const base = props.options.length ? props.options : getMenuOptions();
	return applyLocale(base);
}

function itemResolver(id, ev) {
	if (!id || !props.api) return null;

	const event = props.api.getEvent(id);
	if (!event) return null;

	if (props.resolver) {
		const result = props.resolver(event, ev);
		if (!result) return null;
	}

	activeId = event.id;
	rawId = id;
	return event;
}

function menuAction(ev) {
	const action = ev?.action;
	if (!action) return;

	const id = typeof activeId === "object" ? activeId.id : activeId;

	if (action.id === "edit-event") {
		props.api.exec("select-event", { id, rawId });
	} else if (action.id === "delete-event") {
		props.api.exec("delete-event", { id, rawId });
	}

	props.onclick?.(ev);
}

function filterMenu(item, event) {
	return props.filter ? props.filter(item, event) : true;
}

const cOptions = computed(() => getOptions());

const menu = ref(null);

function show(ev, obj) {
	menu.value.show(ev, obj);
}

defineExpose({ show });
</script>

<template>
	<ContextMenu
		:filter="filterMenu"
		:options="cOptions"
		data-key="id"
		:resolver="itemResolver"
		:onclick="menuAction"
		:css="css"
		:at="at"
		ref="menu"
	/>
	<span @contextmenu="menu?.show" data-menu-ignore="true">
		<slot />
	</span>
</template>

<style scoped>
:deep(.wx-menu .wx-option.wx-disabled) {
	pointer-events: none;
}
:deep(.wx-menu .wx-option.wx-disabled .wx-value),
:deep(.wx-menu .wx-option.wx-disabled .wx-icon) {
	color: var(--wx-color-font-disabled);
}
</style>
