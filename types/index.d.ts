import { DefineComponent } from "vue";
import type { ViewConfig, ToolbarItem } from "@svar-ui/calendar-store";

export type ViewOption = { id: string; label: string };

export type CalendarApi = {
	getState: () => any;
	getReactiveState: () => any;
	getBrandmark: () => any;
	exec: (action: string, data: any) => void;
	fmt: (format: string) => (date: Date) => string;
	getEvent: (id: string | number) => any;
};

export type CalendarContextApi = CalendarApi;

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
	cellClass?: (date: Date, view: string, section: string) => string;
	eventClass?: (event: any, mode: string) => string;
	eventContent?: any;
	date?: Date;
	recurring?: boolean;
	tooltip?: any;
	eventPopup?: any;
}>;

export declare const CalendarPanel: DefineComponent<{
	calendars: { id: string | number; label: string; active?: boolean; css?: string }[];
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
}>;

export declare const Willow: DefineComponent<{
	fonts?: boolean;
}>;

export declare const WillowDark: DefineComponent<{
	fonts?: boolean;
}>;

export declare const version: string;

export declare function getEditorItems(): any[];
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
} from "@svar-ui/calendar-store";
export type {
	ToolbarItem,
	CalendarEvent,
	CellContext,
	EventContext,
	EventContentMode,
	CellCss,
	EventCss,
} from "@svar-ui/calendar-store";
