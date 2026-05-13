import type { EventID, ViewModel, CalendarEvent } from "@svar-ui/calendar-store";

export interface ResizeOptions {
	dx: number;
	dy: number;
	sectionName: string;
	model: ViewModel;
	exec: (action: string, data: any) => void;
	getEvent: (id: EventID) => CalendarEvent | undefined;
}

const DRAG_THRESHOLD = 3;

export function startResize(
	node: HTMLElement,
	dragEl: HTMLElement,
	e: MouseEvent,
	eventId: EventID,
	opts: ResizeOptions
): void {
	const origStyle = dragEl.style.cssText;
	const origTop = parseFloat(dragEl.style.top) || 0;
	const startClientY = e.clientY;
	let active = false;

	e.preventDefault();
	e.stopPropagation();

	dragEl.style.zIndex = "100";
	dragEl.style.transition = "none";
	document.body.style.userSelect = "none";
	document.body.style.cursor = "s-resize";

	function handleMouseMove(ev: MouseEvent) {
		if (!active) {
			if (Math.abs(ev.clientY - startClientY) < DRAG_THRESHOLD) return;
			active = true;
			dragEl.classList.add("wx-resizing");
		}

		const containerRect = node.getBoundingClientRect();
		const cursorY = ev.clientY - containerRect.top + node.scrollTop;
		const newHeight = Math.max(10, cursorY - origTop);
		dragEl.style.height = newHeight + "px";
	}

	function handleMouseUp() {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);

		if (!active) {
			reset();
			return;
		}

		const finalBottom =
			origTop + (parseFloat(dragEl.style.height) || dragEl.offsetHeight);

		const original = opts.getEvent(eventId);
		if (original) {
			// x100: center of the element's column
			const finalLeft = parseFloat(dragEl.style.left) || 0;
			const x100 =
				opts.dx > 0 ? (finalLeft + dragEl.offsetWidth / 2) / opts.dx : 0;
			const endY100 = opts.dy > 0 ? finalBottom / opts.dy : 0;

			const endPartial = opts.model.toPositionEnd(
				opts.sectionName,
				x100,
				endY100,
				{ end: original.end },
				true
			);

			if (endPartial.end instanceof Date) {
				const payload: Record<string, any> = {
					id: original.id,
					event: { end: endPartial.end },
				};
				opts.exec("update-event", payload);
			}
		}

		reset();
	}

	function reset() {
		dragEl.style.cssText = origStyle;
		dragEl.classList.remove("wx-resizing");
		document.body.style.userSelect = "";
		document.body.style.cursor = "";
	}

	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);
}
