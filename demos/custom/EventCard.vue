<script setup>
import { inject } from "vue";

const props = defineProps({
	event: {},
	close: { type: Function },
});

const resources = inject("resources");

function formatDateTime(d) {
	return (
		d.toLocaleDateString([], {
			weekday: "short",
			month: "short",
			day: "numeric",
		}) +
		" " +
		d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	);
}

function handleAction(action) {
	alert(`Action: ${action} for "${props.event.text || props.event.title}"`);
	props.close();
}
</script>

<template>
	<div class="event-card">
		<div class="card-header">
			<div class="card-title">
				{{ event.text || event.title || "Event" }}
			</div>
		</div>
		<div class="card-body">
			<div class="card-row">
				<span class="card-label">Start</span>
				<span class="card-value">{{
					formatDateTime(event.start)
				}}</span>
			</div>
			<div class="card-row">
				<span class="card-label">End</span>
				<span class="card-value">{{
					formatDateTime(event.end)
				}}</span>
			</div>
			<div v-if="resources && event.unit_id" class="card-row">
				<span class="card-label">Assignee</span>
				<span class="card-value">{{
					resources.find((r) => r.id === event.unit_id)?.label ||
					event.unit_id
				}}</span>
			</div>
		</div>
		<div class="card-actions">
			<button
				class="btn btn-primary"
				@click="() => handleAction('view')"
			>
				View Details
			</button>
			<button
				class="btn btn-secondary"
				@click="() => handleAction('share')"
			>
				Share
			</button>
		</div>
	</div>
</template>

<style scoped>
.event-card {
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	border: 1px solid #e2e8f0;
	width: 280px;
	font-size: 13px;
}
.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid #e2e8f0;
}
.card-title {
	font-weight: 600;
	font-size: 15px;
	color: #1e293b;
}
.card-body {
	padding: 12px 16px;
}
.card-row {
	display: flex;
	justify-content: space-between;
	padding: 4px 0;
}
.card-label {
	color: #64748b;
	font-size: 12px;
}
.card-value {
	color: #1e293b;
	font-size: 12px;
}
.card-actions {
	display: flex;
	gap: 8px;
	padding: 12px 16px;
	border-top: 1px solid #e2e8f0;
}
.btn {
	flex: 1;
	padding: 6px 12px;
	border-radius: 6px;
	border: none;
	cursor: pointer;
	font-size: 12px;
	font-weight: 500;
}
.btn-primary {
	background: #3b82f6;
	color: white;
}
.btn-primary:hover {
	background: #2563eb;
}
.btn-secondary {
	background: #f1f5f9;
	color: #475569;
	border: 1px solid #e2e8f0;
}
.btn-secondary:hover {
	background: #e2e8f0;
}
</style>
