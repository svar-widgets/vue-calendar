import type { EventBus } from "@svar-ui/lib-state";
import type {
	Brandmark,
	CalendarStore,
	FormatFactory,
	StoreActions,
} from "@svar-ui/calendar-store";

export type ViewOption = { id: string; label: string };

type CalendarEventBus = EventBus<StoreActions, keyof StoreActions>;

export type CalendarApi = {
	getState: CalendarStore["getState"];
	getReactiveState: CalendarStore["getReactive"];
	getBrandmark: () => Brandmark | null;
	exec: CalendarEventBus["exec"];
	fmt: FormatFactory;
	getEvent: CalendarStore["getEvent"];
};

export type CalendarContextApi = CalendarApi;

export type CalendarInstanceApi = CalendarApi & {
	getStores: () => { data: CalendarStore };
	setNext: (handler: any) => any;
	intercept: CalendarEventBus["intercept"];
	on: CalendarEventBus["on"];
	detach: CalendarEventBus["detach"];
	getEvents: CalendarStore["getEvents"];
	getEvent: CalendarStore["getEvent"];
};
