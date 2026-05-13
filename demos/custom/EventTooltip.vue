<script setup>
const props = defineProps({
	event: {},
	events: { type: Array },
});

function formatTime(d) {
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
	<div class="event-tooltip">
		<template v-if="event">
			<div class="tooltip-title">{{ event.text || "" }}</div>
			<div class="tooltip-time">
				{{ formatTime(event.start) }} – {{ formatTime(event.end) }}
			</div>
			<div v-if="event.text && event.text !== 'Event'" class="tooltip-id">ID: {{ event.id }}</div>
		</template>
		<template v-else-if="events">
			<div class="tooltip-header">{{ events.length }} event{{ events.length !== 1 ? "s" : "" }}</div>
			<div v-for="(ev, index) in events" :key="index" class="tooltip-row">
				<span class="tooltip-dot"></span>
				<span class="tooltip-row-time">{{ formatTime(ev.start) }}</span>
				<span class="tooltip-row-title">{{ ev.title }}</span>
			</div>
		</template>
	</div>
</template>

<style scoped>
.event-tooltip {
	background: #1e293b;
	color: #f1f5f9;
	border-radius: 6px;
	padding: 8px 12px;
	font-size: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	min-width: 140px;
	max-width: 260px;
}
.tooltip-title {
	font-weight: 600;
	margin-bottom: 2px;
}
.tooltip-time {
	color: #94a3b8;
	font-size: 12px;
}
.tooltip-id {
	color: #64748b;
	font-size: 10px;
	margin-top: 4px;
}
.tooltip-header {
	font-weight: 600;
	margin-bottom: 4px;
	padding-bottom: 4px;
	border-bottom: 1px solid #334155;
}
.tooltip-row {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 2px 0;
}
.tooltip-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #60a5fa;
	flex-shrink: 0;
}
.tooltip-row-time {
	color: #94a3b8;
	flex-shrink: 0;
	font-size: 12px;
}
.tooltip-row-title {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
