let scrollbarSize: number | null = null;

export function getScrollbarSize(): number {
	if (scrollbarSize !== null) return scrollbarSize;

	const outer = document.createElement("div");
	outer.style.cssText =
		"position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
	document.body.appendChild(outer);
	scrollbarSize = outer.offsetWidth - outer.clientWidth;
	document.body.removeChild(outer);

	return scrollbarSize;
}
