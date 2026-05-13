type ResizeCallback = (rect: DOMRect) => void;
export function resize(node: HTMLElement, callback: ResizeCallback) {
	const observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			callback(entry.contentRect);
		}
	});

	observer.observe(node);

	return {
		destroy: () => observer.disconnect(),
	};
}
