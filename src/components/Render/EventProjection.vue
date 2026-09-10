<script setup>
defineOptions({ name: "CalendarComponentsRenderEventProjection" });

const props = defineProps({
	primitives: {},
	dx: {},
	dy: {},
});

const gap = 2;

function style(primitive) {
	const left = primitive.x * props.dx + gap;
	const top = primitive.y * props.dy + gap;
	const width = Math.max(2, primitive.width * props.dx - gap * 2);
	const height = Math.max(2, primitive.height * props.dy - gap * 2);
	return `left:${left}px;top:${top}px;width:${width}px;height:${height}px`;
}
</script>

<template>
	<div class="wx-event-placeholders" aria-hidden="true">
		<div
			v-for="primitive in primitives"
			:key="primitive.id"
			class="wx-event-placeholder"
			:style="style(primitive)"
		></div>
	</div>
</template>

<style scoped>
.wx-event-placeholders {
	position: absolute;
	inset: 0;
	z-index: 5;
	pointer-events: none;
}

.wx-event-placeholder {
	position: absolute;
	box-sizing: border-box;
	min-width: 2px;
	min-height: 2px;
	border: 2px solid var(--wx-color-primary);
	border-radius: var(--wx-border-radius);
	background: color-mix(
		in srgb,
		var(--wx-color-primary) 20%,
		var(--wx-background) 30%,
		transparent
	);
}
</style>
