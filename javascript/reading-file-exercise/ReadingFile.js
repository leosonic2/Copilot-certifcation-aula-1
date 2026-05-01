/**
 * ReadingFile.js — Loads and parses the CSV file customers-10000.csv
 */

/**
 * Parses a CSV string into an array of objects (each row = object with header keys).
 * @param {string} csvText
 * @returns {{ columns: string[], rows: Record<string, string>[] }}
 */
function parseCsv(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0 || !lines[0].trim()) {
        throw new Error("Empty CSV or missing header.");
    }

    const columns = lines[0].split(",").map((col) => col.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length !== columns.length) continue;

        const row = {};
        columns.forEach((col, idx) => {
            row[col] = values[idx] || "";
        });
        rows.push(row);
    }

    return { columns, rows };
}

/**
 * Loads the CSV from a relative path via fetch.
 * @param {string} [url="../../sample-files/customers-10000.csv"]
 * @returns {Promise<{ columns: string[], rows: Record<string, string>[] }>}
 */
async function loadCustomers(url = "../../sample-files/customers-10000.csv") {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error loading file: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text.trim()) {
        throw new Error("Empty CSV file.");
    }

    return parseCsv(text);
}

// Export for tests (Node.js) if available
if (typeof module !== "undefined" && module.exports) {
    module.exports = { parseCsv, loadCustomers };
}
