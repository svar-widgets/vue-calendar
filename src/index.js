import pkg from "../package.json";
const version = pkg.version;

import Calendar from "./components/Calendar.vue";
import CalendarPanel from "./components/CalendarPanel.vue";
import ContextMenu from "./components/ContextMenu.vue";
import Editor from "./components/Editor.vue";

import Willow from "./themes/Willow.vue";
import WillowDark from "./themes/WillowDark.vue";

export {
	getToolbarItems,
	getMenuOptions,
	registerCalendarView,
	WeekViewModel,
	DayViewModel,
	MonthViewModel,
} from "@svar-ui/calendar-store";

export { getEditorItems } from "./components/editorItems.js";
export { registerEditorItem } from "@svar-ui/vue-editor";
export { parseICal, serializeICal } from "@svar-ui/calendar-ical";
export { RestDataProvider } from "@svar-ui/calendar-provider";

export {
	Calendar,
	CalendarPanel,
	ContextMenu,
	Editor,
	Willow,
	WillowDark,
	version,
};
