<script setup>
import { DatePicker, TimePicker } from "@svar-ui/vue-core";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  value: {},
  id: {},
  time: {},
  onchange: { type: Function },
});
</script>

<template>
  <div class="wx-event-calendar-date_field">
    <div class="wx-event-calendar-input_wrapper">
      <DatePicker
        :id="props.id"
        :value="props.value"
        :onchange="props.onchange"
        v-bind="$attrs"
        :buttons="false"
      />
    </div>
    <TimePicker
      v-if="props.time"
      :id="props.id"
      :value="props.value"
      :onchange="props.onchange"
    />
  </div>
</template>

<style scoped>
.wx-event-calendar-date_field {
  display: flex;
}
.wx-event-calendar-date_field .wx-event-calendar-input_wrapper {
  flex-grow: 2;
}
.wx-event-calendar-date_field :deep(.timepicker) {
  width: unset !important;
}
.wx-event-calendar-input_wrapper {
  margin-right: 10px;
}
:global(.wx-event-calendar-editor-controls > .btn:not(:last-child)) {
  margin-right: 5px;
}
</style>
