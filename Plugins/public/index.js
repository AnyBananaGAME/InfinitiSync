document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

function generateTable(data) {
  const table = document.getElementById('data-table');

  const headerRow = document.createElement('tr');
  for (const key in data[0]) {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  data.forEach((item) => {
    const row = document.createElement('tr');
    for (const key in item) {
      const cell = document.createElement('td');
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    table.appendChild(row);
  });
}
