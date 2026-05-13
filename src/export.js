import { createApp, h } from "vue";
import Calendar from "./components/Calendar.vue";
import Willow from "./themes/Willow.vue";

function init(target, config, skin) {
	const Skin = skin || Willow;
	const app = createApp({
		render() {
			return h(Skin, null, () => h(Calendar, config));
		},
	});
	app.mount(target ? document.querySelector(target) : document.body);
}

export { init };
