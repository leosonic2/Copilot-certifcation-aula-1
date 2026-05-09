/**
 * ReadingFile.js — Loads and parses the CSV file customers-10000.csv
 */

const DEFAULT_CUSTOMERS_CSV_URL = "../../sample-files/customers-10000.csv";

/**
 * Parses the entire CSV text in a single pass, supporting:
 *  - Quoted fields containing commas, newlines (\n, \r\n), and escaped quotes ("").
 *  - Unquoted fields (trimmed automatically).
 *
 * @param {string} text  Raw CSV content.
 * @returns {string[][]}  Array of rows, each row an array of field values.
 */
function parseCsvRows(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    let isQuotedField = false;
    let quoteClosed = false;
    let i = 0;

    function pushField() {
        rows.length > 0 || row.length > 0 || field !== ""
            ? row.push(isQuotedField ? field : field.trim())
            : undefined;
        field = "";
        isQuotedField = false;
        quoteClosed = false;
    }

    function pushRow() {
        pushField();
        if (row.length > 0) {
            rows.push(row);
        }
        row = [];
    }

    while (i < text.length) {
        const char = text[i];

        // ---- inside a quoted field ----
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i += 2;
                    continue;
                }
                inQuotes = false;
                quoteClosed = true;
                i++;
                continue;
            }
            field += char;
            i++;
            continue;
        }

        // ---- outside quotes ----
        if (char === '"') {
            if (quoteClosed) {
                throw new Error("Invalid CSV format: unexpected character after closing quote.");
            }
            if (field.trim() !== "") {
                throw new Error("Invalid CSV format: unexpected quote character.");
            }
            field = "";
            inQuotes = true;
            isQuotedField = true;
            i++;
            continue;
        }

        if (char === ",") {
            pushField();
            i++;
            continue;
        }

        if (char === "\r" && text[i + 1] === "\n") {
            pushRow();
            i += 2;
            continue;
        }

        if (char === "\n") {
            pushRow();
            i++;
            continue;
        }

        if (quoteClosed) {
            if (/\s/.test(char)) {
                i++;
                continue;
            }
            throw new Error("Invalid CSV format: unexpected character after closing quote.");
        }

        field += char;
        i++;
    }

    if (inQuotes) {
        throw new Error("Invalid CSV format: missing closing quote.");
    }

    pushRow();
    return rows;
}

/**
 * Builds an object row from column names and field values.
 * Returns null when the number of values does not match the columns.
 */
function buildRow(columns, values) {
    if (values.length !== columns.length) {
        return null;
    }
    const row = {};
    columns.forEach((column, index) => {
        row[column] = values[index] || "";
    });
    return row;
}

/**
 * Parses a CSV string into an array of objects (each row = object with header keys).
 * Supports quoted fields with commas, escaped quotes, and embedded newlines.
 *
 * @param {string} csvText
 * @returns {{ columns: string[], rows: Record<string, string>[] }}
 */
function parseCsv(csvText) {
    const allRows = parseCsvRows(csvText);

    if (allRows.length === 0 || allRows[0].every((c) => !c.trim())) {
        throw new Error("Empty CSV or missing header.");
    }

    const columns = allRows[0].map((c) => c.trim());
    const rows = [];

    for (let i = 1; i < allRows.length; i++) {
        const row = buildRow(columns, allRows[i]);
        if (row) {
            rows.push(row);
        }
    }

    return { columns, rows };
}

/**
 * Loads the CSV from a relative path via fetch.
 * @param {string} [url="../../sample-files/customers-10000.csv"]
 * @returns {Promise<{ columns: string[], rows: Record<string, string>[] }>}
 */
async function loadCustomers(url = DEFAULT_CUSTOMERS_CSV_URL) {
    let response;

    try {
        response = await fetch(url);
    } catch (error) {
        throw new Error(`Error loading file: ${error.message}`);
    }

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
    module.exports = { parseCsv, loadCustomers, DEFAULT_CUSTOMERS_CSV_URL };
}
