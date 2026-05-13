<script setup>
defineOptions({ name: "ThemesWillow" });

import { Willow } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
    <Willow v-if="$slots.default" :fonts="props.fonts">
		<slot />
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style scoped>
:global(.wx-willow-theme) {
	--wx-calendar-grid-color: #e6e6e6;
	--wx-calendar-weekend-background: #fbf9ff;
}
</style>
