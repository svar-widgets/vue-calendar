<script setup>
import { inject, computed } from 'vue';
import { setID } from '@svar-ui/lib-dom';

const props = defineProps({
	primitives: {},
	eventContent: {},
});

const api = inject('calendar-api');
const _ = inject('wx-i18n').getGroup('eventCalendar');
const fmtDate = api.fmt('agendaDayFormat');
const fmtTime = api.fmt('timeScaleFormat');

function formatRange(event) {
	const { start, end } = event;
	if (
		event.allDay ||
		start.getFullYear() !== end.getFullYear() ||
		start.getMonth() !== end.getMonth() ||
		start.getDate() !== end.getDate()
	) {
		return _('Full day');
	}
	return `${fmtTime(start)} – ${fmtTime(end)}`;
}

const groups = computed(() => {
	const map = new Map();
	for (const p of props.primitives) {
		const d = p.event.start;
		const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
		let group = map.get(key);
		if (!group) {
			const date = new Date(
				d.getFullYear(),
				d.getMonth(),
				d.getDate()
			);
			group = {
				date,
				label: fmtDate(date),
				events: [],
			};
			map.set(key, group);
		}
		group.events.push(p);
	}
	return Array.from(map.values());
});
</script>

<template>
	<div class="wx-list-section">
		<div
			v-for="group in groups"
			:key="group.date.getTime()"
			class="wx-list-day"
		>
			<div class="wx-list-date">{{ group.label }}</div>
			<div class="wx-list-events">
				<div
					v-for="p in group.events"
					:key="p.id"
					class="wx-list-event"
					:data-id="setID(p.id)"
				>
					<template v-if="eventContent">
						<div class="wx-list-event-content">
							<component
								:is="eventContent"
								:event="p.event"
								mode="list"
							/>
						</div>
					</template>
					<template v-else>
						<span class="wx-event-time">
							{{ formatRange(p.event) }}
						</span>
						<span class="wx-event-title">
							{{ p.event.text || "" }}
						</span>
					</template>
				</div>
			</div>
		</div>
		<div v-if="groups.length === 0" class="wx-list-empty" role="status">
			No events this month
		</div>
	</div>
</template>

<style scoped>
.wx-list-section {
	padding: 8px 0;
}
.wx-list-day {
	margin-bottom: 4px;
}
.wx-list-date {
	padding: 8px 16px;
	font-weight: var(--wx-font-weight-md);
	border-bottom: var(--wx-border);
	background: var(--wx-background-alt);
}
.wx-list-event {
	display: flex;
	align-items: center;
	padding: 8px 16px 8px 32px;
	border-bottom: var(--wx-border);
	cursor: pointer;
}
.wx-list-event:hover {
	background-color: var(--wx-background-hover);
}
.wx-event-time {
	flex-shrink: 0;
	width: 130px;
	font-size: 13px;
	color: var(--wx-color-font-alt);
}
.wx-event-title {
	font-size: var(--wx-font-size);
}
.wx-list-event-content {
	flex: 1;
	min-width: 0;
}
.wx-list-empty {
	padding: 32px 16px;
	text-align: center;
	color: var(--wx-color-font-alt);
}
</style>
