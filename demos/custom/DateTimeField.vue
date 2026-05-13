<script setup>
import { DatePicker, TimePicker } from "@svar-ui/vue-core";

const props = defineProps({
	value: {},
	id: {},
	onchange: { type: Function },
});
</script>

<template>
	<div class="wx-date-time-field">
		<div class="date">
			<DatePicker
				:id="props.id"
				:value="props.value"
				:onchange="props.onchange"
				:buttons="false"
			/>
		</div>
		<TimePicker
			:id="props.id"
			:value="props.value"
			:onchange="props.onchange"
		/>
	</div>
</template>

<style scoped>
.wx-date-time-field {
	display: flex;
	gap: 8px;
}
.wx-date-time-field .date {
	flex: 1 1 auto;
}
.wx-date-time-field :deep(.timepicker) {
	width: unset !important;
}
</style>
