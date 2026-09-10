import { DefineComponent } from "vue";
import type { ViewConfig, ToolbarItem } from "@svar-ui/calendar-store";

export type ViewOption = { id: string; label: string };

export type CalendarPoint = { clientX: number; clientY: number };

export type CalendarApi = {
	getState: () => any;
	getReactiveState: () => any;
	exec: (action: string, data: any) => void;
	fmt: (format: string) => (date: Date) => string;
	getEvent: (id: string | number) => any;
};

export type CalendarContextApi = CalendarApi & {
	getBrandmark: () => any;
	isSmall: () => boolean;
};

export type CalendarInstanceApi = CalendarApi & {
	getStores: () => { data: any };
	setNext: (handler: any) => any;
	intercept: (action: string, handler: any) => void;
	on: (action: string, handler: any) => void;
	detach: (action: string, handler?: any) => void;
	getEvents: () => any[];
	getEvent: (id: string | number) => any;
};

export declare const Calendar: DefineComponent<{
	events?: any;
	init?: (api: CalendarInstanceApi) => void;
	readonly?: boolean;
	view?: string;
	views?: (string | ViewConfig)[];
	toolbar?: { buttons?: ToolbarItem[]; css?: string } | null;
	cellCss?: (date: Date, view: string, section: string) => string;
	eventCss?: (event: any, mode: string) => string;
	eventContent?: any;
	date?: Date;
	recurring?: boolean;
	history?: boolean;
	tooltip?: any;
	eventPopup?: any;
	eventProjection?: any;
}>;

export declare const CalendarPanel: DefineComponent<{
	calendars: {
		id: string | number;
		label: string;
		active?: boolean;
		css?: string;
	}[];
	accessor?: string;
	open?: boolean;
	onchange?: (detail: {
		value: (string | number)[];
		filter: ((event: Record<string, any>) => boolean) | null;
	}) => void;
}>;

export declare const ContextMenu: DefineComponent<{
	options?: any[];
	api?: any;
	resolver?: ((event: any, ev: MouseEvent) => any) | null;
	filter?: ((item: any, event: any) => boolean) | null;
	at?: string;
	onclick?: (e: any) => void;
	css?: string;
}>;

export declare const Editor: DefineComponent<{
	api: any;
	items?: any[];
	placement?: "sidebar" | "modal";
	layout?: "columns" | "default";
	focus?: boolean;
	css?: string;
	topBar?: any;
	autoSave?: boolean;
	onchange?: (e: any) => void;
	onsave?: (e: any) => void;
	onaction?: (e: any) => void;
}>;

export declare const Willow: DefineComponent<{
	fonts?: boolean;
}>;

export declare const WillowDark: DefineComponent<{
	fonts?: boolean;
}>;

export declare const version: string;

export declare function getEditorItems(recurring?: boolean): any[];
export declare function getToolbarItems(): ToolbarItem[];
export declare function getMenuOptions(): any[];
export declare function parseICal(text: string): any[];
export declare function serializeICal(events: any[]): string;
export declare class RestDataProvider {
	constructor(url: string, options?: any);
}
export { registerEditorItem } from "@svar-ui/vue-editor";
export {
	WeekViewModel,
	DayViewModel,
	MonthViewModel,
	AgendaViewModel,
	TimelineViewModel,
	ResourcesViewModel,
	YearViewModel,
	registerCalendarView,
	toTimeZone,
	fromTimeZone,
	DynamicLoader,
} from "@svar-ui/calendar-store";
export type {
	ToolbarItem,
	CalendarEvent,
	EditorData,
	CellContext,
	EventContext,
	EventContentMode,
	EventOverflowMode,
	SectionUI,
	CellCss,
	EventCss,
	HistoryState,
} from "@svar-ui/calendar-store";
