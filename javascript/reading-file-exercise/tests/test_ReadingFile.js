/**
 * test_ReadingFile.js — Testes unitários para parseCsv e loadCustomers.
 * Roda no navegador via tests/test-runner.html.
 */

(function () {
    const results = [];
    let passCount = 0;
    let failCount = 0;

    function assert(condition, message) {
        if (!condition) throw new Error(message || "Assertion failed");
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(
                (message || "assertEqual") +
                    ` — esperado: ${JSON.stringify(expected)}, recebido: ${JSON.stringify(actual)}`
            );
        }
    }

    function assertThrows(fn, expectedMessage) {
        let threw = false;
        try {
            fn();
        } catch (e) {
            threw = true;
            if (expectedMessage && !e.message.includes(expectedMessage)) {
                throw new Error(
                    `Esperava erro com "${expectedMessage}", recebeu: "${e.message}"`
                );
            }
        }
        if (!threw) {
            throw new Error(`Esperava que lancasse erro${expectedMessage ? ': "' + expectedMessage + '"' : ""}`);
        }
    }

    async function assertRejects(fn, expectedMessage) {
        let threw = false;
        try {
            await fn();
        } catch (e) {
            threw = true;
            if (expectedMessage && !e.message.includes(expectedMessage)) {
                throw new Error(
                    `Esperava erro com "${expectedMessage}", recebeu: "${e.message}"`
                );
            }
        }
        if (!threw) {
            throw new Error(`Esperava que rejeitasse${expectedMessage ? ': "' + expectedMessage + '"' : ""}`);
        }
    }

    async function runTest(name, fn) {
        try {
            await fn();
            results.push({ name, status: "PASSED" });
            passCount++;
        } catch (e) {
            results.push({ name, status: "FAILED", error: e.message });
            failCount++;
        }
    }

    function renderResults() {
        const container = document.getElementById("results");
        const summary = document.createElement("h2");
        summary.textContent = `${passCount} passed, ${failCount} failed — ${results.length} total`;
        summary.style.color = failCount > 0 ? "#b71c1c" : "#2e7d32";
        container.appendChild(summary);

        results.forEach((r) => {
            const div = document.createElement("div");
            div.style.padding = "6px 10px";
            div.style.margin = "4px 0";
            div.style.borderRadius = "4px";
            div.style.fontFamily = "monospace";

            if (r.status === "PASSED") {
                div.style.background = "#e8f5e9";
                div.style.color = "#2e7d32";
                div.textContent = `✓ ${r.name}`;
            } else {
                div.style.background = "#ffebee";
                div.style.color = "#b71c1c";
                div.textContent = `✗ ${r.name} — ${r.error}`;
            }
            container.appendChild(div);
        });
    }

    // ================================================================
    // TESTES — parseCsv
    // ================================================================

    async function parseCsv_retorna_colunas_e_linhas_de_csv_valido() {
        const csv = "Name,Age,City\nAlice,30,Sao Paulo\nBob,25,Rio";
        const data = parseCsv(csv);

        assertEqual(data.columns.length, 3);
        assertEqual(data.columns[0], "Name");
        assertEqual(data.columns[1], "Age");
        assertEqual(data.columns[2], "City");
        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["Name"], "Alice");
        assertEqual(data.rows[1]["City"], "Rio");
    }

    async function parseCsv_lanca_erro_para_csv_vazio() {
        assertThrows(() => parseCsv(""), "CSV vazio ou sem cabecalho");
    }

    async function parseCsv_lanca_erro_para_csv_somente_espacos() {
        assertThrows(() => parseCsv("   \n  "), "CSV vazio ou sem cabecalho");
    }

    async function parseCsv_retorna_zero_linhas_para_csv_so_com_cabecalho() {
        const csv = "Name,Age,City";
        const data = parseCsv(csv);

        assertEqual(data.columns.length, 3);
        assertEqual(data.rows.length, 0);
    }

    async function parseCsv_ignora_linhas_com_numero_diferente_de_colunas() {
        const csv = "A,B\n1,2\n3\n4,5";
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["A"], "1");
        assertEqual(data.rows[1]["A"], "4");
    }

    async function parseCsv_remove_espacos_ao_redor_dos_valores() {
        const csv = " Name , Age \n  Alice , 30 ";
        const data = parseCsv(csv);

        assertEqual(data.columns[0], "Name");
        assertEqual(data.columns[1], "Age");
        assertEqual(data.rows[0]["Name"], "Alice");
        assertEqual(data.rows[0]["Age"], "30");
    }

    async function parseCsv_trata_quebra_de_linha_crlf() {
        const csv = "X,Y\r\n1,2\r\n3,4";
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["X"], "1");
    }

    async function parseCsv_trata_valor_vazio_como_string_vazia() {
        const csv = "A,B\n,hello";
        const data = parseCsv(csv);

        assertEqual(data.rows[0]["A"], "");
        assertEqual(data.rows[0]["B"], "hello");
    }

    // ================================================================
    // TESTES — loadCustomers
    // ================================================================

    async function loadCustomers_carrega_csv_real_com_sucesso() {
        const data = await loadCustomers();

        assert(data.columns.length > 0, "Deve ter pelo menos uma coluna");
        assert(data.rows.length > 0, "Deve ter pelo menos uma linha");
        assert(typeof data.rows[0] === "object", "Cada linha deve ser um objeto");
    }

    async function loadCustomers_retorna_colunas_como_chaves_das_linhas() {
        const data = await loadCustomers();

        data.columns.forEach((col) => {
            assert(col in data.rows[0], `Coluna "${col}" deve existir na primeira linha`);
        });
    }

    async function loadCustomers_lanca_erro_para_url_inexistente() {
        await assertRejects(
            () => loadCustomers("./arquivo-que-nao-existe.csv"),
            "Erro ao carregar arquivo"
        );
    }

    // ================================================================
    // RUN
    // ================================================================

    async function runAll() {
        await runTest("parseCsv retorna colunas e linhas de CSV valido", parseCsv_retorna_colunas_e_linhas_de_csv_valido);
        await runTest("parseCsv lanca erro para CSV vazio", parseCsv_lanca_erro_para_csv_vazio);
        await runTest("parseCsv lanca erro para CSV somente espacos", parseCsv_lanca_erro_para_csv_somente_espacos);
        await runTest("parseCsv retorna zero linhas para CSV so com cabecalho", parseCsv_retorna_zero_linhas_para_csv_so_com_cabecalho);
        await runTest("parseCsv ignora linhas com numero diferente de colunas", parseCsv_ignora_linhas_com_numero_diferente_de_colunas);
        await runTest("parseCsv remove espacos ao redor dos valores", parseCsv_remove_espacos_ao_redor_dos_valores);
        await runTest("parseCsv trata quebra de linha CRLF", parseCsv_trata_quebra_de_linha_crlf);
        await runTest("parseCsv trata valor vazio como string vazia", parseCsv_trata_valor_vazio_como_string_vazia);
        await runTest("loadCustomers carrega CSV real com sucesso", loadCustomers_carrega_csv_real_com_sucesso);
        await runTest("loadCustomers retorna colunas como chaves das linhas", loadCustomers_retorna_colunas_como_chaves_das_linhas);
        await runTest("loadCustomers lanca erro para URL inexistente", loadCustomers_lanca_erro_para_url_inexistente);

        renderResults();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runAll);
    } else {
        runAll();
    }
})();

