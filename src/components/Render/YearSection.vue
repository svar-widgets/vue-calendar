<script setup>
import { ref, computed, inject } from "vue";
import { Popup } from "@svar-ui/vue-core";

const _ = inject("wx-i18n").getGroup("eventCalendar");

const props = defineProps({
	section: {},
	tooltip: { default: undefined },
	eventContent: { default: undefined },
});

const columns = computed(() => props.section.ui?.columns ?? 3);
const weekStartDay = computed(() => props.section.ui?.weekStartDay ?? 1);
const months = computed(() => props.section.ui?.months ?? []);
const weekdayBase = ["S", "M", "T", "W", "T", "F", "S"];
const weekdays = computed(() => {
	const shift = ((weekStartDay.value % 7) + 7) % 7;
	const ordered = [];
	for (let i = 0; i < 7; i++) {
		const dow = (i + shift) % 7;
		ordered.push({
			label: weekdayBase[dow],
			weekend: dow === 0 || dow === 6,
		});
	}
	return ordered;
});

function dateStr(year, month, day) {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDays(month) {
	const days = [];
	for (let i = 0; i < month.startOffset; i++) {
		days.push({
			day: 0,
			empty: true,
			today: false,
			weekend: false,
			hasEvents: false,
			events: [],
		});
	}
	for (let d = 1; d <= month.totalDays; d++) {
		const events = month.markedDays[d] || [];
		const dow = new Date(month.year, month.month, d).getDay();
		days.push({
			day: d,
			empty: false,
			today: month.today === d,
			weekend: dow === 0 || dow === 6,
			hasEvents: events.length > 0,
			events,
		});
	}
	return days;
}

const tooltipData = ref(null);

function showTooltip(e, events) {
	tooltipData.value = {
		element: e.currentTarget,
		events,
	};
}

function hideTooltip() {
	tooltipData.value = null;
}

function formatTime(date) {
	return date.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatRange(event) {
	const { start, end } = event;
	if (
		event.allDay ||
		start.getFullYear() !== end.getFullYear() ||
		start.getMonth() !== end.getMonth() ||
		start.getDate() !== end.getDate()
	) {
		return _("Full day");
	}
	return `${formatTime(start)} \u2013 ${formatTime(end)}`;
}

function eventTitle(event) {
	return event.text || "";
}
</script>

<template>
	<div class="wx-year-grid" :style="'--wx-year-columns: ' + columns">
		<div v-for="month in months" :key="month.month" class="wx-year-month">
			<div class="wx-month-label">{{ month.label }}</div>
			<div class="wx-month-grid">
				<div
					v-for="(wd, wdIdx) in weekdays"
					:key="wdIdx"
					:class="['wx-weekday-header', { 'wx-weekend': wd.weekend }]"
				>
					{{ wd.label }}
				</div>
				<template v-for="(day, dayIdx) in getDays(month)" :key="dayIdx">
					<div v-if="day.empty" class="wx-month-day wx-empty"></div>
					<div
						v-else
						:class="[
							'wx-month-day',
							{
								'wx-today': day.today,
								'wx-weekend': day.weekend,
								'wx-has-events': day.hasEvents,
							},
						]"
						:data-date="dateStr(month.year, month.month, day.day)"
						:aria-current="day.today ? 'date' : undefined"
						@mouseenter="
							day.hasEvents ? showTooltip($event, day.events) : undefined
						"
						@mouseleave="day.hasEvents ? hideTooltip() : undefined"
					>
						<span class="wx-day-num">{{ day.day }}</span>
						<span
							v-if="day.hasEvents"
							class="wx-event-dot"
							aria-hidden="true"
						></span>
					</div>
				</template>
			</div>
		</div>
	</div>

	<Popup
		v-if="tooltipData"
		:parent="tooltipData.element"
		at="bottom-start"
		:oncancel="hideTooltip"
	>
		<div :class="['wx-year-tooltip', { 'wx-year-tooltip-custom': !!tooltip }]">
			<component v-if="tooltip" :is="tooltip" :events="tooltipData.events" />
			<template v-else>
				<div
					v-for="(ev, evIdx) in tooltipData.events"
					:key="evIdx"
					class="wx-tooltip-event"
				>
					<template v-if="eventContent">
						<div class="wx-tooltip-event-content">
							<component :is="eventContent" :event="ev" mode="year-tooltip" />
						</div>
					</template>
					<template v-else>
						<span class="wx-tooltip-time">
							{{ formatRange(ev) }}
						</span>
						<span class="wx-tooltip-title">{{ eventTitle(ev) }}</span>
					</template>
				</div>
			</template>
		</div>
	</Popup>
</template>

<style scoped>
.wx-year-grid {
	display: grid;
	grid-template-columns: repeat(var(--wx-year-columns, 3), 1fr);
	gap: 16px;
	padding: 16px;
	position: relative;
}
.wx-calendar--compact .wx-year-grid {
	display: flex;
	flex-direction: column;
}
.wx-month-label {
	font-weight: var(--wx-font-weight-md);
	margin-bottom: 4px;
	padding-left: 20px;
}
.wx-month-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 1px;
}
.wx-weekday-header {
	text-align: center;
	font-size: 10px;
	color: var(--wx-color-font-alt);
	padding: 2px 0;
}
.wx-month-day {
	text-align: center;
	padding: 2px;
	position: relative;
	min-height: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: default;
	color: var(--wx-color-font-alt);
}
.wx-month-day.wx-weekend,
.wx-weekday-header.wx-weekend {
	background-color: var(--wx-calendar-weekend-background);
}
.wx-month-day.wx-has-events {
	cursor: pointer;
	color: var(--wx-color-font);
}
.wx-day-num {
	font-size: 13px;
}
.wx-month-day.wx-today .wx-day-num {
	background: var(--wx-color-primary);
	color: var(--wx-color-primary-font);
	border-radius: 50%;
	width: 20px;
	height: 20px;
	line-height: 20px;
	display: inline-block;
}
.wx-event-dot {
	display: block;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: var(--wx-color-primary);
	margin-top: 1px;
}
.wx-year-tooltip {
	background: var(--wx-background);
	border: var(--wx-border);
	border-radius: var(--wx-border-radius);
	padding: 8px 12px;
	box-shadow: var(--wx-shadow-light);
	min-width: 150px;
	max-width: 300px;
}
.wx-year-tooltip-custom {
	padding: 0;
	border: none;
	background: none;
	box-shadow: none;
	min-width: 0;
	max-width: none;
}
.wx-tooltip-event {
	display: flex;
	align-items: center;
	padding: 2px 0;
	font-size: var(--wx-font-size-sm);
}
.wx-tooltip-event + .wx-tooltip-event {
	border-top: var(--wx-border);
	padding-top: 4px;
	margin-top: 2px;
}
.wx-tooltip-time {
	flex-shrink: 0;
	color: var(--wx-color-font-alt);
	margin-right: 8px;
}
.wx-tooltip-title {
	color: var(--wx-color-font);
}
.wx-tooltip-event-content {
	flex: 1;
	min-width: 0;
}
</style>
