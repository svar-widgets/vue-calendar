<script setup>
import { ref } from "vue";
import { getData } from "../data.js";
import { Calendar, Editor } from "../../src/";

const { data, date } = getData();

// tasks available to drag into the calendar (no dates - resolved on drop)
const tasks = [
	{ id: "t1", text: "Design review", duration: 60 * 60000 },
	{ id: "t2", text: "Quick sync", duration: 30 * 60000 },
	{ id: "t3", text: "Workshop", duration: 18 * 60000 },
	{ id: "t4", text: "Conference day", duration: 1440 * 60000 },
];

const api = ref(null);
const eventProjection = ref(null);

function onTaskDragStart(_ev, task) {
	console.log("onTaskDragStart", task);
	eventProjection.value = { htmlEvent: null, event: { ...task, id: null } };
}

function onTaskDragEnd() {
	eventProjection.value = null;
}

function onTaskDrag(ev) {
	eventProjection.value = { ...eventProjection.value, htmlEvent: ev };
	ev.preventDefault();
}

function onTaskDrop(ev) {
	const projection = eventProjection.value;
	if (!api.value || !projection?.event.start || !projection.event.end) return;
	ev.preventDefault();
	void api.value.exec("add-event", {
		event: { ...projection.event, duration: null },
	});
	eventProjection.value = null;
}

function formatDuration(minutes) {
	if (minutes >= 1440) return `${minutes / 1440} day`;
	if (minutes >= 60) return `${minutes / 60} h`;
	return `${minutes} min`;
}
</script>

<template>
	<div class="demo">
		<div class="tasks">
			<h4>Tasks</h4>
			<p class="hint">
				Drag a task onto the calendar — it previews as an event box and is
				created on drop.
			</p>
			<div
				v-for="task in tasks"
				:key="task.id"
				class="task"
				draggable="true"
				role="listitem"
				@dragstart="(ev) => onTaskDragStart(ev, task)"
				@dragend="onTaskDragEnd"
			>
				<div class="task-title">{{ task.text }}</div>
				<div class="task-duration">
					{{ formatDuration(task.duration / 60000) }}
				</div>
			</div>
		</div>

		<div
			class="calendar-box"
			role="group"
			aria-label="Calendar drop area"
			@dragover="onTaskDrag"
			@drop="onTaskDrop"
		>
			<Calendar
				ref="api"
				:events="data"
				:date="date"
				view="day"
				:views="['day', 'month']"
				:event-projection="eventProjection"
			/>
			<Editor v-if="api" :api="api" />
		</div>
	</div>
</template>

<style scoped>
.demo {
	display: flex;
	gap: 20px;
	padding: 20px;
	height: 100%;
	box-sizing: border-box;
}
.tasks {
	width: 220px;
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	gap: 10px;
	overflow: auto;
}
.tasks h4 {
	margin: 0;
}
.hint {
	margin: 0 0 4px;
	font-size: 13px;
	color: var(--wx-color-font-alt);
}
.task {
	border: var(--wx-border);
	border-radius: 6px;
	padding: 10px 12px;
	background: var(--wx-background);
	color: var(--wx-color-font);
	cursor: grab;
	box-shadow: var(--wx-shadow-light);
	user-select: none;
}
.task:active {
	cursor: grabbing;
}
.task-title {
	font-weight: 600;
}
.task-duration {
	font-size: 12px;
	color: var(--wx-color-font-alt);
	margin-top: 2px;
}
.calendar-box {
	flex: 1 1 auto;
	min-width: 0;
}
</style>
