<script setup>
import { inject, provide } from "vue";
import { Checkbox, DatePicker, TimePicker } from "@svar-ui/vue-core";
import { uid } from "@svar-ui/lib-state";

defineOptions({ inheritAttrs: false });

const locale = inject("wx-i18n");
const _ = locale ? locale.getGroup("eventCalendar") : v => v;

provide("wx-input-id", "");

const props = defineProps({
	value: {},
	error: { default: undefined },
	onchange: { type: Function },
});

function sameDay(a, b) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function update(part) {
	props.onchange({ value: { ...props.value, ...part } });
}

function pickDate(key, day) {
	if (!day) return;
	const current = props.value[key];
	const next = new Date(day);
	if (current) {
		next.setHours(current.getHours(), current.getMinutes(), 0, 0);
	}

	if (key === "start" && sameDay(props.value.start, props.value.end)) {
		const end = new Date(props.value.end);
		end.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());
		update({ start: next, end });
	} else {
		update({ [key]: next });
	}
}

function pickTime(key, time) {
	const next = new Date(props.value[key]);
	next.setHours(time.getHours(), time.getMinutes(), 0, 0);
	update({ [key]: next });
}
</script>

<template>
	<div class="wx-event-dates" :class="{ 'wx-error': !!props.error }">
		<div class="wx-date-row">
			<span class="wx-date-label">{{ _("Start date") }}</span>
			<div class="wx-date-control">
				<DatePicker
					:value="props.value.start"
					:buttons="false"
					:onchange="(ev) => pickDate('start', ev.value)"
				/>
			</div>
			<div v-if="!props.value.allDay" class="wx-time-control">
				<TimePicker
					:value="props.value.start"
					:onchange="(ev) => pickTime('start', ev.value)"
				/>
			</div>
		</div>

		<div class="wx-date-row">
			<span class="wx-date-label">{{ _("End date") }}</span>
			<div class="wx-date-control">
				<DatePicker
					:value="props.value.end"
					:buttons="false"
					:onchange="(ev) => pickDate('end', ev.value)"
				/>
			</div>
			<div v-if="!props.value.allDay" class="wx-time-control">
				<TimePicker
					:value="props.value.end"
					:onchange="(ev) => pickTime('end', ev.value)"
				/>
			</div>
		</div>

		<div class="wx-date-row">
			<span class="wx-date-label"></span>
			<Checkbox
				:label="_('All day')"
				:value="!!props.value.allDay"
				:onchange="(ev) => update({ allDay: ev.value })"
			/>
		</div>
	</div>
</template>

<style scoped>
.wx-event-dates {
	display: flex;
	flex-direction: column;
	gap: var(--wx-padding);
}

.wx-date-row {
	display: flex;
	align-items: center;
	gap: var(--wx-padding);
}

.wx-date-label {
	flex: none;
	width: 72px;
}

.wx-date-control {
	flex: 1;
	min-width: 0;
}

.wx-time-control {
	flex: none;
	width: 96px;
}

.wx-error :deep(.wx-input) {
	border-color: var(--wx-color-danger);
}
</style>
