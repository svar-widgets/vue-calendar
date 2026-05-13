<script setup>
import { WillowDark } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
    <WillowDark v-if="$slots.default" :fonts="props.fonts">
        <slot />
    </WillowDark>
    <WillowDark v-else :fonts="props.fonts" />
</template>

<style>
.wx-willow-dark-theme {
    --wx-calendar-grid-color: #384047;
    --wx-calendar-weekend-background: #201d25;
}
</style>
