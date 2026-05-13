export function getEditorItems() {
	return [
		{ comp: "text", key: "text", label: "Text" },
		{
			comp: "date-time-picker",
			key: "start",
			label: "Start date",
			time: true,
			config: { buttons: false },
		},
		{
			comp: "date-time-picker",
			key: "end",
			label: "End date",
			time: true,
			config: { buttons: false },
		},
		{ comp: "checkbox", key: "allDay", label: "All day" },
	];
}
