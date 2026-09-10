import { getID, locate } from "@svar-ui/lib-dom";
import type { CalendarEvent } from "@svar-ui/calendar-store";

export interface EventPopupInfo {
	eventId: string | number;
	rawId: string | number;
	element: HTMLElement;
}

export interface ClickEventOptions {
	exec: (action: string, data: any) => void;
	onEventPopup?: ((info: EventPopupInfo | null) => void) | null;
	getEvent: (id: string | number) => CalendarEvent;
}

const CLICK_THRESHOLD = 3;

export function clickevent(node: HTMLElement, options: ClickEventOptions) {
	let opts = options;
	let startX = 0;
	let startY = 0;
	let target: HTMLElement | null = null;

	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		startX = e.clientX;
		startY = e.clientY;
		target = e.target as HTMLElement;
	}

	function cancel() {
		opts.onEventPopup?.(null);
	}
	function handleMouseUp(e: MouseEvent) {
		if (!target) return;

		const dx = Math.abs(e.clientX - startX);
		const dy = Math.abs(e.clientY - startY);
		if (dx > CLICK_THRESHOLD || dy > CLICK_THRESHOLD) {
			target = null;
			return;
		}

		const node = locate(target);
		target = null;
		if (!node) return cancel();

		const rawId = getID(node);
		const event = opts.getEvent(rawId);
		if (!event) return cancel();

		if (opts.onEventPopup) {
			opts.onEventPopup({
				eventId: event.id,
				rawId,
				element: node,
			});
		} else {
			opts.exec("select-event", { id: event.id, rawId });
		}
	}

	node.addEventListener("mousedown", handleMouseDown);
	node.addEventListener("mouseup", handleMouseUp);

	return {
		update(newOpts: ClickEventOptions) {
			opts = newOpts;
		},
		destroy() {
			node.removeEventListener("mousedown", handleMouseDown);
			node.removeEventListener("mouseup", handleMouseUp);
		},
	};
}
