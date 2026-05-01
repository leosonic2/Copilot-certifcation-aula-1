/**
 * customers-gui.js — Grid interface to display and add customers.
 * Depends on ReadingFile.js (parseCsv, loadCustomers).
 */

(function () {
    const statusEl = document.getElementById("status");
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    const formFields = document.getElementById("formFields");
    const addForm = document.getElementById("addForm");
    const btnAdd = document.getElementById("btnAdd");

    let columns = [];
    let rows = [];
    const inputs = {};

    // ---- Render helpers ----

    function renderTableHead() {
        const tr = document.createElement("tr");
        columns.forEach((col) => {
            const th = document.createElement("th");
            th.textContent = col;
            tr.appendChild(th);
        });
        tableHead.innerHTML = "";
        tableHead.appendChild(tr);
    }

    function appendTableRow(rowData) {
        const tr = document.createElement("tr");
        columns.forEach((col) => {
            const td = document.createElement("td");
            td.textContent = rowData[col] || "";
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    }

    function renderTable() {
        tableBody.innerHTML = "";
        rows.forEach((row) => appendTableRow(row));
    }

    function buildForm() {
        formFields.innerHTML = "";
        columns.forEach((col) => {
            const label = document.createElement("label");
            label.textContent = col;

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = col;
            inputs[col] = input;

            label.appendChild(input);
            formFields.appendChild(label);
        });
        addForm.disabled = false;
    }

    function updateStatus() {
        statusEl.textContent = `Total records in grid: ${rows.length}`;
        statusEl.className = "status";
    }

    function showError(message) {
        statusEl.textContent = `Error: ${message}`;
        statusEl.className = "status error";
    }

    // ---- Add row handler ----

    function onAddRow() {
        const newRow = {};
        let hasValue = false;

        columns.forEach((col) => {
            const value = inputs[col].value.trim();
            newRow[col] = value;
            if (value) hasValue = true;
        });

        if (!hasValue) {
            alert("Fill in at least one field to add a row.");
            return;
        }

        rows.push(newRow);
        appendTableRow(newRow);
        updateStatus();

        // Clear fields
        columns.forEach((col) => {
            inputs[col].value = "";
        });

        // Scroll to last row
        tableBody.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    btnAdd.addEventListener("click", onAddRow);

    // ---- Init ----

    async function init() {
        try {
            const data = await loadCustomers();
            columns = data.columns;
            rows = data.rows;

            renderTableHead();
            renderTable();
            buildForm();
            updateStatus();
        } catch (error) {
            showError(error.message);
        }
    }

    init();
})();
