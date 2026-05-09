/**
 * test_ReadingFile.js — Unit tests for parseCsv and loadCustomers.
 * Runs in the browser via tests/test-runner.html.
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
                    ` — expected: ${JSON.stringify(expected)}, received: ${JSON.stringify(actual)}`
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
                    `Expected error with "${expectedMessage}", got: "${e.message}"`
                );
            }
        }
        if (!threw) {
            throw new Error(`Expected to throw error${expectedMessage ? ': "' + expectedMessage + '"' : ""}`);
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
                    `Expected error with "${expectedMessage}", got: "${e.message}"`
                );
            }
        }
        if (!threw) {
            throw new Error(`Expected to reject${expectedMessage ? ': "' + expectedMessage + '"' : ""}`);
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
    // TESTS — parseCsv
    // ================================================================

    async function parseCsv_returns_columns_and_rows_from_valid_csv() {
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

    async function parseCsv_throws_error_for_empty_csv() {
        assertThrows(() => parseCsv(""), "Empty CSV or missing header");
    }

    async function parseCsv_throws_error_for_whitespace_only_csv() {
        assertThrows(() => parseCsv("   \n  "), "Empty CSV or missing header");
    }

    async function parseCsv_returns_zero_rows_for_header_only_csv() {
        const csv = "Name,Age,City";
        const data = parseCsv(csv);

        assertEqual(data.columns.length, 3);
        assertEqual(data.rows.length, 0);
    }

    async function parseCsv_skips_rows_with_mismatched_column_count() {
        const csv = "A,B\n1,2\n3\n4,5";
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["A"], "1");
        assertEqual(data.rows[1]["A"], "4");
    }

    async function parseCsv_trims_whitespace_around_values() {
        const csv = " Name , Age \n  Alice , 30 ";
        const data = parseCsv(csv);

        assertEqual(data.columns[0], "Name");
        assertEqual(data.columns[1], "Age");
        assertEqual(data.rows[0]["Name"], "Alice");
        assertEqual(data.rows[0]["Age"], "30");
    }

    async function parseCsv_handles_crlf_line_breaks() {
        const csv = "X,Y\r\n1,2\r\n3,4";
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["X"], "1");
    }

    async function parseCsv_treats_empty_value_as_empty_string() {
        const csv = "A,B\n,hello";
        const data = parseCsv(csv);

        assertEqual(data.rows[0]["A"], "");
        assertEqual(data.rows[0]["B"], "hello");
    }

    async function parseCsv_parses_quoted_fields_with_commas() {
        const csv = 'Name,Address\n"Alice","Avenue, 123"';
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 1);
        assertEqual(data.rows[0]["Name"], "Alice");
        assertEqual(data.rows[0]["Address"], "Avenue, 123");
    }

    async function parseCsv_parses_escaped_quotes_inside_quoted_field() {
        const csv = 'Name,Note\n"Bob","He said ""hello"""';
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 1);
        assertEqual(data.rows[0]["Note"], 'He said "hello"');
    }

    async function parseCsv_throws_error_for_unclosed_quoted_field() {
        assertThrows(() => parseCsv('A,B\n"1,2'), "missing closing quote");
    }

    async function parseCsv_parses_multiline_quoted_field() {
        const csv = 'Name,Bio\n"Alice","Line 1\nLine 2\nLine 3"\n"Bob","Simple"';
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["Name"], "Alice");
        assertEqual(data.rows[0]["Bio"], "Line 1\nLine 2\nLine 3");
        assertEqual(data.rows[1]["Name"], "Bob");
        assertEqual(data.rows[1]["Bio"], "Simple");
    }

    async function parseCsv_parses_multiline_quoted_field_with_crlf() {
        const csv = 'A,B\r\n"hello\r\nworld",2\r\nx,y';
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 2);
        assertEqual(data.rows[0]["A"], "hello\r\nworld");
        assertEqual(data.rows[0]["B"], "2");
        assertEqual(data.rows[1]["A"], "x");
    }

    async function parseCsv_parses_multiline_with_commas_and_quotes() {
        const csv = 'Name,Address\n"Alice","Avenue, 123\nApt ""B"""';
        const data = parseCsv(csv);

        assertEqual(data.rows.length, 1);
        assertEqual(data.rows[0]["Address"], 'Avenue, 123\nApt "B"');
    }

    // ================================================================
    // TESTS — loadCustomers
    // ================================================================

    async function loadCustomers_loads_real_csv_successfully() {
        const data = await loadCustomers();

        assert(data.columns.length > 0, "Should have at least one column");
        assert(data.rows.length > 0, "Should have at least one row");
        assert(typeof data.rows[0] === "object", "Each row should be an object");
    }

    async function loadCustomers_returns_columns_as_row_keys() {
        const data = await loadCustomers();

        data.columns.forEach((col) => {
            assert(col in data.rows[0], `Column "${col}" should exist in the first row`);
        });
    }

    async function loadCustomers_throws_error_for_missing_url() {
        await assertRejects(
            () => loadCustomers("./nonexistent-file.csv"),
            "Error loading file"
        );
    }

    // ================================================================
    // RUN
    // ================================================================

    async function runAll() {
        await runTest("parseCsv returns columns and rows from valid CSV", parseCsv_returns_columns_and_rows_from_valid_csv);
        await runTest("parseCsv throws error for empty CSV", parseCsv_throws_error_for_empty_csv);
        await runTest("parseCsv throws error for whitespace-only CSV", parseCsv_throws_error_for_whitespace_only_csv);
        await runTest("parseCsv returns zero rows for header-only CSV", parseCsv_returns_zero_rows_for_header_only_csv);
        await runTest("parseCsv skips rows with mismatched column count", parseCsv_skips_rows_with_mismatched_column_count);
        await runTest("parseCsv trims whitespace around values", parseCsv_trims_whitespace_around_values);
        await runTest("parseCsv handles CRLF line breaks", parseCsv_handles_crlf_line_breaks);
        await runTest("parseCsv treats empty value as empty string", parseCsv_treats_empty_value_as_empty_string);
        await runTest("parseCsv parses quoted fields with commas", parseCsv_parses_quoted_fields_with_commas);
        await runTest("parseCsv parses escaped quotes inside quoted field", parseCsv_parses_escaped_quotes_inside_quoted_field);
        await runTest("parseCsv throws error for unclosed quoted field", parseCsv_throws_error_for_unclosed_quoted_field);
        await runTest("parseCsv parses multiline quoted field", parseCsv_parses_multiline_quoted_field);
        await runTest("parseCsv parses multiline quoted field with CRLF", parseCsv_parses_multiline_quoted_field_with_crlf);
        await runTest("parseCsv parses multiline with commas and quotes", parseCsv_parses_multiline_with_commas_and_quotes);
        await runTest("loadCustomers loads real CSV successfully", loadCustomers_loads_real_csv_successfully);
        await runTest("loadCustomers returns columns as row keys", loadCustomers_returns_columns_as_row_keys);
        await runTest("loadCustomers throws error for missing URL", loadCustomers_throws_error_for_missing_url);

        renderResults();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runAll);
    } else {
        runAll();
    }
})();
