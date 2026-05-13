<script setup>
defineOptions({ inheritAttrs: false });

import { inject } from "vue";
import { Button } from "@svar-ui/vue-core";

const store = inject("calendar-api");

function menuClick() {
	store.exec("action", { id: "menu-button" });
}
</script>

<template>
	<Button icon="wxi-menu" :onclick="menuClick" />
</template>
