import type { EventBus } from "@svar-ui/lib-state";
import type {
	Brandmark,
	CalendarStore,
	FormatFactory,
	StoreActions,
} from "@svar-ui/calendar-store";

export type ViewOption = { id: string; label: string };

export type CalendarPoint = { clientX: number; clientY: number };
type CalendarEventBus = EventBus<StoreActions, keyof StoreActions>;

type CalendarApi = {
	getState: CalendarStore["getState"];
	getReactiveState: CalendarStore["getReactive"];
	exec: CalendarEventBus["exec"];
	fmt: FormatFactory;
	getEvent: CalendarStore["getEvent"];
};

export type CalendarContextApi = CalendarApi & {
	getBrandmark: () => Brandmark | null;
	isSmall: () => boolean;
};

export type CalendarInstanceApi = CalendarApi & {
	getStores: () => { data: CalendarStore };
	setNext: (handler: any) => any;
	intercept: CalendarEventBus["intercept"];
	on: CalendarEventBus["on"];
	detach: CalendarEventBus["detach"];
	getEvents: CalendarStore["getEvents"];
	getEvent: CalendarStore["getEvent"];
};
