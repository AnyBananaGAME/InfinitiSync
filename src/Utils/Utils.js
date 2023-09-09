class Utils {

	/**
     * Table Data for packet testing.
     * @param {any} data 
     */
	async drawTable(data) {
		const headers = Object.keys(data[0]);
		const columnWidths = {};
		for (const header of headers) {
			const maxLength = Math.max(header.length, ...data.map(row => String(row[header]).length));
			columnWidths[header] = maxLength + 2;
		}
		let table = "";
		for (const header of headers) {
			table += header.padEnd(columnWidths[header]);
		}
		table += "\n";
		for (const header of headers) {
			table += "-".repeat(columnWidths[header]);
		}
		table += "\n";
		for (const row of data) {
			for (const header of headers) {
				table += String(row[header]).padEnd(columnWidths[header]);
			}
			table += "\n";
		}

		console.log(table);
	}
}
