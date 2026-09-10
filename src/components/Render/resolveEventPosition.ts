import type {
	CalendarEvent,
	SectionResult,
	ViewModel,
} from "@svar-ui/calendar-store";
import type { CalendarPoint } from "../../types.js";

export function resolveEventPosition(
	point: CalendarPoint,
	event: Partial<CalendarEvent>,
	section: SectionResult,
	element: HTMLElement,
	dx: number,
	dy: number,
	model: ViewModel,
	doc: { elementFromPoint: (x: number, y: number) => Element | null },
): Partial<CalendarEvent> | null {
	const hit = doc.elementFromPoint(point.clientX, point.clientY);
	if (!element.contains(hit)) return null;

	if (
		section.mode === "list" ||
		section.mode === "year" ||
		dx <= 0 ||
		dy <= 0
	) {
		return null;
	}

	const rect = element.getBoundingClientRect();
	if (
		point.clientX < rect.left ||
		point.clientX > rect.right ||
		point.clientY < rect.top ||
		point.clientY > rect.bottom
	) {
		return null;
	}

	const x = Math.max(
		0,
		Math.min(99.999, (point.clientX - rect.left + element.scrollLeft) / dx),
	);
	const y = Math.max(
		0,
		Math.min(99.999, (point.clientY - rect.top + element.scrollTop) / dy),
	);
	const duration =
		typeof event.duration === "number" && event.duration > 0
			? event.duration
			: event.start instanceof Date && event.end instanceof Date
				? event.end.getTime() - event.start.getTime()
				: 0;
	const positioned = model.toPositionStart(section.name, x, y, event, true);
	if (!(positioned.start instanceof Date)) return null;
	if (duration > 0) {
		positioned.end = new Date(positioned.start.getTime() + duration);
	} else {
		delete positioned.end;
	}
	return positioned;
}
