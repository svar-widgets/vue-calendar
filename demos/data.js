function getMonday() {
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(monday.getDate() + diff);
	monday.setHours(0, 0, 0, 0);
	return monday;
}

const anchor = getMonday();

export function relDate(dayOffset, hour = 0, min = 0) {
	const r = new Date(anchor);
	r.setDate(r.getDate() + dayOffset);
	r.setHours(hour, min, 0, 0);
	return r;
}

export function getData() {
	const data = [
		{
			id: 1,
			text: "Company retreat",
			start: relDate(-2),
			end: relDate(3),
		},
		{
			id: 2,
			text: "Product launch week",
			start: relDate(0),
			end: relDate(5),
		},
		{
			id: 3,
			text: "Team standup",
			start: relDate(0, 9, 0),
			end: relDate(0, 9, 30),
		},
		{
			id: 4,
			text: "Sprint planning",
			start: relDate(0, 10, 0),
			end: relDate(0, 11, 30),
		},
		{
			id: 5,
			text: "1:1 with manager",
			start: relDate(0, 9, 30),
			end: relDate(0, 10, 30),
		},
		{
			id: 6,
			text: "Design review",
			start: relDate(1, 14, 0),
			end: relDate(1, 15, 30),
		},
		{
			id: 7,
			text: "Client call",
			start: relDate(2, 11, 0),
			end: relDate(2, 12, 0),
		},
		{
			id: 8,
			text: "Lunch and learn",
			start: relDate(2, 12, 0),
			end: relDate(2, 13, 0),
		},
		{
			id: 9,
			text: "Code review session",
			start: relDate(3, 9, 0),
			end: relDate(3, 10, 30),
		},
		{
			id: 10,
			text: "Budget meeting",
			start: relDate(3, 10, 0),
			end: relDate(3, 12, 0),
		},
		{
			id: 11,
			text: "Team retrospective",
			start: relDate(4, 15, 0),
			end: relDate(4, 16, 30),
		},
		{
			id: 12,
			text: "All-hands meeting",
			start: relDate(4, 10, 0),
			end: relDate(4, 11, 0),
		},
		{
			id: 13,
			text: "Workshop: API design",
			start: relDate(7, 9, 0),
			end: relDate(7, 12, 0),
		},
		{
			id: 14,
			text: "Conference travel",
			start: relDate(8),
			end: relDate(10),
		},
		{
			id: 15,
			text: "Quarterly review",
			start: relDate(-7, 14, 0),
			end: relDate(-7, 15, 30),
		},
		{
			id: 16,
			text: "Strategy offsite",
			start: relDate(28, 9, 0),
			end: relDate(29, 17, 0),
		},
		{
			id: 17,
			text: "Board presentation",
			start: relDate(-28, 10, 0),
			end: relDate(-28, 11, 30),
		},
		{
			id: 18,
			text: "Project deadline",
			start: relDate(56),
			end: relDate(57),
		},
	];

	return { data, date: anchor };
}
