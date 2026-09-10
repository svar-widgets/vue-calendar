export function getEditorItems(recurring = false) {
	return [
		{ comp: "text", key: "text", label: "Text" },
		{
			comp: recurring ? "event-recurrence" : "event-dates",
			key: "schedule",
			keys: recurring
				? ["start", "end", "allDay", "rrule"]
				: ["start", "end", "allDay"],
			label: "",
			validation: (value: { start?: Date; end?: Date }) =>
				!value.start || !value.end || value.end >= value.start,
			validationMessage: "End date must be after the start date",
		},
	];
}
