/**
 * ReadingFile.js — Carrega e parseia o CSV customers-10000.csv
 */

/**
 * Faz o parse de uma string CSV em um array de objetos (cada linha = dict com chaves do cabeçalho).
 * @param {string} csvText
 * @returns {{ columns: string[], rows: Record<string, string>[] }}
 */
function parseCsv(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0 || !lines[0].trim()) {
        throw new Error("CSV vazio ou sem cabecalho.");
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
 * Carrega o CSV a partir de um caminho relativo via fetch.
 * @param {string} [url="../sample-files/customers-10000.csv"]
 * @returns {Promise<{ columns: string[], rows: Record<string, string>[] }>}
 */
async function loadCustomers(url = "../../sample-files/customers-10000.csv") {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao carregar arquivo: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text.trim()) {
        throw new Error("Arquivo CSV vazio.");
    }

    return parseCsv(text);
}

// Exporta para testes (Node.js) se disponível
if (typeof module !== "undefined" && module.exports) {
    module.exports = { parseCsv, loadCustomers };
}
