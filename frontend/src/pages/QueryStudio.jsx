import { useState } from "react";
import { executeQuery } from "../services/api";
import "../styles/query-studio.css";

const sampleQueries = [
    {
        name: "All customers",
        sql: "SELECT * FROM Customer;",
    },
    {
        name: "Bill status",
        sql: "SELECT bill_status, COUNT(*) AS count FROM Bill GROUP BY bill_status;",
    },
    {
        name: "Customer + property join",
        sql: `SELECT
    c.cust_id,
    c.cust_name,
    p.property_name
FROM Customer c
JOIN Customer_Owns_Property cop
    ON c.cust_id = cop.cust_id
JOIN Property p
    ON cop.property_id = p.property_id;`,
    },
    {
        name: "Top consuming meters",
        sql: `SELECT
    meter_id,
    SUM(current_reading - previous_reading) AS total_consumption
FROM Bill
GROUP BY meter_id
ORDER BY total_consumption DESC
LIMIT 10;`,
    },
    {
        name: "Payment methods",
        sql: `SELECT
    payment_mode,
    COUNT(*) AS payment_count,
    SUM(amount) AS total_amount
FROM Payment
GROUP BY payment_mode;`,
    },
    {
        name: "Customer consumption",
        sql: `SELECT
    c.cust_name,
    SUM(
        b.current_reading - b.previous_reading
    ) AS total_consumption
FROM Customer c
JOIN Customer_Owns_Property cop
    ON c.cust_id = cop.cust_id
JOIN Property_Incorporate_Meter pim
    ON cop.property_id = pim.property_id
JOIN Bill b
    ON pim.meter_id = b.meter_id
GROUP BY c.cust_id, c.cust_name
ORDER BY total_consumption DESC;`,
    },
];

function QueryStudio() {
    const [query, setQuery] = useState(
        sampleQueries[0].sql
    );

    const [result, setResult] = useState(null);
    const [executed, setExecuted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function runQuery() {
        if (!query.trim()) {
            setError("Enter a SQL query first.");
            return;
        }

        setLoading(true);
        setExecuted(false);
        setError("");
        setResult(null);

        try {
            const data = await executeQuery(query.trim());

            setResult(data);
            setExecuted(true);
        } catch (err) {
            console.error("Query execution failed:", err);

            setError(
                err.message || "Query execution failed."
            );
        } finally {
            setLoading(false);
        }
    }

    function loadQuery(sql) {
        setQuery(sql);
        setExecuted(false);
        setResult(null);
        setError("");
    }

    const resultRows = getRows(result);
    const resultColumns = getColumns(
        result,
        resultRows
    );

    const isRowResult =
        resultRows.length > 0 ||
        resultColumns.length > 0;

    return (
        <div className="query-page">
            {/* HEADER */}
            <div className="query-header">
                <div>
                    <span className="eyebrow">
                        DATABASE TOOLS
                    </span>

                    <h1>Query Studio</h1>

                    <p>
                        Execute SQL directly against the
                        utility billing database.
                    </p>
                </div>

                <div className="query-mode">
                    <button className="active">
                        SQL
                    </button>

                    <button
                        disabled
                        title="Coming later"
                    >
                        NL → SQL
                    </button>
                </div>
            </div>

            <div className="query-layout">

                {/* SIDEBAR */}
                <aside className="query-sidebar">
                    <span className="query-sidebar-title">
                        SAVED QUERIES
                    </span>

                    {sampleQueries.map(
                        (item) => (
                            <button
                                key={item.name}
                                onClick={() =>
                                    loadQuery(
                                        item.sql
                                    )
                                }
                            >
                                {item.name}
                            </button>
                        )
                    )}

                    <div className="query-info">
                        <span>DATABASE</span>

                        <strong>
                            utility_billing_db
                        </strong>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="query-main">

                    {/* EDITOR */}
                    <section className="editor-panel">
                        <div className="editor-header">
                            <span>
                                QUERY EDITOR
                            </span>

                            <button
                                className="run-button"
                                onClick={runQuery}
                                disabled={loading}
                            >
                                {loading
                                    ? "RUNNING..."
                                    : "RUN QUERY"}
                            </button>
                        </div>

                        <textarea
                            value={query}
                            onChange={(e) =>
                                setQuery(
                                    e.target.value
                                )
                            }
                            spellCheck="false"
                            placeholder="Enter SQL query..."
                        />
                    </section>

                    {/* RESULTS */}
                    <section className="results-panel">
                        <div className="results-header">
                            <div>
                                <span>
                                    RESULTS
                                </span>

                                <strong>
                                    {!executed
                                        ? "No execution"
                                        : loading
                                        ? "Executing..."
                                        : getResultSummary(
                                              result
                                          )}
                                </strong>
                            </div>

                            {executed &&
                                !error && (
                                    <span className="success-label">
                                        QUERY COMPLETE
                                    </span>
                                )}
                        </div>

                        {/* ERROR */}
                        {error ? (
                            <div className="results-error">
                                <strong>
                                    QUERY ERROR
                                </strong>

                                <span>
                                    {error}
                                </span>
                            </div>
                        ) : !executed ? (
                            <div className="results-empty">
                                Run a query to view
                                results.
                            </div>
                        ) : isRowResult ? (
                            <ResultTable
                                rows={resultRows}
                                columns={
                                    resultColumns
                                }
                            />
                        ) : (
                            <OperationResult
                                result={result}
                            />
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}


/* =========================================================
   RESULT TABLE
========================================================= */

function ResultTable({
    rows,
    columns,
}) {
    return (
        <div className="query-results-wrapper">
            <table className="query-results">
                <thead>
                    <tr>
                        {columns.map(
                            (column) => (
                                <th key={column}>
                                    {column}
                                </th>
                            )
                        )}
                    </tr>
                </thead>

                <tbody>
                    {rows.map(
                        (row, rowIndex) => (
                            <tr
                                key={rowIndex}
                            >
                                {columns.map(
                                    (column) => (
                                        <td
                                            key={
                                                column
                                            }
                                        >
                                            {formatValue(
                                                row[
                                                    column
                                                ]
                                            )}
                                        </td>
                                    )
                                )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}


/* =========================================================
   OPERATION RESULT
========================================================= */

function OperationResult({
    result,
}) {
    const operation =
        detectOperation(result);

    const affectedRows =
        getAffectedRows(result);

    const insertId =
        getInsertId(result);

    return (
        <div className="operation-result">
            <div className="operation-result-title">
                QUERY EXECUTED SUCCESSFULLY
            </div>

            <div className="operation-result-grid">

                <div>
                    <span>
                        OPERATION
                    </span>

                    <strong>
                        {operation}
                    </strong>
                </div>

                <div>
                    <span>
                        AFFECTED ROWS
                    </span>

                    <strong>
                        {affectedRows}
                    </strong>
                </div>

                {insertId !== null && (
                    <div>
                        <span>
                            INSERT ID
                        </span>

                        <strong>
                            {insertId}
                        </strong>
                    </div>
                )}
            </div>
        </div>
    );
}


/* =========================================================
   DATA HELPERS
========================================================= */

function getRows(result) {
    if (!result) {
        return [];
    }

    // Normal single SELECT result
    if (Array.isArray(result.result)) {
        if (
            result.result.length === 0
        ) {
            return [];
        }

        if (
            typeof result.result[0] ===
                "object" &&
            !Array.isArray(result.result[0])
        ) {
            return result.result;
        }
    }

    // Multiple statement result
    if (
        Array.isArray(result.result) &&
        Array.isArray(result.result[0])
    ) {
        for (
            const statementResult of result.result
        ) {
            if (
                Array.isArray(
                    statementResult
                ) &&
                statementResult.length > 0 &&
                typeof statementResult[0] ===
                    "object"
            ) {
                return statementResult;
            }
        }
    }

    return [];
}


function getColumns(
    result,
    rows
) {
    if (rows.length > 0) {
        return Object.keys(rows[0]);
    }

    if (
        result &&
        Array.isArray(result.fields) &&
        result.fields.length > 0
    ) {
        return result.fields.map(
            (field) =>
                field.name ||
                field.orgName ||
                "column"
        );
    }

    return [];
}


function getAffectedRows(result) {
    if (!result) {
        return 0;
    }

    if (
        typeof result.result
            ?.affectedRows === "number"
    ) {
        return result.result.affectedRows;
    }

    if (
        Array.isArray(result.result)
    ) {
        const operationResult =
            result.result.find(
                (item) =>
                    item &&
                    typeof item ===
                        "object" &&
                    typeof item.affectedRows ===
                        "number"
            );

        return (
            operationResult?.affectedRows ??
            0
        );
    }

    return 0;
}


function getInsertId(result) {
    if (!result) {
        return null;
    }

    if (
        typeof result.result
            ?.insertId === "number" &&
        result.result.insertId > 0
    ) {
        return result.result.insertId;
    }

    if (
        Array.isArray(result.result)
    ) {
        const operationResult =
            result.result.find(
                (item) =>
                    item &&
                    typeof item ===
                        "object" &&
                    typeof item.insertId ===
                        "number" &&
                    item.insertId > 0
            );

        return operationResult
            ? operationResult.insertId
            : null;
    }

    return null;
}


function detectOperation(result) {
    const queryResults =
        Array.isArray(result?.result)
            ? result.result
            : [result?.result];

    for (
        const item of queryResults
    ) {
        if (!item) continue;

        if (
            typeof item === "object" &&
            "affectedRows" in item
        ) {
            return "DML / DDL";
        }
    }

    return "SQL";
}


function getResultSummary(result) {
    const rows = getRows(result);

    if (rows.length > 0) {
        return `${rows.length} rows`;
    }

    const affectedRows =
        getAffectedRows(result);

    if (affectedRows > 0) {
        return `${affectedRows} affected`;
    }

    return "Query complete";
}


function formatValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    if (
        typeof value === "object"
    ) {
        return JSON.stringify(value);
    }

    return String(value);
}

export default QueryStudio;