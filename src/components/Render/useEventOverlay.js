import { ref } from "vue";
import { getID, locate } from "@svar-ui/lib-dom";

export function useEventOverlay(getEvent, getEventPopupAt) {
	let _tooltipTarget = null;
	const tooltipState = ref(null);
	const mousePos = ref({ x: 0, y: 0 });
	const eventPopupState = ref(null);

	function handleTooltipMove(e) {
		mousePos.value = { x: e.clientX, y: e.clientY };
		if (eventPopupState.value || !e.target) return;
		const el = locate(e.target) ?? null;
		if (el === _tooltipTarget) return;
		_tooltipTarget = el;
		if (!el) {
			tooltipState.value = null;
			return;
		}
		const ev = getEvent(getID(el));
		tooltipState.value = ev ? { event: ev } : null;
	}

	function handleTooltipLeave() {
		_tooltipTarget = null;
		tooltipState.value = null;
	}

	function handleEventPopup(info) {
		tooltipState.value = null;
		_tooltipTarget = null;
		if (!info) {
			eventPopupState.value = null;
			return;
		}
		const ev = getEvent(info.eventId);
		if (ev) {
			eventPopupState.value = {
				event: ev,
				element: info.element,
				at: getEventPopupAt(info.element),
			};
		}
	}

	function hideEventPopup() {
		eventPopupState.value = null;
	}

	return {
		tooltipState,
		mousePos,
		eventPopupState,
		handleTooltipMove,
		handleTooltipLeave,
		handleEventPopup,
		hideEventPopup,
	};
}
