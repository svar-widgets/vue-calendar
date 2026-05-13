import SaveToBackend from "./cases/SaveToBackend.vue";
import ICalImportExport from "./cases/ICalImportExport.vue";
import BasicInit from "./cases/BasicInit.vue";
import ContextMenu from "./cases/ContextMenu.vue";
import Styling from "./cases/Styling.vue";
import DayView from "./cases/DayView.vue";
import WeekView from "./cases/WeekView.vue";
import MonthView from "./cases/MonthView.vue";
import Filter from "./cases/Filter.vue";
import CalendarPanel from "./cases/CalendarPanel.vue";
import Toolbar from "./cases/Toolbar.vue";
import Locales from "./cases/Locales.vue";
import EditorComments from "./cases/Editor.vue";
import Tooltip from "./cases/Tooltip.vue";
import EventPopup from "./cases/EventPopup.vue";
import EventContent from "./cases/EventContent.vue";


export const links = [
	{
		group: "",
		items: [
			["/base/:skin", "Basic Calendar", BasicInit, { file: "BasicInit" }],
			["/calendar-panel/:skin", "Calendar Panel", CalendarPanel, { file: "CalendarPanel" }],
		],
	},
	{
		group: "Views",
		items: [
			["/day/:skin", "Day View", DayView, { file: "DayView" }],
			["/week/:skin", "Week View", WeekView, { file: "WeekView" }],
			["/month/:skin", "Month View", MonthView, { file: "MonthView" }],
		],
	},
	{
		group: "Features",
		items: [
			["/filter/:skin", "Filter Events", Filter, { file: "Filter" }],
			["/tooltip/:skin", "Event Tooltip", Tooltip, { file: "Tooltip" }],
			["/event-card/:skin", "Event Preview", EventPopup, { file: "EventPopup" }],
			["/context-menu/:skin", "Context Menu", ContextMenu, { file: "ContextMenu" }],
		],
	},
	{
		group: "Configuration",
		items: [
			["/toolbar/:skin", "Toolbar", Toolbar, { file: "Toolbar" }],
			["/event-content/:skin", "Templates", EventContent, { file: "EventContent" }],
			["/editor-comments/:skin", "Editor", EditorComments, { file: "Editor" }],
			["/styling/:skin", "Styling", Styling, { file: "Styling" }],
			["/locales/:skin", "Locales", Locales, { file: "Locales" }],
		],
	},
	{
		group: "Integration",
		items: [
			["/backend/:skin", "Saving to Backend", SaveToBackend, { file: "SaveToBackend" }],
			["/ical/:skin", "iCal Import/Export", ICalImportExport, { file: "ICalImportExport" }],
		],
	},
];
