// JavaScript Document

document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from the server
    fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/orders')
        .then(response => response.json())
        .then(data => {
            // Call the function to generate the table with the retrieved data
            generateTable(data);
        })
        .catch(error => console.error('Error fetching orders:', error));

    // Function to generate and populate the table
    function generateTable(orders) {
        const tableContainer = document.getElementById('table-container');

        // Create a table element
        const table = document.createElement('table');
        table.border = '1';

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = thead.insertRow();
        Object.keys(orders[0]).forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        orders.forEach(order => {
            const row = tbody.insertRow();
            Object.values(order).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });
        table.appendChild(tbody);

        // Append the table to the container
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }
});