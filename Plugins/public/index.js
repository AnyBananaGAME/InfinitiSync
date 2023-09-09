function generateTable(data) {
	const table = document.getElementById("data-table");

	const headerRow = document.createElement("tr");

	for (const key in data[0]) {
		const th = document.createElement("th");
		th.textContent = key;
		headerRow.appendChild(th);
	}

	table.appendChild(headerRow);

	data.forEach((item) => {
		const row = document.createElement("tr");

		for (const key in item) {
			const cell = document.createElement("td");
			cell.textContent = item[key];
			row.appendChild(cell);
		}

		table.appendChild(row);
	});
}
