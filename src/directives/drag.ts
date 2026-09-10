import type {
	CalendarEvent,
	EventID,
	ScaleUnit,
	SectionMode,
	ViewModel,
} from "@svar-ui/calendar-store";
import { decodeId } from "@svar-ui/calendar-store";
import { startResize } from "./dragresize.js";
import { getID } from "@svar-ui/lib-dom";

export interface DragOptions {
	mode: SectionMode;
	dx: number;
	dy: number;
	xHeaders: ScaleUnit[][] | null;
	yHeaders: ScaleUnit[][] | null;
	sectionName: string;
	model: ViewModel;
	exec: (action: string, data: any) => void;
	// move
	move: boolean;
	getEvent: (id: EventID) => CalendarEvent | undefined;
	clipDrag: boolean;
	// create
	create: boolean;
}

const MOVE_THRESHOLD = 3;
const CREATE_THRESHOLD = 5;

export function drag(node: HTMLElement, options: DragOptions) {
	let opts = options;

	// ---- shared ----
	function findContainingUnit(pos100: number, units: ScaleUnit[]): number {
		for (let i = units.length - 1; i >= 0; i--) {
			if (pos100 >= units[i].position - 0.001) return i;
		}
		return 0;
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	// ---- move state ----
	let moveEl: HTMLElement | null = null;
	let moveOrigStyle = "";
	let movePending = false;
	let moveActive = false;
	let moveStartX = 0;
	let moveStartY = 0;
	let offsetX = 0;
	let offsetY = 0;
	let origLeft = 0;
	let origTop = 0;
	let offsetInUnitX = 0;
	let offsetInUnitY = 0;
	let moveXUnits: ScaleUnit[] = [];
	let moveYUnits: ScaleUnit[] = [];
	let grabXIdx = 0;
	let grabYIdx = 0;

	// ---- create state ----
	let createPending = false;
	let createActive = false;
	let stub: HTMLElement | null = null;
	let createStartX = 0;
	let createStartY = 0;
	let createXUnits: ScaleUnit[] = [];
	let createYUnits: ScaleUnit[] = [];
	let anchorXIdx = 0;
	let anchorYIdx = 0;
	let anchorX = 0;
	let anchorY = 0;
	let anchorXIdx2 = 0;
	let anchorYIdx2 = 0;

	// ---- mousedown router ----

	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		const target = e.target as HTMLElement;
		const eventEl = target.closest("[data-id]") as HTMLElement | null;

		if (eventEl && opts.move) {
			startMove(e, eventEl);
		} else if (!eventEl && opts.create) {
			startCreate(e);
		}
	}

	// ---- move ----

	function startMove(e: MouseEvent, el: HTMLElement) {
		e.preventDefault();
		e.stopPropagation();

		moveEl = el;
		moveOrigStyle = el.style.cssText;
		movePending = true;
		moveActive = false;
		moveStartX = e.clientX;
		moveStartY = e.clientY;

		origLeft = parseFloat(moveEl.style.left) || 0;
		origTop = parseFloat(moveEl.style.top) || 0;

		const elRect = moveEl.getBoundingClientRect();
		offsetX = e.clientX - elRect.left;
		offsetY = e.clientY - elRect.top;

		if (
			opts.mode === "boxes" &&
			elRect.height > 40 &&
			offsetY > elRect.height - 20
		) {
			const id = getID(moveEl);
			moveEl = null;
			movePending = false;
			if (id == null) return;
			startResize(node, el, e, id, {
				dx: opts.dx,
				dy: opts.dy,
				sectionName: opts.sectionName,
				model: opts.model,
				exec: opts.exec,
				getEvent: opts.getEvent,
			});
			return;
		}

		moveXUnits = opts.xHeaders?.[opts.xHeaders.length - 1] ?? [];
		moveYUnits = opts.yHeaders?.[opts.yHeaders.length - 1] ?? [];

		if (
			moveXUnits.length > 0 &&
			opts.dx > 0 &&
			(opts.mode === "boxes" || opts.mode === "grid")
		) {
			const posIn100 = origLeft / opts.dx;
			const idx = findContainingUnit(posIn100, moveXUnits);
			offsetInUnitX = origLeft - moveXUnits[idx].position * opts.dx;
		}
		if (
			moveYUnits.length > 0 &&
			opts.dy > 0 &&
			(opts.mode === "bars" || opts.mode === "grid")
		) {
			const posIn100 = origTop / opts.dy;
			const idx = findContainingUnit(posIn100, moveYUnits);
			offsetInUnitY = origTop - moveYUnits[idx].position * opts.dy;
		}

		if (
			opts.mode === "grid" &&
			moveXUnits.length > 0 &&
			moveYUnits.length > 0 &&
			opts.dx > 0 &&
			opts.dy > 0
		) {
			const containerRect = node.getBoundingClientRect();
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const mouseY100 =
				(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
			grabXIdx = findContainingUnit(mouseX100, moveXUnits);
			grabYIdx = findContainingUnit(mouseY100, moveYUnits);
		}

		document.addEventListener("mousemove", handleMoveMouseMove);
		document.addEventListener("mouseup", handleMoveMouseUp);
	}

	function handleMoveMouseMove(e: MouseEvent) {
		if (!moveEl || !moveEl.isConnected) {
			cancelMove();
			return;
		}

		if (movePending) {
			const dx = Math.abs(e.clientX - moveStartX);
			const dy = Math.abs(e.clientY - moveStartY);
			if (dx < MOVE_THRESHOLD && dy < MOVE_THRESHOLD) return;
			movePending = false;
			moveActive = true;
			moveEl.classList.add("wx-dragging");
			moveEl.style.zIndex = "100";
			moveEl.style.transition = "none";
			document.body.style.userSelect = "none";
		}

		if (!moveActive) return;

		const containerRect = node.getBoundingClientRect();
		const rawX = e.clientX - containerRect.left - offsetX + node.scrollLeft;
		const rawY = e.clientY - containerRect.top - offsetY + node.scrollTop;

		let newLeft: number;
		let newTop: number;

		if (opts.mode === "boxes" && moveXUnits.length > 0 && opts.dx > 0) {
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const unitIdx = findContainingUnit(mouseX100, moveXUnits);
			newLeft = moveXUnits[unitIdx].position * opts.dx + offsetInUnitX;
			newTop = rawY;
		} else if (opts.mode === "bars") {
			newLeft = rawX;
			if (moveYUnits.length > 0 && opts.dy > 0) {
				const mouseY100 =
					(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
				const unitIdx = findContainingUnit(mouseY100, moveYUnits);
				newTop = moveYUnits[unitIdx].position * opts.dy + offsetInUnitY;
			} else {
				newTop = origTop;
			}
		} else if (
			opts.mode === "grid" &&
			moveXUnits.length > 0 &&
			moveYUnits.length > 0 &&
			opts.dx > 0 &&
			opts.dy > 0
		) {
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const xIdx = findContainingUnit(mouseX100, moveXUnits);
			newLeft =
				origLeft +
				(moveXUnits[xIdx].position - moveXUnits[grabXIdx].position) * opts.dx;

			const mouseY100 =
				(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
			const yIdx = findContainingUnit(mouseY100, moveYUnits);
			newTop =
				origTop +
				(moveYUnits[yIdx].position - moveYUnits[grabYIdx].position) * opts.dy;
		} else {
			newLeft = rawX;
			newTop = rawY;
		}

		if (opts.clipDrag) {
			const maxX =
				Math.max(node.scrollWidth, node.clientWidth) - moveEl.offsetWidth;
			const maxY =
				Math.max(node.scrollHeight, node.clientHeight) - moveEl.offsetHeight;
			newLeft = clamp(newLeft, 0, maxX);
			newTop = clamp(newTop, 0, maxY);
		}

		moveEl.style.left = newLeft + "px";
		moveEl.style.top = newTop + "px";
	}

	function handleMoveMouseUp(e: MouseEvent) {
		document.removeEventListener("mousemove", handleMoveMouseMove);
		document.removeEventListener("mouseup", handleMoveMouseUp);

		if (!moveActive || !moveEl) {
			resetMove();
			return;
		}

		const rawId = getID(moveEl);
		const eventInfo = decodeId(rawId);
		const original = opts.getEvent(eventInfo.id);

		if (!original) {
			resetMove();
			return;
		}

		if (
			opts.mode === "grid" &&
			moveXUnits.length > 0 &&
			moveYUnits.length > 0 &&
			opts.dx > 0 &&
			opts.dy > 0
		) {
			const containerRect = node.getBoundingClientRect();
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const mouseY100 =
				(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
			const dropXIdx = findContainingUnit(mouseX100, moveXUnits);
			const dropYIdx = findContainingUnit(mouseY100, moveYUnits);

			const xDelta = dropXIdx - grabXIdx;
			const yDelta = dropYIdx - grabYIdx;

			if (xDelta !== 0 || yDelta !== 0) {
				const xStepMs =
					moveXUnits.length >= 2
						? (moveXUnits[1].ui!.date as Date).getTime() -
							(moveXUnits[0].ui!.date as Date).getTime()
						: 86400000;
				const yStepMs =
					moveYUnits.length >= 2
						? (moveYUnits[1].ui!.date as Date).getTime() -
							(moveYUnits[0].ui!.date as Date).getTime()
						: 7 * 86400000;

				const deltaMs = xDelta * xStepMs + yDelta * yStepMs;
				const newStart = new Date(original.start.getTime() + deltaMs);
				const duration =
					original.duration != null
						? (original.duration as number)
						: original.end
							? original.end.getTime() - original.start.getTime()
							: 0;
				const newEnd = new Date(newStart.getTime() + duration);

				const payload: Record<string, any> = {
					id: eventInfo.id,
					rawId,
					event: { start: newStart, end: newEnd },
				};
				opts.exec("move-event", payload);
			}

			resetMove();
			return;
		}

		const finalLeft = parseFloat(moveEl.style.left) || 0;
		const finalTop = parseFloat(moveEl.style.top) || 0;

		let x100: number;
		let y100: number;

		if (opts.mode === "bars") {
			x100 = opts.dx > 0 ? finalLeft / opts.dx : 0;
			y100 = opts.dy > 0 ? (finalTop + moveEl.offsetHeight / 2) / opts.dy : 0;
		} else if (opts.mode === "boxes") {
			x100 = opts.dx > 0 ? (finalLeft + moveEl.offsetWidth / 2) / opts.dx : 0;
			y100 = opts.dy > 0 ? finalTop / opts.dy : 0;
		} else {
			x100 = opts.dx > 0 ? finalLeft / opts.dx : 0;
			y100 = opts.dy > 0 ? finalTop / opts.dy : 0;
		}

		const duration =
			original.duration != null
				? (original.duration as number)
				: original.end
					? original.end.getTime() - original.start.getTime()
					: 0;

		if (duration > 0) {
			const partial = opts.model.toPositionStart(
				opts.sectionName,
				x100,
				y100,
				{ start: original.start },
				true,
			);
			if (partial.start instanceof Date) {
				partial.end = new Date(partial.start.getTime() + duration);
				const payload: Record<string, any> = {
					id: eventInfo.id,
					rawId,
					event: partial,
				};
				opts.exec("move-event", payload);
			}
		}

		resetMove();
	}

	function cancelMove() {
		document.removeEventListener("mousemove", handleMoveMouseMove);
		document.removeEventListener("mouseup", handleMoveMouseUp);
		resetMove();
	}

	function resetMove() {
		if (moveEl) {
			moveEl.style.cssText = moveOrigStyle;
			moveEl.classList.remove("wx-dragging");
		}
		document.body.style.userSelect = "";
		moveEl = null;
		movePending = false;
		moveActive = false;
	}

	// ---- create ----

	function startCreate(e: MouseEvent) {
		stub = node.querySelector("[data-drag-stub]") as HTMLElement;
		if (!stub) return;

		e.preventDefault();

		createPending = true;
		createActive = false;
		createStartX = e.clientX;
		createStartY = e.clientY;

		createXUnits = opts.xHeaders?.[opts.xHeaders.length - 1] ?? [];
		createYUnits = opts.yHeaders?.[opts.yHeaders.length - 1] ?? [];

		const containerRect = node.getBoundingClientRect();

		if (opts.mode === "grid") {
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const mouseY100 =
				(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
			anchorXIdx = findContainingUnit(mouseX100, createXUnits);
			anchorYIdx = findContainingUnit(mouseY100, createYUnits);
		} else if (opts.mode === "boxes") {
			if (createXUnits.length > 0) {
				const mouseX100 =
					(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
				anchorXIdx2 = findContainingUnit(mouseX100, createXUnits);
			}
			anchorY = e.clientY - containerRect.top + node.scrollTop;
		} else if (opts.mode === "bars") {
			if (createYUnits.length > 0) {
				const mouseY100 =
					(e.clientY - containerRect.top + node.scrollTop) / opts.dy;
				anchorYIdx2 = findContainingUnit(mouseY100, createYUnits);
			}
			anchorX = e.clientX - containerRect.left + node.scrollLeft;
		}

		document.addEventListener("mousemove", handleCreateMouseMove);
		document.addEventListener("mouseup", handleCreateMouseUp);
	}

	function handleCreateMouseMove(e: MouseEvent) {
		if (!stub) return;

		if (createPending) {
			const dx = Math.abs(e.clientX - createStartX);
			const dy = Math.abs(e.clientY - createStartY);
			if (dx < CREATE_THRESHOLD && dy < CREATE_THRESHOLD) return;
			createPending = false;
			createActive = true;
			stub.style.display = "block";
			document.body.style.userSelect = "none";
		}

		if (!createActive) return;

		const containerRect = node.getBoundingClientRect();

		if (
			opts.mode === "grid" &&
			createXUnits.length > 0 &&
			createYUnits.length > 0
		) {
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const cursorXIdx = findContainingUnit(mouseX100, createXUnits);

			const minIdx = Math.min(anchorXIdx, cursorXIdx);
			const maxIdx = Math.max(anchorXIdx, cursorXIdx);

			const left = createXUnits[minIdx].position * opts.dx;
			const right =
				maxIdx < createXUnits.length - 1
					? createXUnits[maxIdx + 1].position * opts.dx
					: (createXUnits[maxIdx].position + createXUnits[maxIdx].size) *
						opts.dx;
			const top = createYUnits[anchorYIdx].position * opts.dy;
			const height = createYUnits[anchorYIdx].size * opts.dy;

			stub.style.left = left + "px";
			stub.style.top = top + "px";
			stub.style.width = right - left + "px";
			stub.style.height = height + "px";
		} else if (opts.mode === "boxes") {
			const cursorY = e.clientY - containerRect.top + node.scrollTop;
			const minY = Math.min(anchorY, cursorY);
			const maxY = Math.max(anchorY, cursorY);

			let left: number, width: number;
			if (createXUnits.length > 0) {
				left = createXUnits[anchorXIdx2].position * opts.dx;
				width = createXUnits[anchorXIdx2].size * opts.dx;
			} else {
				left = 0;
				width = node.scrollWidth || node.clientWidth;
			}

			stub.style.left = left + "px";
			stub.style.top = minY + "px";
			stub.style.width = width + "px";
			stub.style.height = maxY - minY + "px";
		} else if (opts.mode === "bars") {
			const cursorX = e.clientX - containerRect.left + node.scrollLeft;
			const minX = Math.min(anchorX, cursorX);
			const maxX = Math.max(anchorX, cursorX);

			let top: number, height: number;
			if (createYUnits.length > 0) {
				top = createYUnits[anchorYIdx2].position * opts.dy;
				height = createYUnits[anchorYIdx2].size * opts.dy;
			} else {
				top = 0;
				height = node.scrollHeight || node.clientHeight;
			}

			stub.style.left = minX + "px";
			stub.style.top = top + "px";
			stub.style.width = maxX - minX + "px";
			stub.style.height = height + "px";
		}
	}

	function handleCreateMouseUp(e: MouseEvent) {
		document.removeEventListener("mousemove", handleCreateMouseMove);
		document.removeEventListener("mouseup", handleCreateMouseUp);

		if (!createActive || !stub) {
			resetCreate();
			return;
		}

		const containerRect = node.getBoundingClientRect();

		if (
			opts.mode === "grid" &&
			createXUnits.length > 0 &&
			createYUnits.length > 0
		) {
			const mouseX100 =
				(e.clientX - containerRect.left + node.scrollLeft) / opts.dx;
			const cursorXIdx = findContainingUnit(mouseX100, createXUnits);

			const startXIdx = Math.min(anchorXIdx, cursorXIdx);
			const endXIdx = Math.max(anchorXIdx, cursorXIdx);

			const xStepMs =
				createXUnits.length >= 2
					? (createXUnits[1].ui!.date as Date).getTime() -
						(createXUnits[0].ui!.date as Date).getTime()
					: 86400000;

			const rowStart = (createYUnits[anchorYIdx].ui!.date as Date).getTime();
			const start = new Date(rowStart + startXIdx * xStepMs);
			const end = new Date(rowStart + (endXIdx + 1) * xStepMs);

			opts.exec("add-event", { event: { start, end }, edit: true });
		} else if (opts.mode === "boxes") {
			const cursorY = e.clientY - containerRect.top + node.scrollTop;
			const minY = Math.min(anchorY, cursorY);
			const maxY = Math.max(anchorY, cursorY);

			const x100 =
				createXUnits.length > 0
					? createXUnits[anchorXIdx2].position +
						createXUnits[anchorXIdx2].size / 2
					: 50;
			const startY100 = opts.dy > 0 ? minY / opts.dy : 0;
			const endY100 = opts.dy > 0 ? maxY / opts.dy : 0;

			const startPartial = opts.model.toPositionStart(
				opts.sectionName,
				x100,
				startY100,
				{},
				true,
			);
			const endPartial = opts.model.toPositionEnd(
				opts.sectionName,
				x100,
				endY100,
				{},
				true,
			);

			if (
				startPartial.start instanceof Date &&
				endPartial.end instanceof Date
			) {
				opts.exec("add-event", {
					event: { ...startPartial, ...endPartial },
					edit: true,
				});
			}
		} else if (opts.mode === "bars") {
			const cursorX = e.clientX - containerRect.left + node.scrollLeft;
			const minX = Math.min(anchorX, cursorX);
			const maxX = Math.max(anchorX, cursorX);

			const y100 =
				createYUnits.length > 0
					? createYUnits[anchorYIdx2].position +
						createYUnits[anchorYIdx2].size / 2
					: 50;
			const startX100 = opts.dx > 0 ? minX / opts.dx : 0;
			const endX100 = opts.dx > 0 ? maxX / opts.dx : 0;

			const startPartial = opts.model.toPositionStart(
				opts.sectionName,
				startX100,
				y100,
				{},
				true,
			);
			const endPartial = opts.model.toPositionEnd(
				opts.sectionName,
				endX100,
				y100,
				{},
				true,
			);

			if (
				startPartial.start instanceof Date &&
				endPartial.end instanceof Date
			) {
				opts.exec("add-event", {
					event: { ...startPartial, ...endPartial },
					edit: true,
				});
			}
		}

		resetCreate();
	}

	function resetCreate() {
		if (stub) stub.style.display = "none";
		document.body.style.userSelect = "";
		stub = null;
		createActive = false;
		createPending = false;
	}

	// ---- lifecycle ----

	node.addEventListener("mousedown", handleMouseDown);

	return {
		update(newOpts: DragOptions) {
			opts = newOpts;
		},
		destroy() {
			node.removeEventListener("mousedown", handleMouseDown);
			if (moveActive || movePending) cancelMove();
			if (createActive || createPending) {
				document.removeEventListener("mousemove", handleCreateMouseMove);
				document.removeEventListener("mouseup", handleCreateMouseUp);
				resetCreate();
			}
		},
	};
}
